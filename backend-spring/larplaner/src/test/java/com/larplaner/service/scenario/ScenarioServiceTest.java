package com.larplaner.service.scenario;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public interface ScenarioServiceTest {

  // === getScenarioById Tests ===
  @Test
  @DisplayName("getScenarioById: Should return scenario DTO when scenario exists")
  void getScenarioById_whenScenarioExists_shouldReturnCorrectDTO();

  @Test
  @DisplayName("getScenarioById: Should throw EntityNotFoundException when scenario does not exist")
  void getScenarioById_whenScenarioDoesNotExist_shouldThrowEntityNotFoundException();

  // === getAllScenarios Tests ===
  @Test
  @DisplayName("getAllScenarios: Should return a list of scenario DTOs when scenarios exist")
  void getAllScenarios_whenScenariosExist_shouldReturnListOfDTOs();

  @Test
  @DisplayName("getAllScenarios: Should return an empty list when no scenarios exist")
  void getAllScenarios_whenNoScenariosExist_shouldReturnEmptyList();

  // === createScenario Tests ===
  @Test
  @DisplayName("createScenario: Should correctly map, save, and return a new scenario DTO")
  void createScenario_withValidData_shouldSaveAndReturnDTO();

  // === deleteScenario Tests ===
  @Test
  @DisplayName("deleteScenario: Should call deleteById when scenario exists")
  void deleteScenario_whenScenarioExists_shouldCallDeleteById();

  @Test
  @DisplayName("deleteScenario: Should throw EntityNotFoundException when scenario does not exist")
  void deleteScenario_whenScenarioDoesNotExist_shouldThrowEntityNotFoundException();

  @Test
  @DisplayName("deleteScenario: Should throw EntityCouldNotBeDeleted on data integrity violation")
  void deleteScenario_whenDataIntegrityViolationOccurs_shouldThrowEntityCouldNotBeDeleted();

  // === updateScenario Tests (Most Complex) ===

  @Test
  @DisplayName("updateScenario: Should throw EntityNotFoundException when scenario to update does not exist")
  void updateScenario_whenScenarioDoesNotExist_shouldThrowEntityNotFoundException();

  @Test
  @DisplayName("updateScenario: Should update basic scenario fields (name, description)")
  void updateScenario_whenOnlyNameAndDescriptionChanged_shouldUpdateAndSaveChanges();

  // --- Role Synchronization ---
  @Test
  @DisplayName("updateScenario: Should ADD a new role to an existing scenario")
  void updateScenario_whenNewRoleIsAdded_shouldCreateNewRole();

  @Test
  @DisplayName("updateScenario: Should UPDATE an existing role in a scenario")
  void updateScenario_whenExistingRoleIsUpdated_shouldUpdateRole();


  @Test
  @DisplayName("updateScenario: Should DELETE a role from a scenario")
  void updateScenario_whenRoleIsRemoved_shouldDeleteRole();

  @Test
  @DisplayName("updateScenario: Should correctly Add, Update, and Delete roles in a single operation")
  void updateScenario_whenRolesAreAddedUpdatedAndDeleted_shouldSynchronizeCorrectly();

  // --- Item Synchronization ---
  @Test
  @DisplayName("updateScenario: Should ADD a new item (with actions) to an existing scenario")
  void updateScenario_whenNewItemIsAdded_shouldCreateNewItem();

  @Test
  @DisplayName("updateScenario: Should DELETE an item from a scenario")
  void updateScenario_whenItemIsRemoved_shouldDeleteItem();

  // --- Nested Item-Action Synchronization ---
  @Test
  @DisplayName("updateScenario: Should ADD a new action to an existing item")
  void updateScenario_whenItemActionIsAddedToItem_shouldCreateNewItemAction();

  @Test
  @DisplayName("updateScenario: Should UPDATE an existing action on an item")
  void updateScenario_whenItemActionIsUpdated_shouldUpdateItemAction();

  @Test
  @DisplayName("updateScenario: Should DELETE an action from an existing item")
  void updateScenario_whenItemActionIsRemovedFromItem_shouldDeleteItemAction();

  // --- Action Synchronization ---
  @Test
  @DisplayName("updateScenario: Should correctly synchronize scenario-level actions")
  void updateScenario_whenActionsAreSynchronized_shouldReflectChanges();
}
