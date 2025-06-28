package com.larplaner.service.scenario;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.larplaner.dto.scenario.ScenarioRequestDTO;
import com.larplaner.dto.scenario.ScenarioResponseDTO;
import com.larplaner.dto.scenario.UpdateScenarioRequestDTO;
import com.larplaner.dto.scenario.action.UpdateScenarioActionRequestDTO;
import com.larplaner.dto.scenario.item.UpdateScenarioItemRequestDTO;
import com.larplaner.dto.scenario.itemAction.UpdateScenarioItemActionRequestDTO;
import com.larplaner.dto.scenario.role.UpdateScenarioRoleRequestDTO;
import com.larplaner.exception.EntityCouldNotBeDeleted;
import com.larplaner.mapper.scenario.ScenarioActionMapper;
import com.larplaner.mapper.scenario.ScenarioItemActionMapper;
import com.larplaner.mapper.scenario.ScenarioItemMapper;
import com.larplaner.mapper.scenario.ScenarioMapper;
import com.larplaner.mapper.scenario.ScenarioRoleMapper;
import com.larplaner.model.scenario.Scenario;
import com.larplaner.model.scenario.ScenarioAction;
import com.larplaner.model.scenario.ScenarioItem;
import com.larplaner.model.scenario.ScenarioItemAction;
import com.larplaner.model.scenario.ScenarioRole;
import com.larplaner.repository.scenario.ScenarioActionRepository;
import com.larplaner.repository.scenario.ScenarioItemActionRepository;
import com.larplaner.repository.scenario.ScenarioItemRepository;
import com.larplaner.repository.scenario.ScenarioRepository;
import com.larplaner.repository.scenario.ScenarioRoleRepository;
import com.larplaner.service.scenario.impl.ScenarioServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

@ExtendWith(MockitoExtension.class)
class ScenarioServiceTest_Impl implements ScenarioServiceTest {

  @InjectMocks
  private ScenarioServiceImpl scenarioService;

  @Mock
  private ScenarioRepository scenarioRepository;
  @Mock
  private ScenarioMapper scenarioMapper;
  @Mock
  private ScenarioRoleMapper scenarioRoleMapper;
  @Mock
  private ScenarioActionMapper scenarioActionMapper;
  @Mock
  private ScenarioItemMapper scenarioItemMapper;
  @Mock
  private ScenarioItemActionMapper scenarioItemActionMapper;
  @Mock
  private ScenarioRoleRepository scenarioRoleRepository;
  @Mock
  private ScenarioItemRepository scenarioItemRepository;
  @Mock
  private ScenarioActionRepository scenarioActionRepository;
  @Mock
  private ScenarioItemActionRepository scenarioItemActionRepository;

  private UUID scenarioId;
  private Scenario existingScenario;

  @BeforeEach
  void setUp() {
    scenarioId = UUID.randomUUID();
    existingScenario = Scenario.builder()
        .id(scenarioId)
        .name("Original Name")
        .roles(new ArrayList<>()) // Use mutable lists for testing additions/removals
        .items(new ArrayList<>())
        .actions(new ArrayList<>())
        .build();
  }

  // === getScenarioById Tests ===

  @Test
  @DisplayName("getScenarioById: Should return scenario DTO when scenario exists")
  @Override
  public void getScenarioById_whenScenarioExists_shouldReturnCorrectDTO() {
    // Arrange
    when(scenarioRepository.findById(scenarioId)).thenReturn(Optional.of(existingScenario));
    when(scenarioMapper.toDTO(any(Scenario.class))).thenAnswer(inv ->
        ScenarioResponseDTO.builder()
            .id(((Scenario) inv.getArgument(0)).getId())
            .name(((Scenario) inv.getArgument(0)).getName())
            .build()
    );

    // Act
    ScenarioResponseDTO result = scenarioService.getScenarioById(scenarioId);

    // Assert
    assertThat(result).isNotNull();
    assertThat(result.getId()).isEqualTo(scenarioId);
    verify(scenarioRepository).findById(scenarioId);
    verify(scenarioMapper).toDTO(existingScenario);
  }

