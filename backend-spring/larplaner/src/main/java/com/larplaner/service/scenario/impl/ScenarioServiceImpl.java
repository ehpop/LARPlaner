package com.larplaner.service.scenario.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.larplaner.dto.scenario.ScenarioRequestDTO;
import com.larplaner.dto.scenario.ScenarioResponseDTO;
import com.larplaner.dto.scenario.UpdateScenarioRequestDTO;
import com.larplaner.dto.scenario.action.ScenarioActionRequestDTO;
import com.larplaner.dto.scenario.item.ScenarioItemRequestDTO;
import com.larplaner.dto.scenario.role.ScenarioRoleRequestDTO;
import com.larplaner.exception.EntityCouldNotBeDeleted;
import com.larplaner.mapper.scenario.ScenarioActionMapper;
import com.larplaner.mapper.scenario.ScenarioItemActionMapper;
import com.larplaner.mapper.scenario.ScenarioItemMapper;
import com.larplaner.mapper.scenario.ScenarioMapper;
import com.larplaner.mapper.scenario.ScenarioRoleMapper;
import com.larplaner.model.scenario.Scenario;
import com.larplaner.model.scenario.ScenarioItem;
import com.larplaner.repository.event.EventRepository;
import com.larplaner.repository.scenario.ScenarioRepository;
import com.larplaner.service.scenario.ScenarioService;
import com.larplaner.service.tag.helper.TagHelper;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScenarioServiceImpl implements ScenarioService {

  private final ScenarioRepository scenarioRepository;

  private final ScenarioMapper scenarioMapper;
  private final ScenarioRoleMapper scenarioRoleMapper;
  private final ScenarioActionMapper scenarioActionMapper;
  private final ScenarioItemMapper scenarioItemMapper;

  private final TagHelper tagHelper;
  private final ScenarioItemActionMapper scenarioItemActionMapper;
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

    // Note: Simple update only updates fields present in UpdateScenarioRequestDTO
    // via the mapper.
    // Handling updates to collections (roles, actions, items, tags) often requires
    // more complex logic: clearing existing collections and adding new ones,
    // or diffing the collections to add/remove specific elements.
    // This example assumes the mapper handles basic field updates.
    // Collection updates might need explicit handling here or dedicated methods.
    scenarioMapper.updateEntityFromDTO(scenarioDTO, existingScenario);

    // Example: If UpdateScenarioRequestDTO contained lists for updates:
    // if (scenarioDTO.getRoles() != null) {
    // List<ScenarioRole> updatedRoles =
    // createScenarioRoles(scenarioDTO.getRoles());
    // // Logic to merge/replace existingScenario.getRoles()
    // // e.g., existingScenario.getRoles().clear();
    // existingScenario.getRoles().addAll(updatedRoles);
    // // Ensure associations are correct after update.
    // }
    // Similar logic for actions, items, tags if they are updatable via this DTO.

    Scenario updatedScenario = scenarioRepository.save(existingScenario);

    return scenarioMapper.toDTO(updatedScenario);
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
      var event = eventRepository.findByScenarioId(id).orElseThrow(EntityNotFoundException::new);
      throw new EntityCouldNotBeDeleted(
          "Scenario could not be deleted because it is referenced in event: " + event.getId());
    }
  }

  /**
   * Converts a list of ScenarioRoleDTOs to a list of ScenarioRole entities.
   * Assumes ScenarioMapper
   * has a method to map ScenarioRoleDTO to ScenarioRole.
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
   * Converts a list of ScenarioActionDTOs to a list of ScenarioAction entities.
   * Uses
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
   * Converts a list of ScenarioItemDTOs to a list of ScenarioItem entities.
   * Assumes ScenarioMapper
   * has a method to map ScenarioItemDTO to ScenarioItem. May need enhancement
   * later for nested item
   * actions.
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
          log.info("scenarioItem = {}", scenarioItem);
          itemDTO.getActions().stream().map(scenarioItemActionMapper::toEntity)
              .forEach(scenarioItem::addScenarioItemAction);

          scenario.addScenarioItem(scenarioItem);
        });
  }

  /**
   * Helper method to set bidirectional relationships after mapping. For example,
   * if ScenarioItem
   * has a @ManyToOne back to Scenario. Call this *after* all lists have been set
   * on the scenario
   * object.
   *
   * @param scenario The Scenario entity with its collections populated.
   */
  private void associateEntities(Scenario scenario) {
    if (scenario.getRoles() != null) {
      scenario.getRoles().forEach(scenario::addScenarioRole);
    }
    if (scenario.getActions() != null) {
      scenario.getActions().forEach(scenario::addScenarioAction);
    }
    if (scenario.getItems() != null) {
      scenario.getItems().forEach(scenarioItem -> {
        scenarioItem.getActions().forEach(scenarioItem::addScenarioItemAction);
        scenario.addScenarioItem(scenarioItem);
      });
    }
  }
}