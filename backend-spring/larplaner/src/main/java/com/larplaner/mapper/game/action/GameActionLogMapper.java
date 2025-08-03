package com.larplaner.mapper.game.action;

import static com.larplaner.mapper.common.MapperHelper.getIdSafe;

import com.larplaner.dto.game.actionLog.GameActionLogDetailedResponseDTO;
import com.larplaner.dto.game.actionLog.GameActionLogSummaryResponseDTO;
import com.larplaner.mapper.action.ActionMapper;
import com.larplaner.mapper.game.GameSessionMapper;
import com.larplaner.mapper.game.item.GameItemStateMapper;
import com.larplaner.mapper.game.role.GameRoleStateMapper;
import com.larplaner.mapper.tag.TagMapper;
import com.larplaner.model.game.GameActionLog;
import java.util.stream.Collectors;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

@Component
public class GameActionLogMapper {

  private final TagMapper tagMapper;
  private final ActionMapper actionMapper;
  private final GameRoleStateMapper gameRoleStateMapper;
  private final GameItemStateMapper gameItemStateMapper;
  private final GameSessionMapper gameSessionMapper;

  public GameActionLogMapper(TagMapper tagMapper,
      @Lazy ActionMapper actionMapper,
      @Lazy GameRoleStateMapper gameRoleStateMapper,
      @Lazy GameItemStateMapper gameItemStateMapper,
      @Lazy GameSessionMapper gameSessionMapper) {
    this.tagMapper = tagMapper;
    this.actionMapper = actionMapper;
    this.gameRoleStateMapper = gameRoleStateMapper;
    this.gameItemStateMapper = gameItemStateMapper;
    this.gameSessionMapper = gameSessionMapper;
  }

  public GameActionLogSummaryResponseDTO toDTO(GameActionLog gameActionLog) {
    if (gameActionLog == null) {
      return null;
    }

    return GameActionLogSummaryResponseDTO.builder()
        .id(gameActionLog.getId())
        .gameSessionId(gameActionLog.getGameSession().getId())
        .actionId(gameActionLog.getAction().getId())
        .timestamp(gameActionLog.getTimestamp())
        .performerRoleId(gameActionLog.getPerformerRole().getId())
        .targetItemId(getIdSafe(gameActionLog.getTargetItem()))
        .success(gameActionLog.getSuccess())
        .message(gameActionLog.getMessage())
        .appliedTags(
            gameActionLog.getAppliedTags() != null ? gameActionLog.getAppliedTags().stream()
                .map(tagMapper::toDTO)
                .collect(Collectors.toList()) : null)
        .removedTags(
            gameActionLog.getRemovedTags() != null ? gameActionLog.getRemovedTags().stream()
                .map(tagMapper::toDTO)
                .collect(Collectors.toList()) : null)
        .build();
  }

  public GameActionLogDetailedResponseDTO toDetailedDTO(GameActionLog gameActionLog) {
    if (gameActionLog == null) {
      return null;
    }

    return GameActionLogDetailedResponseDTO.builder()
        .id(gameActionLog.getId())
        .gameSession(gameSessionMapper.toDTO(gameActionLog.getGameSession()))
        .action(actionMapper.toDTO(gameActionLog.getAction()))
        .timestamp(gameActionLog.getTimestamp())
        .performerRole(gameRoleStateMapper.toDTO(
            gameActionLog.getPerformerRole()))
        .targetItem(gameItemStateMapper.toDetailedDTO(gameActionLog.getTargetItem()))
        .success(gameActionLog.getSuccess())
        .message(gameActionLog.getMessage())
        .appliedTags(
            gameActionLog.getAppliedTags() != null ? gameActionLog.getAppliedTags().stream()
                .map(tagMapper::toDTO)
                .collect(Collectors.toList()) : null)
        .removedTags(
            gameActionLog.getRemovedTags() != null ? gameActionLog.getRemovedTags().stream()
                .map(tagMapper::toDTO)
                .collect(Collectors.toList()) : null)
        .build();
  }

}