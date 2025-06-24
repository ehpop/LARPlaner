package com.larplaner.mapper.game.item;

import com.larplaner.dto.game.itemState.GameItemStateResponseDTO;
import com.larplaner.mapper.game.action.GameActionLogMapper;
import com.larplaner.mapper.tag.TagMapper;
import com.larplaner.model.game.GameItemState;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GameItemStateMapper {

  private final TagMapper tagMapper;
  private final GameActionLogMapper gameActionLogMapper;

  public GameItemStateResponseDTO toDTO(GameItemState gameItemState) {
    GameItemStateResponseDTO dto = GameItemStateResponseDTO.builder()
        .id(gameItemState.getId())
        .scenarioItemId(gameItemState.getScenarioItem().getId())
        .currentHolderRoleId(
            gameItemState.getCurrentHolderRole() != null
                ? gameItemState.getCurrentHolderRole().getId()
                : null)
        .activeTags(gameItemState.getActiveTags().stream()
            .map(tagMapper::toDTO)
            .collect(Collectors.toList()))
        .actionHistory(gameItemState.getActionHistory().stream()
            .map(gameActionLogMapper::toDTO)
            .collect(Collectors.toList()))
        .build();

    return dto;
  }

  public GameItemState toEntity(GameItemStateResponseDTO dto) {
    GameItemState entity = GameItemState.builder()
        .id(dto.getId())
        .activeTags(
            dto.getActiveTags() != null ? dto.getActiveTags().stream().map(tagMapper::toEntity)
                .collect(java.util.stream.Collectors.toList()) : null)
        .build();

    return entity;
  }
}