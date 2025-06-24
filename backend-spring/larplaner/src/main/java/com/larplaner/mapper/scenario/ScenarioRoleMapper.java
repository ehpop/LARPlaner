package com.larplaner.mapper.scenario;

import com.larplaner.dto.scenario.role.ScenarioRoleRequestDTO;
import com.larplaner.dto.scenario.role.ScenarioRoleResponseDTO;
import com.larplaner.dto.scenario.role.UpdateScenarioRoleRequestDTO;
import com.larplaner.model.scenario.ScenarioRole;
import com.larplaner.repository.role.RoleRepository;
import org.springframework.stereotype.Component;

@Component
public class ScenarioRoleMapper {

  private final RoleRepository roleRepository;

  public ScenarioRoleMapper(RoleRepository roleRepository) {
    this.roleRepository = roleRepository;
  }

  /**
   * Maps a ScenarioRole entity to a ScenarioRoleResponseDTO.
   */
  public ScenarioRoleResponseDTO toDTO(ScenarioRole entity) {
    if (entity == null) {
      return null;
    }

    return ScenarioRoleResponseDTO.builder()
        .id(entity.getId())
        .roleId(entity.getRole() != null ? entity.getRole().getId() : null)
        .scenarioId(entity.getScenario() != null ? entity.getScenario().getId() : null)
        .descriptionForGM(entity.getDescriptionForGM())
        .descriptionForOwner(entity.getDescriptionForOwner())
        .descriptionForOthers(entity.getDescriptionForOthers())
        .build();
  }

  /**
   * Maps a ScenarioRoleRequestDTO to a new ScenarioRole entity. Note: Role and Scenario
   * associations must be handled by the service layer.
   */
  public ScenarioRole toEntity(ScenarioRoleRequestDTO dto) {
    if (dto == null) {
      return null;
    }

    return ScenarioRole.builder()
        .role(roleRepository.getReferenceById(dto.getRoleId()))
        .descriptionForGM(dto.getDescriptionForGM())
        .descriptionForOwner(dto.getDescriptionForOwner())
        .descriptionForOthers(dto.getDescriptionForOthers())
        .build();
  }

  /**
   * Updates an existing ScenarioRole entity from an UpdateScenarioRoleRequestDTO.
   */
  public void updateEntityFromDTO(UpdateScenarioRoleRequestDTO dto, ScenarioRole entity) {
    if (dto == null || entity == null) {
      return;
    }

    if (dto.getDescriptionForGM() != null) {
      entity.setDescriptionForGM(dto.getDescriptionForGM());
    }
    if (dto.getDescriptionForOwner() != null) {
      entity.setDescriptionForOwner(dto.getDescriptionForOwner());
    }
    if (dto.getDescriptionForOthers() != null) {
      entity.setDescriptionForOthers(dto.getDescriptionForOthers());
    }
  }
}