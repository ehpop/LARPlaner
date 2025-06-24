package com.larplaner.service.game;

import java.util.List;
import java.util.UUID;

import com.larplaner.dto.game.GameSessionRequestDTO;
import com.larplaner.dto.game.GameSessionResponseDTO;
import com.larplaner.dto.game.UpdateGameSessionRequestDTO;
import com.larplaner.dto.game.actionLog.GameActionLogResponseDTO;

public interface GameSessionService {

  List<GameSessionResponseDTO> getAllGameSessions();

  GameSessionResponseDTO getGameSessionById(UUID id);

  GameSessionResponseDTO createGameSession(GameSessionRequestDTO gameSessionDTO);

  GameSessionResponseDTO updateGameSession(UUID id,
      UpdateGameSessionRequestDTO updateGameSessionRequestDTO);

  void deleteGameSession(UUID id);

  List<GameActionLogResponseDTO> getAllGameHistory();

  GameActionLogResponseDTO getGameHistoryById(UUID id);

  List<GameActionLogResponseDTO> getGameHistoryByGameId(UUID gameId);

  List<GameActionLogResponseDTO> getGameHistoryByUserIdAndGameId(String userId, UUID gameId);

  GameActionLogResponseDTO createGameHistory(GameActionLogResponseDTO gameActionLogDTO);
}