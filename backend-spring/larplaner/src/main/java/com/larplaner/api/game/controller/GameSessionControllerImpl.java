package com.larplaner.api.game.controller;

import com.larplaner.api.game.GameSessionController;
import com.larplaner.dto.game.GameSessionRequestDTO;
import com.larplaner.dto.game.GameSessionResponseDTO;
import com.larplaner.dto.game.UpdateGameSessionRequestDTO;
import com.larplaner.dto.game.actionLog.GameActionLogResponseDTO;
import com.larplaner.service.game.GameSessionService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
public class GameSessionControllerImpl implements GameSessionController {

  private final GameSessionService gameSessionService;

  @Override
  public ResponseEntity<List<GameSessionResponseDTO>> getAllGameSessions() {
    return ResponseEntity.ok(gameSessionService.getAllGameSessions());
  }

  @Override
  public ResponseEntity<GameSessionResponseDTO> getGameSessionById(UUID id) {
    GameSessionResponseDTO gameSession = gameSessionService.getGameSessionById(id);
    return gameSession != null
        ? ResponseEntity.ok(gameSession)
        : ResponseEntity.notFound().build();
  }

  @Override
  public ResponseEntity<GameSessionResponseDTO> createGameSession(
      GameSessionRequestDTO gameSessionDTO) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(gameSessionService.createGameSession(gameSessionDTO));
  }

  @Override
  public ResponseEntity<GameSessionResponseDTO> updateGameSession(UUID id,
      UpdateGameSessionRequestDTO updateGameSessionRequestDTO) {
    GameSessionResponseDTO updatedGameSession = gameSessionService.updateGameSession(id,
        updateGameSessionRequestDTO);
    return updatedGameSession != null
        ? ResponseEntity.ok(updatedGameSession)
        : ResponseEntity.notFound().build();
  }

  @Override
  public ResponseEntity<Void> deleteGameSession(UUID id) {
    gameSessionService.deleteGameSession(id);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<List<GameActionLogResponseDTO>> getAllGameHistory() {
    return ResponseEntity.ok(gameSessionService.getAllGameHistory());
  }

  @Override
  public ResponseEntity<GameActionLogResponseDTO> getGameHistoryById(UUID id) {
    GameActionLogResponseDTO gameHistory = gameSessionService.getGameHistoryById(id);
    return gameHistory != null
        ? ResponseEntity.ok(gameHistory)
        : ResponseEntity.notFound().build();
  }

  @Override
  public ResponseEntity<List<GameActionLogResponseDTO>> getGameHistoryByGameId(UUID gameId) {
    return ResponseEntity.ok(gameSessionService.getGameHistoryByGameId(gameId));
  }

  @Override
  public ResponseEntity<List<GameActionLogResponseDTO>> getGameHistoryByUserIdAndGameId(
      String userId,
      UUID gameId) {
    return ResponseEntity.ok(gameSessionService.getGameHistoryByUserIdAndGameId(userId, gameId));
  }

  @Override
  public ResponseEntity<GameActionLogResponseDTO> createGameHistory(
      GameActionLogResponseDTO gameActionLogDTO) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(gameSessionService.createGameHistory(gameActionLogDTO));
  }
}