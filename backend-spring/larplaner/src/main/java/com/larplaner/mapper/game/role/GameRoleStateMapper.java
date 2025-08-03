package com.larplaner.mapper.game.role;

import com.larplaner.dto.game.roleState.GameRoleStateDetailedResponseDTO;
import com.larplaner.dto.game.roleState.GameRoleStateSummaryResponseDTO;
import com.larplaner.mapper.game.GameSessionMapper;
import com.larplaner.mapper.game.action.GameActionLogMapper;
import com.larplaner.mapper.scenario.ScenarioRoleMapper;
import com.larplaner.mapper.tag.AppliedTagMapper;
import com.larplaner.model.game.GameRoleState;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

@Component
public class GameRoleStateMapper {

  private final GameActionLogMapper gameActionLogMapper;
  private final AppliedTagMapper appliedTagMapper;
  private final GameSessionMapper gameSessionMapper;
  private final ScenarioRoleMapper scenarioRoleMapper;

  public GameRoleStateMapper(@Lazy GameActionLogMapper gameActionLogMapper,
      @Lazy AppliedTagMapper appliedTagMapper,
      @Lazy GameSessionMapper gameSessionMapper,
      @Lazy ScenarioRoleMapper scenarioRoleMapper) {
    this.gameActionLogMapper = gameActionLogMapper;
    this.appliedTagMapper = appliedTagMapper;
    this.gameSessionMapper = gameSessionMapper;
    this.scenarioRoleMapper = scenarioRoleMapper;
  }

  public GameRoleStateDetailedResponseDTO toDetailedDTO(GameRoleState gameRoleState) {
    if (gameRoleState == null) {
      return null;
    }

    return GameRoleStateDetailedResponseDTO.builder()
        .id(gameRoleState.getId())
        .gameSession(gameSessionMapper.toDTO(gameRoleState.getGameSession()))
        .scenarioRole(scenarioRoleMapper.toDTO(gameRoleState.getScenarioRole()))
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

  public GameRoleStateSummaryResponseDTO toDTO(GameRoleState gameRoleState) {
    if (gameRoleState == null) {
      return null;
    }

    return GameRoleStateSummaryResponseDTO.builder()
        .id(gameRoleState.getId())
        .scenarioRole(scenarioRoleMapper.toDetailedDTO(gameRoleState.getScenarioRole()))
        .gameSessionId(gameRoleState.getGameSession().getId())
        .assignedEmail(gameRoleState.getAssignedEmail())
        .assignedUserID(gameRoleState.getAssignedUserID())
        .appliedTags(gameRoleState.getAppliedTags() == null ? List.of()
            : gameRoleState.getAppliedTags().stream()
                .map(appliedTagMapper::toDTO)
                .collect(Collectors.toList()))
        .build();
  }

}