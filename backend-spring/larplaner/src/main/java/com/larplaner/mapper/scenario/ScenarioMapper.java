package com.larplaner.mapper.scenario;

import com.larplaner.dto.scenario.ScenarioRequestDTO;
import com.larplaner.dto.scenario.ScenarioResponseDTO;
import com.larplaner.dto.scenario.UpdateScenarioRequestDTO;
import com.larplaner.mapper.tag.TagMapper;
import com.larplaner.model.scenario.Scenario;
import com.larplaner.service.tag.helper.TagHelper;
import java.util.Collections;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ScenarioMapper {

  private final ScenarioItemMapper scenarioItemMapper;
  private final ScenarioRoleMapper scenarioRoleMapper;
  private final ScenarioActionMapper scenarioActionMapper;
  private final TagMapper tagMapper;
  private final TagHelper tagHelper;

  /**
   * Maps a Scenario entity to a ScenarioResponseDTO.
   */
  public ScenarioResponseDTO toDTO(Scenario entity) {
    if (entity == null) {
      return null;
    }

    return ScenarioResponseDTO.builder()
        .id(entity.getId())
        .name(entity.getName())
        .description(entity.getDescription())
        .items(entity.getItems() == null ? Collections.emptyList()
            : entity.getItems().stream()
                .map(scenarioItemMapper::toDetailedDTO)
                .collect(Collectors.toList()))
        .roles(entity.getRoles() == null ? Collections.emptyList()
            : entity.getRoles().stream()
                .map(scenarioRoleMapper::toDTO)
                .collect(Collectors.toList()))
        .actions(entity.getActions() == null ? Collections.emptyList()
            : entity.getActions().stream()
                .map(scenarioActionMapper::toDTO)
                .collect(Collectors.toList()))
        .build();
  }

  /**
   * Maps a ScenarioRequestDTO to a new Scenario entity. Note: Associations for nested items (roles,
   * items, actions, tags) need to be finalized in the service layer (e.g., setting the
   * back-reference to the scenario).
   */
  public Scenario toEntity(ScenarioRequestDTO dto) {
    if (dto == null) {
      return null;
    }

    return Scenario
        .builder()
        .name(dto.getName())
        .description(dto.getDescription())
        .build();
  }

  /**
   * Updates an existing Scenario entity from an UpdateScenarioRequestDTO. IMPORTANT: This method
   * only updates name and description. Updating nested lists (roles, items, actions, tags) should
   * be handled explicitly in the service layer to manage relationships correctly
   * (add/remove/update).
   */
  public void updateEntityFromDTO(UpdateScenarioRequestDTO dto, Scenario entity) {
    if (dto == null || entity == null) {
      return;
    }

    if (dto.getName() != null) {
      entity.setName(dto.getName());
    }
    if (dto.getDescription() != null) {
      entity.setDescription(dto.getDescription());
    }

    // TODO: Implement logic in the service layer to handle updates to roles, items,
    // actions, tags lists.
    // This typically involves fetching existing children, comparing with DTO userEvents,
    // creating new ones,
    // updating existing ones, and removing ones not present in the DTO userEvents.
  }
}
