package com.larplaner.api.game.controller;

import com.larplaner.api.game.GameSessionController;
import com.larplaner.dto.game.GameSessionDetailedResponseDTO;
import com.larplaner.dto.game.action.GameActionRequestDTO;
import com.larplaner.dto.game.actionLog.GameActionLogDetailedResponseDTO;
import com.larplaner.dto.game.actionLog.GameActionLogSummaryResponseDTO;
import com.larplaner.dto.game.roleState.GameRoleStateSummaryResponseDTO;
import com.larplaner.dto.game.roleState.UpdateGameRoleStateRequestDTO;
import com.larplaner.dto.scenario.action.ScenarioActionResponseDTO;
import com.larplaner.dto.scenario.itemAction.ScenarioItemActionResponseDTO;
import com.larplaner.service.game.GameSessionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
@Slf4j
public class GameSessionControllerImpl implements GameSessionController {

    private final GameSessionService gameSessionService;

    @Override
    public ResponseEntity<List<GameSessionDetailedResponseDTO>> getAllGameSessions() {
        return ResponseEntity.ok(gameSessionService.getAllGameSessions());
    }

    @Override
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or @securityService.isUserAssignedToGameSession(#id)")
    public ResponseEntity<GameSessionDetailedResponseDTO> getGameSessionById(UUID id) {
        GameSessionDetailedResponseDTO gameSession = gameSessionService.getGameSessionById(id);
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
    public ResponseEntity<GameActionLogSummaryResponseDTO> getGameHistoryById(UUID id) {
        GameActionLogSummaryResponseDTO gameHistory = gameSessionService.getGameHistoryById(id);
        return gameHistory != null
                ? ResponseEntity.ok(gameHistory)
                : ResponseEntity.notFound().build();
    }

    @Override
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<GameActionLogDetailedResponseDTO>> getGameHistoryByGameId(
            UUID gameId) {
        return ResponseEntity.ok(gameSessionService.getGameHistoryByGameId(gameId));
    }

    @Override
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<GameActionLogSummaryResponseDTO>> getGameHistoryByUserIdAndGameId(
            String userId,
            UUID gameId) {
        return ResponseEntity.ok(gameSessionService.getUserGameHistoryByGameId(userId, gameId));
    }

    @Override
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or @securityService.isUserAssignedToGameSession(#gameId)")
    public ResponseEntity<List<GameActionLogSummaryResponseDTO>> getUserGameHistoryByGameId(UUID gameId) {
        return ResponseEntity.ok(gameSessionService.getUserGameHistoryByGameId(gameId));
    }

    @Override
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or @securityService.isUserAssignedToGameSession(#gameSessionId)")
    public ResponseEntity<GameActionLogSummaryResponseDTO> performActionInGameSession(
            UUID gameSessionId,
            GameActionRequestDTO actionRequestDTO) {

        var userName = SecurityContextHolder.getContext().getAuthentication().getName();
        var actionResult = gameSessionService.performActionAndNotify(gameSessionId, actionRequestDTO, userName);

        return ResponseEntity.ok(actionResult);
    }

    @Override
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<GameSessionDetailedResponseDTO> updateGameSessionRoleState(
            UUID gameSessionRoleId,
            UpdateGameRoleStateRequestDTO requestDTO) {

        var updatedGameSession = gameSessionService.updateRoleStateAndNotify(gameSessionRoleId, requestDTO);

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

    @Override
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<GameRoleStateSummaryResponseDTO> getRoleStateForUserId(UUID gameId,
                                                                                 String userId) {
        return ResponseEntity.ok(gameSessionService.getUserRoleStateForUserId(gameId, userId));
    }
}
