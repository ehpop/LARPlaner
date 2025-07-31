package com.larplaner.mapper.game.action;

import com.larplaner.dto.game.actionLog.GameActionLogResponseDTO;
import com.larplaner.mapper.tag.TagMapper;
import com.larplaner.model.game.GameActionLog;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GameActionLogMapper {

  private final TagMapper tagMapper;

  public GameActionLogResponseDTO toDTO(GameActionLog gameActionLog) {
    return GameActionLogResponseDTO.builder()
        .id(gameActionLog.getId())
        .gameSessionId(gameActionLog.getGameSession().getId())
        .actionId(gameActionLog.getAction().getId())
        .timestamp(gameActionLog.getTimestamp())
        .performerRoleId(gameActionLog.getPerformerRole().getId())
        .targetItemId(
            gameActionLog.getTargetItem() != null ? gameActionLog.getTargetItem().getId() : null)
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