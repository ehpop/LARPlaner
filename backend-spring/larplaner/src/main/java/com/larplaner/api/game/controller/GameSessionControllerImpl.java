package com.larplaner.api.game.controller;

import com.larplaner.api.game.GameSessionController;
import com.larplaner.dto.game.GameSessionResponseDTO;
import com.larplaner.dto.game.action.GameActionRequestDTO;
import com.larplaner.dto.game.actionLog.GameActionLogResponseDTO;
import com.larplaner.dto.game.roleState.UpdateGameRoleStateRequestDTO;
import com.larplaner.dto.scenario.action.ScenarioActionResponseDTO;
import com.larplaner.dto.scenario.itemAction.ScenarioItemActionResponseDTO;
import com.larplaner.service.game.GameSessionService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
  @PreAuthorize("hasAuthority('ROLE_ADMIN') or @securityService.isUserAssignedToGameSession(#id)")
  public ResponseEntity<GameSessionResponseDTO> getGameSessionById(UUID id) {
    GameSessionResponseDTO gameSession = gameSessionService.getGameSessionById(id);
    return gameSession != null
        ? ResponseEntity.ok(gameSession)
        : ResponseEntity.notFound().build();
  }

  @Override
  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<Void> deleteGameSession(UUID id) {
    gameSessionService.deleteGameSession(id);
    return ResponseEntity.noContent().build();
  }

  @Override
  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<List<GameActionLogResponseDTO>> getAllGameHistory() {
    return ResponseEntity.ok(gameSessionService.getAllGameHistory());
  }

  @Override
  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<GameActionLogResponseDTO> getGameHistoryById(UUID id) {
    GameActionLogResponseDTO gameHistory = gameSessionService.getGameHistoryById(id);
    return gameHistory != null
        ? ResponseEntity.ok(gameHistory)
        : ResponseEntity.notFound().build();
  }

  @Override
  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<List<GameActionLogResponseDTO>> getGameHistoryByGameId(UUID gameId) {
    return ResponseEntity.ok(gameSessionService.getGameHistoryByGameId(gameId));
  }

  @Override
  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<List<GameActionLogResponseDTO>> getGameHistoryByUserIdAndGameId(
      String userId,
      UUID gameId) {
    return ResponseEntity.ok(gameSessionService.getUserGameHistoryByGameId(userId, gameId));
  }

  @Override
  @PreAuthorize("hasAuthority('ROLE_ADMIN') or @securityService.isUserAssignedToGameSession(#gameId)")
  public ResponseEntity<List<GameActionLogResponseDTO>> getUserGameHistoryByGameId(
      UUID gameId) {
    return ResponseEntity.ok(gameSessionService.getUserGameHistoryByGameId(gameId));
  }

  @Override
  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<GameActionLogResponseDTO> createGameHistory(
      GameActionLogResponseDTO gameActionLogDTO) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(gameSessionService.createGameHistory(gameActionLogDTO));
  }

  @Override
  @PreAuthorize("hasAuthority('ROLE_ADMIN') or @securityService.isUserAssignedToGameSession(#id)")
  public ResponseEntity<GameActionLogResponseDTO> performActionInGameSession(UUID id,
      GameActionRequestDTO actionRequestDTO) {
    return ResponseEntity.ok(
        gameSessionService.performAction(id, actionRequestDTO)
    );
  }

  @Override
  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<GameSessionResponseDTO> updateGameSessionRoleState(UUID gameSessionRoleId, UpdateGameRoleStateRequestDTO requestDTO) {
    return ResponseEntity.ok(
        gameSessionService.updateRoleState(gameSessionRoleId, requestDTO)
    );
  }

  @Override
  @PreAuthorize("hasAuthority('ROLE_ADMIN') or @securityService.isUserAssignedToGameSessionRole(#gameSessionRoleId)")
  public ResponseEntity<List<ScenarioActionResponseDTO>> getAvailableActionsForUser(
      UUID gameSessionRoleId){
    return ResponseEntity.ok(
        gameSessionService.getAvailableActionsForUser(gameSessionRoleId)
    );
  }

  @Override
  @PreAuthorize("hasAuthority('ROLE_ADMIN') or @securityService.isUserAssignedToGameSessionRole(#gameSessionRoleId)")
  public ResponseEntity<List<ScenarioItemActionResponseDTO>> getAvailableItemActionsForUser(
      UUID gameSessionRoleId, UUID itemId){
    return ResponseEntity.ok(
        gameSessionService.getAvailableItemActionsForUser(gameSessionRoleId, itemId)
    );
  }
}