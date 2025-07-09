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

    return GameItemStateResponseDTO.builder()
        .id(gameItemState.getId())
        .gameSessionId(gameItemState.getGameSession().getId())
        .scenarioItemId(gameItemState.getScenarioItem().getId())
        .currentHolderRoleId(
            gameItemState.getCurrentHolderRole() != null
                ? gameItemState.getCurrentHolderRole().getId()
                : null)
        .actionHistory(gameItemState.getActionHistory().stream()
            .map(gameActionLogMapper::toDTO)
            .collect(Collectors.toList()))
        .build();
  }

  public GameItemState toEntity(GameItemStateResponseDTO dto) {
    return GameItemState.builder()
        .id(dto.getId())
        .build();
  }
}