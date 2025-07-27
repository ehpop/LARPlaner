package com.larplaner.service.scenario.impl;

import com.larplaner.dto.scenario.ScenarioRequestDTO;
import com.larplaner.dto.scenario.ScenarioResponseDTO;
import com.larplaner.dto.scenario.UpdateScenarioRequestDTO;
import com.larplaner.dto.scenario.action.ScenarioActionRequestDTO;
import com.larplaner.dto.scenario.action.UpdateScenarioActionRequestDTO;
import com.larplaner.dto.scenario.item.ScenarioItemRequestDTO;
import com.larplaner.dto.scenario.item.UpdateScenarioItemRequestDTO;
import com.larplaner.dto.scenario.itemAction.ScenarioItemActionRequestDTO;
import com.larplaner.dto.scenario.itemAction.UpdateScenarioItemActionRequestDTO;
import com.larplaner.dto.scenario.role.ScenarioRoleRequestDTO;
import com.larplaner.dto.scenario.role.UpdateScenarioRoleRequestDTO;
import com.larplaner.exception.EntityCouldNotBeDeleted;
import com.larplaner.mapper.scenario.ScenarioActionMapper;
import com.larplaner.mapper.scenario.ScenarioItemActionMapper;
import com.larplaner.mapper.scenario.ScenarioItemMapper;
import com.larplaner.mapper.scenario.ScenarioMapper;
import com.larplaner.mapper.scenario.ScenarioRoleMapper;
import com.larplaner.model.event.AssignedRole;
import com.larplaner.model.event.Event;
import com.larplaner.model.event.EventStatusEnum;
import com.larplaner.model.scenario.Scenario;
import com.larplaner.model.scenario.ScenarioAction;
import com.larplaner.model.scenario.ScenarioItem;
import com.larplaner.model.scenario.ScenarioItemAction;
import com.larplaner.model.scenario.ScenarioRole;
import com.larplaner.repository.event.EventRepository;
import com.larplaner.repository.scenario.ScenarioActionRepository;
import com.larplaner.repository.scenario.ScenarioItemActionRepository;
import com.larplaner.repository.scenario.ScenarioItemRepository;
import com.larplaner.repository.scenario.ScenarioRepository;
import com.larplaner.repository.scenario.ScenarioRoleRepository;
import com.larplaner.service.scenario.ScenarioService;
import jakarta.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScenarioServiceImpl implements ScenarioService {

  private final ScenarioRepository scenarioRepository;

  private final ScenarioMapper scenarioMapper;
  private final ScenarioRoleMapper scenarioRoleMapper;
  private final ScenarioActionMapper scenarioActionMapper;
  private final ScenarioItemMapper scenarioItemMapper;

  private final ScenarioItemActionMapper scenarioItemActionMapper;
  private final ScenarioRoleRepository scenarioRoleRepository;
  private final ScenarioItemRepository scenarioItemRepository;
  private final ScenarioActionRepository scenarioActionRepository;
  private final ScenarioItemActionRepository scenarioItemActionRepository;
  private final EventRepository eventRepository;

  @Override
  @Transactional(readOnly = true)
  public List<ScenarioResponseDTO> getAllScenarios() {
    return scenarioRepository.findAll().stream()
        .map(scenarioMapper::toDTO)
        .collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public ScenarioResponseDTO getScenarioById(UUID id) {
    return scenarioRepository.findById(id)
        .map(scenarioMapper::toDTO)
        .orElseThrow(() -> new EntityNotFoundException("Scenario not found with id: " + id));
  }

  @Override
  @Transactional
  public ScenarioResponseDTO createScenario(ScenarioRequestDTO scenarioDTO) {
    Scenario scenario = scenarioMapper.toEntity(scenarioDTO);

    createScenarioRoles(scenario, scenarioDTO.getRoles());
    createScenarioActions(scenario, scenarioDTO.getActions());
    createScenarioItems(scenario, scenarioDTO.getItems());

    Scenario savedScenario = scenarioRepository.save(scenario);

    return scenarioMapper.toDTO(savedScenario);
  }

  @Override
  @Transactional
  public ScenarioResponseDTO updateScenario(UUID id, UpdateScenarioRequestDTO scenarioDTO) {
    Scenario existingScenario = scenarioRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Scenario not found with id: " + id));

    scenarioMapper.updateEntityFromDTO(scenarioDTO, existingScenario);

    processScenarioRoles(existingScenario, scenarioDTO.getRoles());
    processScenarioItems(existingScenario, scenarioDTO.getItems());
    processScenarioActions(existingScenario, scenarioDTO.getActions());

    Scenario updatedScenario = scenarioRepository.save(existingScenario);

    updateEventAssignedRoles(updatedScenario);

    return scenarioMapper.toDTO(updatedScenario);
  }

  private void updateEventAssignedRoles(Scenario updatedScenario) {
    List<Event> eventsThatShouldHaveRolesUpdated = eventRepository.findAllByScenario_IdAndStatus(updatedScenario.getId(),
        EventStatusEnum.UPCOMING);

    eventsThatShouldHaveRolesUpdated.forEach(event -> {
      var assignedRoles = event.getAssignedRoles().stream()
          .map(AssignedRole::getScenarioRole).collect(Collectors.toSet());
      var newRolesInScenario = updatedScenario.getRoles();

      var rolesToDeleteFromEvent = event.getAssignedRoles().stream()
          .filter(assignedRole -> !newRolesInScenario.contains(assignedRole.getScenarioRole()))
          .toList();
      var rolesToAddToEvent = newRolesInScenario.stream()
          .filter(role -> !assignedRoles.contains(role))
          .map(role -> AssignedRole.builder().scenarioRole(role).event(event).build())
          .toList();

      event.getAssignedRoles().removeAll(rolesToDeleteFromEvent);
      event.getAssignedRoles().addAll(rolesToAddToEvent);
    });

    eventRepository.saveAll(eventsThatShouldHaveRolesUpdated);
    log.debug("Updated {} events related to scenario", eventsThatShouldHaveRolesUpdated.size());
  }

  @Override
  @Transactional
  public void deleteScenario(UUID id) {
    if (!scenarioRepository.existsById(id)) {
      throw new EntityNotFoundException("Scenario not found with id: " + id);
    }

    try {
      scenarioRepository.deleteById(id);
    } catch (DataIntegrityViolationException e) {
      log.warn("Failed to delete scenario {} due to a data integrity violation.", id, e);
      throw new EntityCouldNotBeDeleted(
          "Scenario with id " + id
              + " could not be deleted because it is still referenced by other entities (e.g., an Event).");
    }
  }

  /**
   * Converts a userEvents of ScenarioRoleDTOs to a userEvents of ScenarioRole entities. Assumes
   * ScenarioMapper has a method to map ScenarioRoleDTO to ScenarioRole.
   *
   * @param roleDTOs List of ScenarioRoleDTOs or null.
   */
  private void createScenarioRoles(Scenario scenario, List<ScenarioRoleRequestDTO> roleDTOs) {
    if (roleDTOs == null || roleDTOs.isEmpty()) {
      return;
    }

    roleDTOs.stream()
        .map(scenarioRoleMapper::toEntity)
        .forEach(scenario::addScenarioRole);
  }

  /**
   * Converts a userEvents of ScenarioActionDTOs to a userEvents of ScenarioAction entities. Uses
   * ScenarioActionMapper.
   *
   * @param actionDTOs List of ScenarioActionDTOs or null.
   */
  private void createScenarioActions(Scenario scenario, List<ScenarioActionRequestDTO> actionDTOs) {
    if (actionDTOs == null || actionDTOs.isEmpty()) {
      return;
    }

    actionDTOs.stream()
        .map(scenarioActionMapper::toEntity)
        .forEach(scenario::addScenarioAction);
  }

  /**
   * Converts a userEvents of ScenarioItemDTOs to a userEvents of ScenarioItem entities. Assumes
   * ScenarioMapper has a method to map ScenarioItemDTO to ScenarioItem. May need enhancement later
   * for nested item actions.
   *
   * @param itemDTOs List of ScenarioItemDTOs or null.
   */
  private void createScenarioItems(Scenario scenario, List<ScenarioItemRequestDTO> itemDTOs) {
    if (itemDTOs == null || itemDTOs.isEmpty()) {
      return;
    }

    itemDTOs
        .forEach(itemDTO -> {
          ScenarioItem scenarioItem = scenarioItemMapper.toEntity(itemDTO);
          itemDTO.getActions().stream().map(scenarioItemActionMapper::toEntity)
              .forEach(scenarioItem::addScenarioItemAction);

          scenario.addScenarioItem(scenarioItem);
        });
  }

  private void processScenarioRoles(Scenario existingScenario,
      List<UpdateScenarioRoleRequestDTO> roles) {
    if (Objects.isNull(roles) || roles.isEmpty()) {
      deleteScenarioRoles(existingScenario, existingScenario.getRoles());
      return;
    }

    var existingRoles = existingScenario.getRoles();
    var existingRolesIds = existingRoles.stream().map(ScenarioRole::getId)
        .collect(Collectors.toSet());
    var rolesToAdd = new ArrayList<ScenarioRoleRequestDTO>();
    var rolesToUpdate = new ArrayList<UpdateScenarioRoleRequestDTO>();

    roles.forEach(roleRequestDTO -> {
      if (Objects.isNull(roleRequestDTO.getId())) {
        rolesToAdd.add(roleRequestDTO);
      } else if (existingRolesIds.contains(roleRequestDTO.getId())) {
        rolesToUpdate.add(roleRequestDTO);
        existingRolesIds.remove(roleRequestDTO.getId());
      }
    });

    var rolesToDelete = scenarioRoleRepository.findAllById(existingRolesIds);

    createScenarioRoles(existingScenario, rolesToAdd);
    updateScenarioRoles(existingScenario, rolesToUpdate);
    deleteScenarioRoles(existingScenario, rolesToDelete);
  }

  private void updateScenarioRoles(Scenario existingScenario,
      List<UpdateScenarioRoleRequestDTO> rolesToUpdate) {
    if (rolesToUpdate.isEmpty()) {
      return;
    }
    Map<UUID, UpdateScenarioRoleRequestDTO> updateDTOMap = rolesToUpdate.stream()
        .collect(Collectors.toMap(UpdateScenarioRoleRequestDTO::getId, dto -> dto));

    existingScenario.getRoles().stream()
        .filter(role -> updateDTOMap.containsKey(role.getId()))
        .forEach(scenarioRole -> {
          UpdateScenarioRoleRequestDTO updateRoleDTO = updateDTOMap.get(scenarioRole.getId());
          scenarioRoleMapper.updateEntityFromDTO(updateRoleDTO, scenarioRole);
        });
  }

  private void deleteScenarioRoles(Scenario existingScenario,
      List<ScenarioRole> rolesToDelete) {
    existingScenario.getRoles().removeAll(rolesToDelete);
  }

  private void processScenarioItems(Scenario existingScenario,
      List<UpdateScenarioItemRequestDTO> items) {
    if (Objects.isNull(items) || items.isEmpty()) {
      deleteScenarioItems(existingScenario, existingScenario.getItems());
      return;
    }

    var existingItems = existingScenario.getItems();
    var existingItemIds = existingItems.stream().map(ScenarioItem::getId)
        .collect(Collectors.toSet());
    var itemsToAdd = new ArrayList<ScenarioItemRequestDTO>();
    var itemsToUpdate = new ArrayList<UpdateScenarioItemRequestDTO>();

    items.forEach(itemRequestDTO -> {
      if (Objects.isNull(itemRequestDTO.getId())) {
        itemsToAdd.add(ScenarioItemRequestDTO.fromUpdateDTO(itemRequestDTO));
      } else if (existingItemIds.contains(itemRequestDTO.getId())) {
        itemsToUpdate.add(itemRequestDTO);
        existingItemIds.remove(itemRequestDTO.getId());
      }
    });

    var itemsToDelete = scenarioItemRepository.findAllById(existingItemIds);

    createScenarioItems(existingScenario, itemsToAdd);
    updateScenarioItems(existingScenario, itemsToUpdate);
    deleteScenarioItems(existingScenario, itemsToDelete);
  }

  private void updateScenarioItems(Scenario existingScenario,
      List<UpdateScenarioItemRequestDTO> itemsToUpdate) {
    if (Objects.isNull(itemsToUpdate) || itemsToUpdate.isEmpty()) {
      return;
    }

    Map<UUID, UpdateScenarioItemRequestDTO> updateDTOMap = itemsToUpdate.stream()
        .collect(Collectors.toMap(UpdateScenarioItemRequestDTO::getId, dto -> dto));

    existingScenario.getItems().stream()
        .filter(role -> updateDTOMap.containsKey(role.getId()))
        .forEach(scenarioItem -> {
          UpdateScenarioItemRequestDTO updateScenarioItemDTO = updateDTOMap.get(
              scenarioItem.getId());
          scenarioItemMapper.updateEntityFromUpdateDTO(scenarioItem, updateScenarioItemDTO);
          processScenarioItemActions(scenarioItem, updateScenarioItemDTO.getActions());
        });
  }

  private void deleteScenarioItems(Scenario existingScenario,
      List<ScenarioItem> itemsToDelete) {
    existingScenario.getItems().removeAll(itemsToDelete);
  }

  private void processScenarioItemActions(ScenarioItem scenarioItem,
      List<UpdateScenarioItemActionRequestDTO> actions) {
    if (Objects.isNull(actions) || actions.isEmpty()) {
      deleteScenarioItemActions(scenarioItem, scenarioItem.getActions());
      return;
    }

    var existingItemActions = scenarioItem.getActions();
    var existingItemActionIds = existingItemActions.stream().map(ScenarioItemAction::getId)
        .collect(Collectors.toSet());
    var actionsToAdd = new ArrayList<ScenarioItemActionRequestDTO>();
    var actionsToUpdate = new ArrayList<UpdateScenarioItemActionRequestDTO>();

    actions.forEach(actionRequestDTO -> {
      if (Objects.isNull(actionRequestDTO.getId())) {
        actionsToAdd.add(actionRequestDTO);
      } else if (existingItemActionIds.contains(actionRequestDTO.getId())) {
        actionsToUpdate.add(actionRequestDTO);
        existingItemActionIds.remove(actionRequestDTO.getId());
      }
    });

    var actionsToDelete = scenarioItemActionRepository.findAllById(existingItemActionIds);

    actionsToAdd.forEach(
        action -> scenarioItem.addScenarioItemAction(scenarioItemActionMapper.toEntity(action)));
    updateScenarioItemActions(scenarioItem, actionsToUpdate);
    deleteScenarioItemActions(scenarioItem, actionsToDelete);
  }

  private void updateScenarioItemActions(ScenarioItem scenarioItem,
      ArrayList<UpdateScenarioItemActionRequestDTO> actionsToUpdate) {
    if (actionsToUpdate.isEmpty()) {
      return;
    }

    Map<UUID, UpdateScenarioItemActionRequestDTO> updateDTOMap = actionsToUpdate.stream()
        .collect(Collectors.toMap(UpdateScenarioItemActionRequestDTO::getId, dto -> dto));

    scenarioItem.getActions().stream()
        .filter(itemAction -> updateDTOMap.containsKey(itemAction.getId()))
        .forEach(itemAction -> {
          UpdateScenarioItemActionRequestDTO updateScenarioItemDTO = updateDTOMap.get(
              itemAction.getId());
          scenarioItemActionMapper.updateEntityFromDTO(updateScenarioItemDTO, itemAction);
        });
  }

  private void deleteScenarioItemActions(ScenarioItem scenarioItem,
      List<ScenarioItemAction> actionsToDelete) {
    scenarioItem.getActions().removeAll(actionsToDelete);
  }

  private void processScenarioActions(Scenario existingScenario,
      List<UpdateScenarioActionRequestDTO> actions) {
    if (Objects.isNull(actions) || actions.isEmpty()) {
      deleteScenarioActions(existingScenario, existingScenario.getActions());
      return;
    }

    var existingActions = existingScenario.getActions();
    var existingActionIds = existingActions.stream().map(ScenarioAction::getId)
        .collect(Collectors.toSet());
    var actionsToAdd = new ArrayList<ScenarioActionRequestDTO>();
    var actionsToUpdate = new ArrayList<UpdateScenarioActionRequestDTO>();

    actions.forEach(actionRequestDTO -> {
      if (Objects.isNull(actionRequestDTO.getId())) {
        actionsToAdd.add(actionRequestDTO);
      } else if (existingActionIds.contains(actionRequestDTO.getId())) {
        actionsToUpdate.add(actionRequestDTO);
        existingActionIds.remove(actionRequestDTO.getId());
      }
    });

    var actionsToDelete = scenarioActionRepository.findAllById(existingActionIds);

    createScenarioActions(existingScenario, actionsToAdd);
    updateScenarioActions(existingScenario, actionsToUpdate);
    deleteScenarioActions(existingScenario, actionsToDelete);
  }

  private void updateScenarioActions(Scenario existingScenario,
      List<UpdateScenarioActionRequestDTO> actionsToUpdate) {
    if (actionsToUpdate.isEmpty()) {
      return;
    }

    Map<UUID, UpdateScenarioActionRequestDTO> updateDTOMap = actionsToUpdate.stream()
        .collect(Collectors.toMap(UpdateScenarioActionRequestDTO::getId, dto -> dto));

    existingScenario.getActions().stream()
        .filter(action -> updateDTOMap.containsKey(action.getId()))
        .forEach(scenarioAction -> {
          UpdateScenarioActionRequestDTO updateActionDTO = updateDTOMap.get(scenarioAction.getId());
          scenarioActionMapper.updateEntityFromDTO(updateActionDTO, scenarioAction);
        });
  }

  private void deleteScenarioActions(Scenario existingScenario,
      List<ScenarioAction> actionsToDelete) {
    existingScenario.getActions().removeAll(actionsToDelete);
  }

}
