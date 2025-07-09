package com.larplaner.mapper.game;

import com.larplaner.dto.game.GameSessionResponseDTO;
import com.larplaner.mapper.game.action.GameActionLogMapper;
import com.larplaner.mapper.game.item.GameItemStateMapper;
import com.larplaner.mapper.game.role.GameRoleStateMapper;
import com.larplaner.model.game.GameSession;
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

    GameSessionResponseDTO dto = new GameSessionResponseDTO();
    dto.setId(gameSession.getId());
    dto.setEventId(gameSession.getEvent().getId());
    dto.setStartTime(gameSession.getStartTime());
    dto.setEndTime(gameSession.getEndTime());

    if (gameSession.getAssignedRoles() != null) {
      dto.setAssignedRoles(gameSession.getAssignedRoles().stream()
          .map(gameRoleStateMapper::toDTO)
          .collect(Collectors.toList()));
    }

    if (gameSession.getItems() != null) {
      dto.setItems(gameSession.getItems().stream()
          .map(gameItemStateMapper::toDTO)
          .collect(Collectors.toList()));
    }

    if (gameSession.getActions() != null) {
      dto.setActions(gameSession.getActions().stream()
          .map(gameActionLogMapper::toDTO)
          .collect(Collectors.toList()));
    }

    return dto;
  }

  public GameSession toEntity(GameSessionResponseDTO dto) {
    GameSession entity = GameSession.builder()
        .id(dto.getId())
        .startTime(dto.getStartTime())
        .endTime(dto.getEndTime())
        .assignedRoles(dto.getAssignedRoles() != null ? dto.getAssignedRoles().stream()
            .map(gameRoleStateMapper::toEntity).collect(Collectors.toList()) : null)
        .items(dto.getItems() != null ? dto.getItems().stream().map(gameItemStateMapper::toEntity)
            .collect(Collectors.toList()) : null)
        .actions(
            dto.getActions() != null ? dto.getActions().stream().map(gameActionLogMapper::toEntity)
                .collect(Collectors.toList()) : null)
        .build();
    return entity;
  }

}