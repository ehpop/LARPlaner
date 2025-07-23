package com.larplaner.mapper.game;

import com.larplaner.dto.game.GameSessionResponseDTO;
import com.larplaner.mapper.game.action.GameActionLogMapper;
import com.larplaner.mapper.game.item.GameItemStateMapper;
import com.larplaner.mapper.game.role.GameRoleStateMapper;
import com.larplaner.model.game.GameSession;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GameSessionMapper {

  private final GameRoleStateMapper gameRoleStateMapper;
  private final GameItemStateMapper gameItemStateMapper;
  private final GameActionLogMapper gameActionLogMapper;

  public GameSessionResponseDTO toDTO(GameSession gameSession) {
    if (gameSession == null) {
      return null;
    }

    return GameSessionResponseDTO.builder()
        .id(gameSession.getId())
        .eventId(gameSession.getEvent().getId())
        .startTime(gameSession.getStartTime())
        .endTime(gameSession.getEndTime())
        .assignedRoles(gameSession.getAssignedRoles() != null
            ? gameSession.getAssignedRoles().stream()
            .map(gameRoleStateMapper::toDTO)
            .collect(Collectors.toList())
            : List.of())
        .items(
            gameSession.getItems() != null
                ? gameSession.getItems().stream()
                .map(gameItemStateMapper::toDTO)
                .collect(Collectors.toList())
                : List.of()
        )
        .actions(gameSession.getActions() != null
            ? gameSession.getActions().stream()
            .map(gameActionLogMapper::toDTO)
            .collect(Collectors.toList())
            : List.of())
        .build();
  }

}