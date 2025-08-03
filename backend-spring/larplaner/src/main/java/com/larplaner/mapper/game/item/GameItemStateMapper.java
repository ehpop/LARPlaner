package com.larplaner.mapper.game.item;

import static com.larplaner.mapper.common.MapperHelper.getIdSafe;

import com.larplaner.dto.game.itemState.GameItemStateDetailedResponseDTO;
import com.larplaner.dto.game.itemState.GameItemStateSummaryResponseDTO;
import com.larplaner.mapper.game.GameSessionMapper;
import com.larplaner.mapper.game.role.GameRoleStateMapper;
import com.larplaner.mapper.scenario.ScenarioItemMapper;
import com.larplaner.model.game.GameItemState;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

@Component
public class GameItemStateMapper {

  private final ScenarioItemMapper scenarioItemMapper;
  private final GameRoleStateMapper gameRoleStateMapper;
  private final GameSessionMapper gameSessionMapper;

  public GameItemStateMapper(
      @Lazy ScenarioItemMapper scenarioItemMapper,
      @Lazy GameRoleStateMapper gameRoleStateMapper,
      @Lazy GameSessionMapper gameSessionMapper) {
    this.scenarioItemMapper = scenarioItemMapper;
    this.gameRoleStateMapper = gameRoleStateMapper;
    this.gameSessionMapper = gameSessionMapper;
  }

  public GameItemStateDetailedResponseDTO toDetailedDTO(GameItemState gameItemState) {
    if (gameItemState == null) {
      return null;
    }

    return GameItemStateDetailedResponseDTO.builder()
        .id(gameItemState.getId())
        .gameSession(gameSessionMapper.toDTO(gameItemState.getGameSession()))
        .scenarioItem(scenarioItemMapper.toDTO(gameItemState.getScenarioItem()))
        .currentHolderRole(gameRoleStateMapper.toDTO(gameItemState.getCurrentHolderRole()))
        .build();
  }

  public GameItemStateSummaryResponseDTO toDTO(GameItemState gameItemState) {
    if (gameItemState == null) {
      return null;
    }

    return GameItemStateSummaryResponseDTO.builder()
        .id(gameItemState.getId())
        .gameSessionId(getIdSafe(gameItemState.getGameSession()))
        .scenarioItem(scenarioItemMapper.toDetailedDTO(gameItemState.getScenarioItem()))
        .currentHolderRoleId(getIdSafe(gameItemState.getCurrentHolderRole()))
        .build();
  }

}