package com.larplaner.mapper.scenario;

import com.larplaner.dto.scenario.itemAction.ScenarioItemActionRequestDTO;
import com.larplaner.dto.scenario.itemAction.ScenarioItemActionResponseDTO;
import com.larplaner.dto.scenario.itemAction.UpdateScenarioItemActionRequestDTO;
import com.larplaner.mapper.action.ActionMapper;
import com.larplaner.model.scenario.ScenarioItemAction;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ScenarioItemActionMapper {

  private final ActionMapper actionMapper;

  /**
   * Maps ScenarioItemAction entity to ScenarioItemActionResponseDTO.
   */
  public ScenarioItemActionResponseDTO toDTO(ScenarioItemAction entity) {
    if (entity == null) {
      return null;
    }

    ScenarioItemActionResponseDTO dto = new ScenarioItemActionResponseDTO(
        actionMapper.toDTO(entity));

    if (entity.getItem() != null) {
      dto.setItemId(entity.getItem().getId());
    }

    return dto;
  }

  /**
   * Maps ScenarioItemActionRequestDTO to a new ScenarioItemAction entity. Item association and Tag
   * associations are handled separately in the service layer.
   */
  public ScenarioItemAction toEntity(ScenarioItemActionRequestDTO dto) {
    if (dto == null) {
      return null;
    }
    return new ScenarioItemAction(actionMapper.toEntity(dto));
  }

  /**
   * Updates an existing ScenarioItemAction entity from UpdateScenarioItemActionRequestDTO. Item/Tag
   * association updates are handled separately in the service layer.
   */
  public void updateEntityFromDTO(UpdateScenarioItemActionRequestDTO dto,
      ScenarioItemAction entity) {
    if (dto == null || entity == null) {
      return;
    }

    actionMapper.updateEntityFromDTO(dto, entity);
  }

}