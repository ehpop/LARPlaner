package com.larplaner.mapper.game.role;

import com.larplaner.dto.game.roleState.GameRoleStateResponseDTO;
import com.larplaner.mapper.game.action.GameActionLogMapper;
import com.larplaner.mapper.tag.AppliedTagMapper;
import com.larplaner.model.game.GameRoleState;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GameRoleStateMapper {

  private final GameActionLogMapper gameActionLogMapper;
  private final AppliedTagMapper appliedTagMapper;

  public GameRoleStateResponseDTO toDTO(GameRoleState gameRoleState) {

    return GameRoleStateResponseDTO.builder()
        .id(gameRoleState.getId())
        .gameSessionId(gameRoleState.getGameSession().getId())
        .scenarioRoleId(gameRoleState.getScenarioRole().getId())
        .assignedEmail(gameRoleState.getAssignedEmail())
        .assignedUserID(gameRoleState.getAssignedUserID())
        .appliedTags(gameRoleState.getAppliedTags() == null ? List.of()
            : gameRoleState.getAppliedTags().stream()
                .map(appliedTagMapper::toDTO)
                .collect(Collectors.toList()))
        .actionHistory(gameRoleState.getActionHistory() == null ? List.of()
            : gameRoleState.getActionHistory().stream()
                .map(gameActionLogMapper::toDTO)
                .collect(Collectors.toList()))
        .build();
  }

}