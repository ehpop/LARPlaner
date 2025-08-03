package com.larplaner.api.game;

import com.larplaner.dto.game.GameSessionDetailedResponseDTO;
import com.larplaner.dto.game.action.GameActionRequestDTO;
import com.larplaner.dto.game.actionLog.GameActionLogDetailedResponseDTO;
import com.larplaner.dto.game.actionLog.GameActionLogSummaryResponseDTO;
import com.larplaner.dto.game.roleState.GameRoleStateSummaryResponseDTO;
import com.larplaner.dto.game.roleState.UpdateGameRoleStateRequestDTO;
import com.larplaner.dto.scenario.action.ScenarioActionResponseDTO;
import com.larplaner.dto.scenario.itemAction.ScenarioItemActionResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Game Session", description = "Game session management APIs")
@SecurityRequirement(name = "bearer-key")
public interface GameSessionController {

  @Operation(summary = "Get all game sessions")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Successfully retrieved all game sessions")
  })
  @GetMapping
  ResponseEntity<List<GameSessionDetailedResponseDTO>> getAllGameSessions();

  @Operation(summary = "Get game session by ID")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Successfully retrieved game session"),
      @ApiResponse(responseCode = "404", description = "Game session not found")
  })
  @GetMapping("/{id}")
  ResponseEntity<GameSessionDetailedResponseDTO> getGameSessionById(
      @Parameter(description = "ID of the game session to retrieve") @PathVariable UUID id);

  @Operation(summary = "Delete a game session")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "Game session deleted successfully"),
      @ApiResponse(responseCode = "404", description = "Game session not found")
  })
  @DeleteMapping("/{id}")
  ResponseEntity<Void> deleteGameSession(
      @Parameter(description = "ID of the game session to delete") @PathVariable UUID id);

  @Operation(summary = "Get game history by ID")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Successfully retrieved game history"),
      @ApiResponse(responseCode = "404", description = "Game history not found")
  })
  @GetMapping("/history/{id}")
  ResponseEntity<GameActionLogSummaryResponseDTO> getGameHistoryById(
      @Parameter(description = "ID of the game history to retrieve") @PathVariable UUID id);

  @Operation(summary = "Get game history by game ID")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Successfully retrieved game history"),
      @ApiResponse(responseCode = "404", description = "Game history not found")
  })
  @GetMapping("/history/gameId/{gameId}")
  ResponseEntity<List<GameActionLogDetailedResponseDTO>> getGameHistoryByGameId(
      @Parameter(description = "ID of the game to retrieve history for") @PathVariable UUID gameId);

  @Operation(summary = "Get game history by user ID and game ID")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Successfully retrieved game history"),
      @ApiResponse(responseCode = "404", description = "Game history not found")
  })
  @GetMapping("/history/userId/{userId}/gameId/{gameId}")
  ResponseEntity<List<GameActionLogSummaryResponseDTO>> getGameHistoryByUserIdAndGameId(
      @Parameter(description = "ID of the user to retrieve history for") @PathVariable String userId,
      @Parameter(description = "ID of the game to retrieve history for") @PathVariable UUID gameId);

  @Operation(summary = "Get game history by game ID for authorized user")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Successfully retrieved game history"),
      @ApiResponse(responseCode = "404", description = "Game history not found")
  })
  @GetMapping("/history/user/gameId/{gameId}")
  ResponseEntity<List<GameActionLogSummaryResponseDTO>> getUserGameHistoryByGameId(
      @Parameter(description = "ID of the game to retrieve history for") @PathVariable UUID gameId);

  @Operation(summary = "Try to perform action")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Successfully processed action request"),
      @ApiResponse(responseCode = "404", description = "Game session not found")
  })
  @PostMapping("/{gameSessionId}/perform-action")
  ResponseEntity<GameActionLogSummaryResponseDTO> performActionInGameSession(
      @Parameter(description = "ID of the game session in which to perform action") @PathVariable UUID gameSessionId,
      @RequestBody @Valid
      GameActionRequestDTO actionRequestDTO);

  @Operation(summary = "Update the state/details of a specific scenario role within a game session")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Successfully updated game session role state"),
      @ApiResponse(responseCode = "400", description = "Invalid request payload or data validation failed"),
      @ApiResponse(responseCode = "404", description = "Game session or scenario role not found")
  })
  @PutMapping("/roles/{gameSessionRoleId}/state")
  ResponseEntity<GameSessionDetailedResponseDTO> updateGameSessionRoleState(
      @Parameter(description = "ID of the scenario role whose state is to be updated")
      @PathVariable UUID gameSessionRoleId,
      @RequestBody @Valid
      UpdateGameRoleStateRequestDTO requestDTO);

  @Operation(summary = "Get all available actions for user in game session by user role state ID")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Successfully retrieved actions"),
      @ApiResponse(responseCode = "404", description = "Game role state not found")
  })
  @GetMapping("/roles/{gameSessionRoleId}/availableActions")
  ResponseEntity<List<ScenarioActionResponseDTO>> getAvailableActionsForUser(
      @Parameter(description = "ID of the scenario role for whom actions will be retrieved")
      @PathVariable UUID gameSessionRoleId);

  @Operation(summary = "Get all available item actions for user in game session by user role state ID")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Successfully retrieved item actions"),
      @ApiResponse(responseCode = "404", description = "Game role state or item not found")
  })
  @GetMapping("/roles/{gameSessionRoleId}/items/{itemId}/availableActions")
  ResponseEntity<List<ScenarioItemActionResponseDTO>> getAvailableItemActionsForUser(
      @Parameter(description = "ID of the scenario role for whom item actions will be retrieved")
      @PathVariable UUID gameSessionRoleId,
      @Parameter(description = "ID of the item for whom actions will be retrieved")
      @PathVariable
      UUID itemId);

  @Operation(summary = "Get summary info about user Game Role State based on user UID from auth provider")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Successfully retrieved user Game Role State"),
      @ApiResponse(responseCode = "404", description = "Game role state not found")
  })
  @GetMapping("/{gameId}/role/user/{userId}")
  ResponseEntity<GameRoleStateSummaryResponseDTO> getRoleStateForUserId(
      @Parameter(description = "Game ID in which Game Role State should be")
      @PathVariable UUID gameId,
      @Parameter(description = "User UID from auth provider for which Game Role State will be retrieved")
      @PathVariable String userId
  );
}