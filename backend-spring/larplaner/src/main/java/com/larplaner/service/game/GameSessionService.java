package com.larplaner.service.game;

import com.larplaner.dto.game.GameSessionDetailedResponseDTO;
import com.larplaner.dto.game.action.GameActionRequestDTO;
import com.larplaner.dto.game.actionLog.GameActionLogDetailedResponseDTO;
import com.larplaner.dto.game.actionLog.GameActionLogSummaryResponseDTO;
import com.larplaner.dto.game.roleState.GameRoleStateSummaryResponseDTO;
import com.larplaner.dto.game.roleState.UpdateGameRoleStateRequestDTO;
import com.larplaner.dto.scenario.action.ScenarioActionResponseDTO;
import com.larplaner.dto.scenario.itemAction.ScenarioItemActionResponseDTO;
import com.larplaner.model.event.Event;
import com.larplaner.model.game.GameActionLog;
import java.util.List;
import java.util.UUID;

public interface GameSessionService {

  List<GameSessionDetailedResponseDTO> getAllGameSessions();

  GameSessionDetailedResponseDTO getGameSessionById(UUID id);

  GameSessionDetailedResponseDTO createGameSession(Event event);

  void deleteGameSession(UUID id);

  List<GameActionLogSummaryResponseDTO> getAllGameHistory();

  GameActionLogSummaryResponseDTO getGameHistoryById(UUID id);

  List<GameActionLogDetailedResponseDTO> getGameHistoryByGameId(UUID gameId);

  List<GameActionLogSummaryResponseDTO> getUserGameHistoryByGameId(String userId, UUID gameId);

  List<GameActionLogSummaryResponseDTO> getUserGameHistoryByGameId(UUID gameId);

  GameActionLogSummaryResponseDTO createGameHistory(GameActionLog gameActionLogDTO);

  GameActionLogSummaryResponseDTO performAction(UUID id, GameActionRequestDTO actionRequestDTO);

  GameSessionDetailedResponseDTO updateRoleState(UUID roleStateID,
      UpdateGameRoleStateRequestDTO requestDTO);

  List<ScenarioActionResponseDTO> getAvailableActionsForUser(UUID gameSessionRoleId);

  List<ScenarioItemActionResponseDTO> getAvailableItemActionsForUser(UUID gameSessionRoleId,
      UUID itemId);

  GameRoleStateSummaryResponseDTO getUserRoleStateForUserId(UUID gameId, String userId);
}