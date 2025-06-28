package com.larplaner.mapper.scenario;

import com.larplaner.dto.scenario.item.ScenarioItemRequestDTO;
import com.larplaner.dto.scenario.item.ScenarioItemResponseDTO;
import com.larplaner.dto.scenario.item.UpdateScenarioItemRequestDTO;
import com.larplaner.mapper.action.ActionMapper;
import com.larplaner.model.scenario.ScenarioItem;
import com.larplaner.model.scenario.ScenarioItemAction;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ScenarioItemMapper {

  private final ScenarioItemActionMapper scenarioItemActionMapper;
  private final ActionMapper actionMapper;

  public ScenarioItemResponseDTO toDTO(ScenarioItem scenarioItem) {
    if (scenarioItem == null) {
      return null;
    }

    return ScenarioItemResponseDTO
        .builder()
        .id(scenarioItem.getId())
        .scenarioId(scenarioItem.getScenario() != null ? scenarioItem.getScenario().getId() : null)
        .name(scenarioItem.getName())
        .description(scenarioItem.getDescription())
        .actions(scenarioItem.getActions() != null ? scenarioItem.getActions().stream()
            .map(scenarioItemActionMapper::toDTO)
            .collect(Collectors.toList()) : null)
        .build();
  }

  public ScenarioItem toEntity(ScenarioItemRequestDTO dto) {
    if (dto == null) {
      return null;
    }

    return ScenarioItem
        .builder()
        .name(dto.getName())
        .description(dto.getDescription())
        .build();
  }

  public void updateEntityFromUpdateDTO(ScenarioItem entity, UpdateScenarioItemRequestDTO dto) {
    if (dto == null || entity == null) {
      return;
    }

    if (dto.getName() != null) {
      entity.setName(dto.getName());
    }
    if (dto.getDescription() != null) {
      entity.setDescription(dto.getDescription());
    }
  }
}