  @Test
  @DisplayName("getScenarioById: Should throw EntityNotFoundException when scenario does not exist")
  @Override
  public void getScenarioById_whenScenarioDoesNotExist_shouldThrowEntityNotFoundException() {
    // Arrange
    when(scenarioRepository.findById(scenarioId)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(EntityNotFoundException.class, () -> scenarioService.getScenarioById(scenarioId));
    verify(scenarioRepository).findById(scenarioId);
  }

  // === getAllScenarios Tests ===

  @Test
  @DisplayName("getAllScenarios: Should return a list of scenario DTOs when scenarios exist")
  @Override
  public void getAllScenarios_whenScenariosExist_shouldReturnListOfDTOs() {
    // Arrange
    List<Scenario> scenarios = List.of(
        Scenario.builder().id(UUID.randomUUID()).build(),
        Scenario.builder().id(UUID.randomUUID()).build()
    );

    when(scenarioRepository.findAll()).thenReturn(scenarios);
    when(scenarioMapper.toDTO(any(Scenario.class))).thenAnswer(inv ->
        ScenarioResponseDTO.builder()
            .id(((Scenario) inv.getArgument(0)).getId())
            .build()
    );

    // Act
    List<ScenarioResponseDTO> result = scenarioService.getAllScenarios();

    // Assert
    assertThat(result).hasSize(2);
    verify(scenarioRepository).findAll();
    verify(scenarioMapper, times(2)).toDTO(any(Scenario.class));
  }

  @Test
  @DisplayName("getAllScenarios: Should return an empty list when no scenarios exist")
  @Override
  public void getAllScenarios_whenNoScenariosExist_shouldReturnEmptyList() {
    // Arrange
    when(scenarioRepository.findAll()).thenReturn(Collections.emptyList());

    // Act
    List<ScenarioResponseDTO> result = scenarioService.getAllScenarios();

    // Assert
    assertThat(result).isNotNull().isEmpty();
    verify(scenarioRepository).findAll();
    verify(scenarioMapper, never()).toDTO(any());
  }

  // === createScenario Tests ===

  @Test
  @DisplayName("createScenario: Should correctly map, save, and return a new scenario DTO")
  @Override
  public void createScenario_withValidData_shouldSaveAndReturnDTO() {
    // Arrange
    ScenarioRequestDTO requestDTO = ScenarioRequestDTO.builder()
        .name("New Scenario").description("Desc")
        .roles(List.of()).items(List.of()).actions(List.of())
        .build();
    Scenario scenarioToSave = Scenario.builder().name("New Scenario").build();
    Scenario savedScenario = Scenario.builder().id(scenarioId).name("New Scenario").build();
    ScenarioResponseDTO responseDTO = ScenarioResponseDTO.builder().id(scenarioId)
        .name("New Scenario").build();

    when(scenarioMapper.toEntity(requestDTO)).thenReturn(scenarioToSave);
    when(scenarioRepository.save(scenarioToSave)).thenReturn(savedScenario);
    when(scenarioMapper.toDTO(savedScenario)).thenReturn(responseDTO);

    // Act
    ScenarioResponseDTO result = scenarioService.createScenario(requestDTO);

    // Assert
    assertThat(result).isNotNull();
    assertThat(result.getId()).isEqualTo(scenarioId);
    verify(scenarioMapper).toEntity(requestDTO);
    verify(scenarioRepository).save(scenarioToSave);
    verify(scenarioMapper).toDTO(savedScenario);
  }

  // === deleteScenario Tests ===

  @Test
  @DisplayName("deleteScenario: Should call deleteById when scenario exists")
  @Override
  public void deleteScenario_whenScenarioExists_shouldCallDeleteById() {
    // Arrange
    when(scenarioRepository.existsById(scenarioId)).thenReturn(true);
    // Act
    scenarioService.deleteScenario(scenarioId);
    // Assert
    verify(scenarioRepository).existsById(scenarioId);
    verify(scenarioRepository).deleteById(scenarioId);
  }

  @Test
  @DisplayName("deleteScenario: Should throw EntityNotFoundException when scenario does not exist")
  @Override
  public void deleteScenario_whenScenarioDoesNotExist_shouldThrowEntityNotFoundException() {
    // Arrange
    when(scenarioRepository.existsById(scenarioId)).thenReturn(false);
    // Act & Assert
    assertThrows(EntityNotFoundException.class, () -> scenarioService.deleteScenario(scenarioId));
    verify(scenarioRepository).existsById(scenarioId);
    verify(scenarioRepository, never()).deleteById(any());
  }

  @Test
  @DisplayName("deleteScenario: Should throw EntityCouldNotBeDeleted on data integrity violation")
  @Override
  public void deleteScenario_whenDataIntegrityViolationOccurs_shouldThrowEntityCouldNotBeDeleted() {
    // Arrange
    when(scenarioRepository.existsById(scenarioId)).thenReturn(true);
    doThrow(new DataIntegrityViolationException("fk constraint violation"))
        .when(scenarioRepository).deleteById(scenarioId);
    // Act & Assert
    assertThrows(EntityCouldNotBeDeleted.class, () -> scenarioService.deleteScenario(scenarioId));
    verify(scenarioRepository).existsById(scenarioId);
    verify(scenarioRepository).deleteById(scenarioId);
  }

  // === updateScenario Tests ===

  @Test
  @DisplayName("updateScenario: Should throw EntityNotFoundException when scenario to update does not exist")
  @Override
  public void updateScenario_whenScenarioDoesNotExist_shouldThrowEntityNotFoundException() {
    // Arrange
    when(scenarioRepository.findById(scenarioId)).thenReturn(Optional.empty());
    UpdateScenarioRequestDTO updateDTO = UpdateScenarioRequestDTO.builder().name("New Name")
        .build();

    // Act & Assert
    assertThrows(EntityNotFoundException.class,
        () -> scenarioService.updateScenario(scenarioId, updateDTO));
  }

  @Test
  @DisplayName("updateScenario: Should update basic scenario fields (name, description)")
  @Override
  public void updateScenario_whenOnlyNameAndDescriptionChanged_shouldUpdateAndSaveChanges() {
    // Arrange
    when(scenarioRepository.findById(scenarioId)).thenReturn(Optional.of(existingScenario));
    when(scenarioRepository.save(any(Scenario.class))).thenReturn(existingScenario);

    UpdateScenarioRequestDTO updateDTO = UpdateScenarioRequestDTO.builder()
        .name("Updated Name").description("Updated Description")
        .roles(List.of()).items(List.of()).actions(List.of())
        .build();
    ArgumentCaptor<Scenario> scenarioCaptor = ArgumentCaptor.forClass(Scenario.class);

    // Act
    scenarioService.updateScenario(scenarioId, updateDTO);

    // Assert
    verify(scenarioRepository).save(scenarioCaptor.capture());
    verify(scenarioMapper).updateEntityFromDTO(updateDTO, scenarioCaptor.getValue());
  }

  @Test
  @DisplayName("updateScenario: Should ADD a new role to an existing scenario")
  @Override
  public void updateScenario_whenNewRoleIsAdded_shouldCreateNewRole() {
    // Arrange
    when(scenarioRepository.findById(scenarioId)).thenReturn(Optional.of(existingScenario));
    when(scenarioRepository.save(any(Scenario.class))).thenReturn(existingScenario);
    when(scenarioRoleMapper.toEntity(
        any(com.larplaner.dto.scenario.role.ScenarioRoleRequestDTO.class)))
        .thenReturn(ScenarioRole.builder().build());

    UpdateScenarioRoleRequestDTO newRoleDTO = UpdateScenarioRoleRequestDTO.builder()
        .id(null).roleId(UUID.randomUUID()).descriptionForGM("New Role").build();
    UpdateScenarioRequestDTO updateDTO = UpdateScenarioRequestDTO.builder()
        .roles(List.of(newRoleDTO)).build();

    // Act
    scenarioService.updateScenario(scenarioId, updateDTO);

    // Assert
    ArgumentCaptor<Scenario> scenarioCaptor = ArgumentCaptor.forClass(Scenario.class);
    verify(scenarioRepository).save(scenarioCaptor.capture());
    assertThat(scenarioCaptor.getValue().getRoles()).hasSize(1);
  }

  @Test
  @DisplayName("updateScenario: Should UPDATE an existing role in a scenario")
  @Override
  public void updateScenario_whenExistingRoleIsUpdated_shouldUpdateRole() {
    // Arrange
    ScenarioRole existingRole = ScenarioRole.builder().id(UUID.randomUUID()).build();
    existingScenario.addScenarioRole(existingRole);

    when(scenarioRepository.findById(scenarioId)).thenReturn(Optional.of(existingScenario));
    when(scenarioRepository.save(any(Scenario.class))).thenReturn(existingScenario);

    UpdateScenarioRoleRequestDTO updatedRoleDTO = UpdateScenarioRoleRequestDTO.builder()
        .id(existingRole.getId()).descriptionForGM("Updated Desc").build();
    UpdateScenarioRequestDTO updateDTO = UpdateScenarioRequestDTO.builder()
        .roles(List.of(updatedRoleDTO)).build();

    // Act
    scenarioService.updateScenario(scenarioId, updateDTO);

    // Assert
    verify(scenarioRoleMapper).updateEntityFromDTO(eq(updatedRoleDTO), eq(existingRole));
  }

  @Test
  @DisplayName("updateScenario: Should DELETE a role from a scenario")
  @Override
  public void updateScenario_whenRoleIsRemoved_shouldDeleteRole() {
    // Arrange
    ScenarioRole roleToDelete = ScenarioRole.builder().id(UUID.randomUUID()).build();
    existingScenario.addScenarioRole(roleToDelete);

    when(scenarioRepository.findById(scenarioId)).thenReturn(Optional.of(existingScenario));
    when(scenarioRepository.save(any(Scenario.class))).thenReturn(existingScenario);
    when(scenarioRoleRepository.findAllById(any())).thenReturn(List.of(roleToDelete));

    UpdateScenarioRequestDTO updateDTO = UpdateScenarioRequestDTO.builder().roles(List.of())
        .build();

    // Act
    scenarioService.updateScenario(scenarioId, updateDTO);

    // Assert
    ArgumentCaptor<Scenario> scenarioCaptor = ArgumentCaptor.forClass(Scenario.class);
    verify(scenarioRepository).save(scenarioCaptor.capture());
    assertThat(scenarioCaptor.getValue().getRoles()).isEmpty();
  }

  @Override
  public void updateScenario_whenRolesAreAddedUpdatedAndDeleted_shouldSynchronizeCorrectly() {

  }

  @Test
  @DisplayName("updateScenario: Should ADD a new item (with actions) to an existing scenario")
  @Override
  public void updateScenario_whenNewItemIsAdded_shouldCreateNewItem() {
    // Arrange
    when(scenarioRepository.findById(scenarioId)).thenReturn(Optional.of(existingScenario));
    when(scenarioRepository.save(any(Scenario.class))).thenReturn(existingScenario);
    when(scenarioItemMapper.toEntity(any())).thenReturn(ScenarioItem.builder().build());

    UpdateScenarioItemRequestDTO newItemDTO = UpdateScenarioItemRequestDTO.builder()
        .id(null).name("New Item").description("Desc").actions(List.of()).build();
    UpdateScenarioRequestDTO updateDTO = UpdateScenarioRequestDTO.builder()
        .items(List.of(newItemDTO)).build();

    // Act
    scenarioService.updateScenario(scenarioId, updateDTO);

    // Assert
    ArgumentCaptor<Scenario> scenarioCaptor = ArgumentCaptor.forClass(Scenario.class);
    verify(scenarioRepository).save(scenarioCaptor.capture());
    assertThat(scenarioCaptor.getValue().getItems()).hasSize(1);
  }

  @Test
  @DisplayName("updateScenario: Should DELETE an item from a scenario")
  @Override
  public void updateScenario_whenItemIsRemoved_shouldDeleteItem() {
    // Arrange
    ScenarioItem itemToDelete = ScenarioItem.builder().id(UUID.randomUUID()).build();
    existingScenario.addScenarioItem(itemToDelete);

    when(scenarioRepository.findById(scenarioId)).thenReturn(Optional.of(existingScenario));
    when(scenarioRepository.save(any(Scenario.class))).thenReturn(existingScenario);
    when(scenarioItemRepository.findAllById(any())).thenReturn(List.of(itemToDelete));

    UpdateScenarioRequestDTO updateDTO = UpdateScenarioRequestDTO.builder().items(List.of())
        .build();

    // Act
    scenarioService.updateScenario(scenarioId, updateDTO);

    // Assert
    ArgumentCaptor<Scenario> scenarioCaptor = ArgumentCaptor.forClass(Scenario.class);
    verify(scenarioRepository).save(scenarioCaptor.capture());
    assertThat(scenarioCaptor.getValue().getItems()).isEmpty();
  }

  @Test
  @DisplayName("updateScenario: Should ADD a new action to an existing item")
  @Override
  public void updateScenario_whenItemActionIsAddedToItem_shouldCreateNewItemAction() {
    // Arrange
    ScenarioItem existingItem = ScenarioItem.builder().id(UUID.randomUUID())
        .actions(new ArrayList<>()).build();
    existingScenario.addScenarioItem(existingItem);

    when(scenarioRepository.findById(scenarioId)).thenReturn(Optional.of(existingScenario));
    when(scenarioRepository.save(any(Scenario.class))).thenReturn(existingScenario);
    when(scenarioItemActionMapper.toEntity(any())).thenReturn(ScenarioItemAction.builder().build());

    UpdateScenarioItemActionRequestDTO newItemActionDTO = UpdateScenarioItemActionRequestDTO.builder()
        .name("New Action").build();
    UpdateScenarioItemRequestDTO updatedItemDTO = UpdateScenarioItemRequestDTO.builder()
        .id(existingItem.getId()).actions(List.of(newItemActionDTO)).build();
    UpdateScenarioRequestDTO updateDTO = UpdateScenarioRequestDTO.builder()
        .items(List.of(updatedItemDTO)).build();

    // Act
    scenarioService.updateScenario(scenarioId, updateDTO);

    // Assert
    ArgumentCaptor<Scenario> scenarioCaptor = ArgumentCaptor.forClass(Scenario.class);
    verify(scenarioRepository).save(scenarioCaptor.capture());
    assertThat(scenarioCaptor.getValue().getItems().get(0).getActions()).hasSize(1);
  }

  @Test
  @DisplayName("updateScenario: Should UPDATE an existing action on an item")
  @Override
  public void updateScenario_whenItemActionIsUpdated_shouldUpdateItemAction() {
    // Arrange
    ScenarioItemAction existingItemAction = ScenarioItemAction.builder().id(UUID.randomUUID())
        .build();
    ScenarioItem existingItem = ScenarioItem.builder()
        .id(UUID.randomUUID()).actions(new ArrayList<>(List.of(existingItemAction))).build();
    existingScenario.addScenarioItem(existingItem);

    when(scenarioRepository.findById(scenarioId)).thenReturn(Optional.of(existingScenario));
    when(scenarioRepository.save(any(Scenario.class))).thenReturn(existingScenario);

    UpdateScenarioItemActionRequestDTO updatedItemActionDTO = UpdateScenarioItemActionRequestDTO.builder()
        .id(existingItemAction.getId()).name("Updated Name").build();
    UpdateScenarioItemRequestDTO updatedItemDTO = UpdateScenarioItemRequestDTO.builder()
        .id(existingItem.getId()).actions(List.of(updatedItemActionDTO)).build();
    UpdateScenarioRequestDTO updateDTO = UpdateScenarioRequestDTO.builder()
        .items(List.of(updatedItemDTO)).build();

    // Act
    scenarioService.updateScenario(scenarioId, updateDTO);

    // Assert
    verify(scenarioItemActionMapper).updateEntityFromDTO(eq(updatedItemActionDTO),
        eq(existingItemAction));
  }

  @Test
  @DisplayName("updateScenario: Should DELETE an action from an existing item")
  @Override
  public void updateScenario_whenItemActionIsRemovedFromItem_shouldDeleteItemAction() {
    // Arrange
    ScenarioItemAction itemActionToDelete = ScenarioItemAction
        .builder()
        .id(UUID.randomUUID())
        .build();

    ScenarioItem existingItem = ScenarioItem
        .builder()
        .id(UUID.randomUUID())
        .actions(List.of(itemActionToDelete))
        .build();
    existingScenario.addScenarioItem(existingItem);

    when(scenarioRepository.findById(scenarioId)).thenReturn(Optional.of(existingScenario));
    when(scenarioRepository.save(any(Scenario.class))).thenReturn(existingScenario);
    when(scenarioItemActionRepository.findAllById(any())).thenReturn(List.of(itemActionToDelete));

    UpdateScenarioItemRequestDTO updatedItemDTO = UpdateScenarioItemRequestDTO
        .builder()
        .id(existingItem.getId())
        .actions(List.of())
        .build(); // Empty list of actions

    UpdateScenarioRequestDTO updateDTO = UpdateScenarioRequestDTO
        .builder()
        .items(List.of(updatedItemDTO))
        .build();

    // Act
    scenarioService.updateScenario(scenarioId, updateDTO);

    // Assert
    ArgumentCaptor<Scenario> scenarioCaptor = ArgumentCaptor.forClass(Scenario.class);
    verify(scenarioRepository).save(scenarioCaptor.capture());
    assertThat(scenarioCaptor.getValue().getItems().get(0).getActions()).isEmpty();
  }

  @Test
  @DisplayName("updateScenario: Should correctly synchronize scenario-level actions")
  @Override
  public void updateScenario_whenActionsAreSynchronized_shouldReflectChanges() {
    // Arrange
    ScenarioAction actionToUpdate = ScenarioAction.builder().id(UUID.randomUUID()).build();
    ScenarioAction actionToDelete = ScenarioAction.builder().id(UUID.randomUUID()).build();
    existingScenario.addScenarioAction(actionToUpdate);
    existingScenario.addScenarioAction(actionToDelete);

    when(scenarioRepository.findById(scenarioId)).thenReturn(Optional.of(existingScenario));
    when(scenarioRepository.save(any(Scenario.class))).thenReturn(existingScenario);
    when(scenarioActionRepository.findAllById(any())).thenReturn(List.of(actionToDelete));
    when(scenarioActionMapper.toEntity(any())).thenReturn(ScenarioAction.builder().build());

    UpdateScenarioActionRequestDTO newActionDTO = UpdateScenarioActionRequestDTO.builder()
        .name("New Action").build();
    UpdateScenarioActionRequestDTO updatedActionDTO = UpdateScenarioActionRequestDTO.builder()
        .id(actionToUpdate.getId()).name("Updated Action").build();
    UpdateScenarioRequestDTO updateDTO = UpdateScenarioRequestDTO.builder()
        .actions(List.of(newActionDTO, updatedActionDTO)).build();

    // Act
    scenarioService.updateScenario(scenarioId, updateDTO);

    // Assert
    ArgumentCaptor<Scenario> scenarioCaptor = ArgumentCaptor.forClass(Scenario.class);
    verify(scenarioRepository).save(scenarioCaptor.capture());
    Scenario savedScenario = scenarioCaptor.getValue();

    assertThat(savedScenario.getActions()).hasSize(2);
    verify(scenarioActionMapper).updateEntityFromDTO(eq(updatedActionDTO), eq(actionToUpdate));
  }
}