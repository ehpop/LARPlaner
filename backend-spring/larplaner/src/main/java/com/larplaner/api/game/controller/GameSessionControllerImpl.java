package com.larplaner.api.game.controller;

import com.larplaner.api.game.GameSessionController;
import com.larplaner.dto.game.GameSessionResponseDTO;
import com.larplaner.dto.game.action.GameActionRequestDTO;
import com.larplaner.dto.game.actionLog.GameActionLogResponseDTO;
import com.larplaner.dto.game.roleState.UpdateGameRoleStateRequestDTO;
import com.larplaner.dto.scenario.action.ScenarioActionResponseDTO;
import com.larplaner.dto.scenario.itemAction.ScenarioItemActionResponseDTO;
import com.larplaner.mapper.tag.AppliedTagMapper;
import com.larplaner.repository.game.GameRoleStateRepository;
import com.larplaner.service.game.GameSessionService;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
@Slf4j
public class GameSessionControllerImpl implements GameSessionController {

  private final GameSessionService gameSessionService;
  private final SimpMessagingTemplate messagingTemplate;
  private final GameRoleStateRepository gameRoleStateRepository;
  private final AppliedTagMapper appliedTagMapper;

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
  @PreAuthorize("hasAuthority('ROLE_ADMIN') or @securityService.isUserAssignedToGameSession(#gameSessionId)")
  public ResponseEntity<GameActionLogResponseDTO> performActionInGameSession(UUID gameSessionId,
      GameActionRequestDTO actionRequestDTO) {
    var actionResult = gameSessionService.performAction(gameSessionId, actionRequestDTO);
    var gameSessionRole = gameRoleStateRepository.findById(actionResult.getPerformerRoleId())
        .orElseThrow(EntityNotFoundException::new);

    messagingTemplate.convertAndSend(
        String.format("/topic/game/%s/action", actionResult.getGameSessionId()),
        "User performed action");

    messagingTemplate.convertAndSend(
        String.format("/topic/game/%s/action/byUserId/%s", actionResult.getGameSessionId(),
            SecurityContextHolder.getContext().getAuthentication().getName()),
        gameSessionRole.getAppliedTags().stream().map(appliedTagMapper::toDTO).toList());
    return ResponseEntity.ok(actionResult);
  }

  @Override
  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<GameSessionResponseDTO> updateGameSessionRoleState(UUID gameSessionRoleId,
      UpdateGameRoleStateRequestDTO requestDTO) {
    var updatedGameSession = gameSessionService.updateRoleState(gameSessionRoleId, requestDTO);

    var gameSessionRole = gameRoleStateRepository.findById(gameSessionRoleId).orElseThrow(
        EntityNotFoundException::new);

    messagingTemplate.convertAndSendToUser(gameSessionRole.getAssignedUserID(),
        "/topic/game/role",
        "Admin modified role");

    return ResponseEntity.ok(updatedGameSession);
  }

  @Override
  @PreAuthorize("hasAuthority('ROLE_ADMIN') or @securityService.isUserAssignedToGameSessionRole(#gameSessionRoleId)")
  public ResponseEntity<List<ScenarioActionResponseDTO>> getAvailableActionsForUser(
      UUID gameSessionRoleId) {
    return ResponseEntity.ok(
        gameSessionService.getAvailableActionsForUser(gameSessionRoleId)
    );
  }

  @Override
  @PreAuthorize("hasAuthority('ROLE_ADMIN') or @securityService.isUserAssignedToGameSessionRole(#gameSessionRoleId)")
  public ResponseEntity<List<ScenarioItemActionResponseDTO>> getAvailableItemActionsForUser(
      UUID gameSessionRoleId, UUID itemId) {
    return ResponseEntity.ok(
        gameSessionService.getAvailableItemActionsForUser(gameSessionRoleId, itemId)
    );
  }
}