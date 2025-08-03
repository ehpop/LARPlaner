package com.larplaner.mapper.game;

import com.larplaner.dto.game.GameSessionDetailedResponseDTO;
import com.larplaner.dto.game.GameSessionSummaryResponseDTO;
import com.larplaner.mapper.game.action.GameActionLogMapper;
import com.larplaner.mapper.game.item.GameItemStateMapper;
import com.larplaner.mapper.game.role.GameRoleStateMapper;
import com.larplaner.model.game.GameSession;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

@Component
public class GameSessionMapper {

  private final GameRoleStateMapper gameRoleStateMapper;
  private final GameItemStateMapper gameItemStateMapper;
  private final GameActionLogMapper gameActionLogMapper;

  public GameSessionMapper(@Lazy GameRoleStateMapper gameRoleStateMapper,
      @Lazy GameItemStateMapper gameItemStateMapper,
      @Lazy GameActionLogMapper gameActionLogMapper) {
    this.gameRoleStateMapper = gameRoleStateMapper;
    this.gameItemStateMapper = gameItemStateMapper;
    this.gameActionLogMapper = gameActionLogMapper;
  }

  public GameSessionDetailedResponseDTO toDetailedDTO(GameSession gameSession) {
    if (gameSession == null) {
      return null;
    }

    return GameSessionDetailedResponseDTO.builder()
        .id(gameSession.getId())
        .eventId(gameSession.getEvent().getId())
        .startTime(gameSession.getStartTime())
        .endTime(gameSession.getEndTime())
        .assignedRoles(gameSession.getAssignedRoles() != null
            ? gameSession.getAssignedRoles().stream().map(gameRoleStateMapper::toDTO).toList()
            : List.of())
        .items(
            gameSession.getItems() != null
                ? gameSession.getItems().stream()
                .map(gameItemStateMapper::toDTO)
                .collect(Collectors.toList())
                : List.of()
        )
        .build();
  }

  public GameSessionSummaryResponseDTO toDTO(GameSession gameSession) {
    if (gameSession == null) {
      return null;
    }

    return GameSessionSummaryResponseDTO.builder()
        .id(gameSession.getId())
        .startTime(gameSession.getStartTime())
        .endTime(gameSession.getEndTime())
        .eventId(gameSession.getEvent().getId())
        .build();
  }

}