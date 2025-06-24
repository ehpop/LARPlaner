package com.larplaner.mapper.scenario;

import com.larplaner.dto.scenario.action.ScenarioActionRequestDTO;
import com.larplaner.dto.scenario.action.ScenarioActionResponseDTO;
import com.larplaner.dto.scenario.action.UpdateScenarioActionRequestDTO;
import com.larplaner.mapper.action.ActionMapper;
import com.larplaner.model.scenario.ScenarioAction;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ScenarioActionMapper {

  private final ActionMapper actionMapper;

  /**
   * Maps ScenarioAction entity to ScenarioActionResponseDTO.
   */
  public ScenarioActionResponseDTO toDTO(ScenarioAction entity) {
    if (entity == null) {
      return null;
    }

    ScenarioActionResponseDTO dto = new ScenarioActionResponseDTO(actionMapper.toDTO(entity));

    if (entity.getScenario() != null) {
      dto.setScenarioId(entity.getScenario().getId());
    }

    return dto;
  }

  /**
   * Maps ScenarioActionRequestDTO to a new ScenarioAction entity. Scenario and base Action
   * association are handled separately in the service layer.
   */
  public ScenarioAction toEntity(ScenarioActionRequestDTO dto) {
    if (dto == null) {
      return null;
    }

    return new ScenarioAction(actionMapper.toEntity(dto));
  }

  /**
   * Updates an existing ScenarioAction entity from ScenarioActionUpdateRequestDTO. Scenario/Action
   * association updates are handled separately in the service layer.
   */
  public void updateEntityFromDTO(UpdateScenarioActionRequestDTO dto, ScenarioAction entity) {
    if (dto == null || entity == null) {
      return;
    }

    // Update base action fields using the base ActionMapper
    actionMapper.updateEntityFromDTO(dto, entity);
  }
}