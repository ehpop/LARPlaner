package com.larplaner.mapper.game.role;

import com.larplaner.dto.game.roleState.GameRoleStateResponseDTO;
import com.larplaner.mapper.game.action.GameActionLogMapper;
import com.larplaner.mapper.tag.TagMapper;
import com.larplaner.model.game.GameRoleState;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GameRoleStateMapper {

  private final TagMapper tagMapper;
  private final GameActionLogMapper gameActionLogMapper;

  public GameRoleStateResponseDTO toDTO(GameRoleState gameRoleState) {

    return GameRoleStateResponseDTO.builder()
        .id(gameRoleState.getId())
        .scenarioRoleId(gameRoleState.getScenarioRole().getId())
        .assignedEmail(gameRoleState.getAssignedEmail())
        .assignedUserID(gameRoleState.getAssignedUserID())
        .activeTags(gameRoleState.getActiveTags().stream()
            .map(tagMapper::toDTO)
            .collect(Collectors.toList()))
        .actionHistory(gameRoleState.getActionHistory().stream()
            .map(gameActionLogMapper::toDTO)
            .collect(Collectors.toList()))
        .build();
  }

  public GameRoleState toEntity(GameRoleStateResponseDTO dto) {
    GameRoleState entity = GameRoleState.builder()
        .id(dto.getId())
        .assignedEmail(dto.getAssignedEmail())
        .assignedUserID(dto.getAssignedUserID())
        .activeTags(
            dto.getActiveTags() != null ? dto.getActiveTags().stream().map(tagMapper::toEntity)
                .collect(java.util.stream.Collectors.toList()) : null)
        .build();

    return entity;
  }
}