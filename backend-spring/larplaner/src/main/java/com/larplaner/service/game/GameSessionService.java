package com.larplaner.service.game;

import com.larplaner.dto.game.GameSessionResponseDTO;
import com.larplaner.dto.game.action.GameActionRequestDTO;
import com.larplaner.dto.game.actionLog.GameActionLogResponseDTO;
import com.larplaner.dto.game.roleState.UpdateGameRoleStateRequestDTO;
import com.larplaner.dto.scenario.action.ScenarioActionResponseDTO;
import com.larplaner.dto.scenario.itemAction.ScenarioItemActionResponseDTO;
import com.larplaner.model.event.Event;
import com.larplaner.model.game.GameActionLog;
import java.util.List;
import java.util.UUID;

public interface GameSessionService {

  List<GameSessionResponseDTO> getAllGameSessions();

  GameSessionResponseDTO getGameSessionById(UUID id);

  GameSessionResponseDTO createGameSession(Event event);

  void deleteGameSession(UUID id);

  List<GameActionLogResponseDTO> getAllGameHistory();

  GameActionLogResponseDTO getGameHistoryById(UUID id);

  List<GameActionLogResponseDTO> getGameHistoryByGameId(UUID gameId);

  List<GameActionLogResponseDTO> getUserGameHistoryByGameId(String userId, UUID gameId);

  List<GameActionLogResponseDTO> getUserGameHistoryByGameId(UUID gameId);

  GameActionLogResponseDTO createGameHistory(GameActionLog gameActionLogDTO);

  GameActionLogResponseDTO performAction(UUID id, GameActionRequestDTO actionRequestDTO);

  GameSessionResponseDTO updateRoleState(UUID roleStateID,
      UpdateGameRoleStateRequestDTO requestDTO);

  List<ScenarioActionResponseDTO> getAvailableActionsForUser(UUID gameSessionRoleId);

  List<ScenarioItemActionResponseDTO> getAvailableItemActionsForUser(UUID gameSessionRoleId,
      UUID itemId);
}