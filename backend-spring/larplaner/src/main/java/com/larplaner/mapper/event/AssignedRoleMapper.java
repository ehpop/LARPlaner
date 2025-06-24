package com.larplaner.mapper.event;

import com.larplaner.dto.event.assignedRole.AssignedRoleRequestDTO;
import com.larplaner.dto.event.assignedRole.AssignedRoleResponseDTO;
import com.larplaner.dto.event.assignedRole.AssignedRoleUpdateRequestDTO;
import com.larplaner.model.event.AssignedRole;
import com.larplaner.repository.event.EventRepository;
import com.larplaner.repository.scenario.ScenarioRoleRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class AssignedRoleMapper {

  private final ScenarioRoleRepository scenarioRoleRepository;

  public AssignedRoleMapper(ScenarioRoleRepository scenarioRoleRepository) {
    this.scenarioRoleRepository = scenarioRoleRepository;
  }

  public AssignedRoleResponseDTO toDTO(AssignedRole assignedRole) {
    log.info("AssignedRole = {}", assignedRole);

    return AssignedRoleResponseDTO.builder()
        .id(assignedRole.getId())
        .scenarioRoleId(assignedRole.getScenarioRole() != null ? assignedRole.getScenarioRole().getId() : null)
        .assignedEmail(assignedRole.getAssignedEmail())
        .eventId(assignedRole.getEvent() != null ? assignedRole.getEvent().getId() : null)
        .build();
  }

  /**
   * Event should be set later
   *
   * @param dto
   * @return
   */
  public AssignedRole toEntity(AssignedRoleRequestDTO dto) {
    return AssignedRole.builder()
        .assignedEmail(dto.getAssignedEmail())
        .scenarioRole(scenarioRoleRepository.getReferenceById(dto.getScenarioRoleId()))
        .build();
  }

  /**
   * Event should be set later
   *
   * @param dto
   * @return
   */
  public AssignedRole toEntity(AssignedRoleUpdateRequestDTO dto) {
    return AssignedRole.builder()
        .assignedEmail(dto.getAssignedEmail())
        .scenarioRole(scenarioRoleRepository.getReferenceById(dto.getScenarioRoleId()))
        .build();
  }

}