package com.larplaner.mapper.scenario;

import com.larplaner.dto.scenario.item.ScenarioItemDetailedResponseDTO;
import com.larplaner.dto.scenario.item.ScenarioItemRequestDTO;
import com.larplaner.dto.scenario.item.ScenarioItemSummaryResponseDTO;
import com.larplaner.dto.scenario.item.UpdateScenarioItemRequestDTO;
import com.larplaner.model.scenario.ScenarioItem;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ScenarioItemMapper {

  private final ScenarioItemActionMapper scenarioItemActionMapper;

  public ScenarioItemDetailedResponseDTO toDetailedDTO(ScenarioItem scenarioItem) {
    if (scenarioItem == null) {
      return null;
    }

    return ScenarioItemDetailedResponseDTO
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

  public ScenarioItemSummaryResponseDTO toDTO(ScenarioItem scenarioItem) {
    if (scenarioItem == null) {
      return null;
    }

    return ScenarioItemSummaryResponseDTO
        .builder()
        .id(scenarioItem.getId())
        .scenarioId(scenarioItem.getScenario() != null ? scenarioItem.getScenario().getId() : null)
        .name(scenarioItem.getName())
        .description(scenarioItem.getDescription())
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