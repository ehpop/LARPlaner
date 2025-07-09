package com.larplaner.service.game;

import com.larplaner.dto.game.GameSessionResponseDTO;
import com.larplaner.dto.game.action.GameActionRequestDTO;
import com.larplaner.dto.game.actionLog.GameActionLogResponseDTO;
import com.larplaner.dto.game.roleState.UpdateGameRoleStateRequestDTO;
import com.larplaner.model.event.Event;
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

  List<GameActionLogResponseDTO> getGameHistoryByUserIdAndGameId(String userId, UUID gameId);

  GameActionLogResponseDTO createGameHistory(GameActionLogResponseDTO gameActionLogDTO);

  GameActionLogResponseDTO performAction(UUID id, GameActionRequestDTO actionRequestDTO);

  GameSessionResponseDTO updateRoleState(UUID roleStateID,
      UpdateGameRoleStateRequestDTO requestDTO);
}