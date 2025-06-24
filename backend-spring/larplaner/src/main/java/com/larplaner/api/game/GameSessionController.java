package com.larplaner.api.game;

import com.larplaner.dto.game.GameSessionRequestDTO;
import com.larplaner.dto.game.GameSessionResponseDTO;
import com.larplaner.dto.game.UpdateGameSessionRequestDTO;
import com.larplaner.dto.game.actionLog.GameActionLogResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
public interface GameSessionController {

  @Operation(summary = "Get all game sessions")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Successfully retrieved all game sessions")
  })
  @GetMapping
  ResponseEntity<List<GameSessionResponseDTO>> getAllGameSessions();

  @Operation(summary = "Get game session by ID")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Successfully retrieved game session"),
      @ApiResponse(responseCode = "404", description = "Game session not found")
  })
  @GetMapping("/{id}")
  ResponseEntity<GameSessionResponseDTO> getGameSessionById(
      @Parameter(description = "ID of the game session to retrieve") @PathVariable UUID id);

  @Operation(summary = "Create a new game session")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "Game session created successfully"),
      @ApiResponse(responseCode = "400", description = "Invalid input")
  })
  @PostMapping
  ResponseEntity<GameSessionResponseDTO> createGameSession(
      @Parameter(description = "Game session to create") @RequestBody GameSessionRequestDTO gameSessionDTO);

  @Operation(summary = "Update an existing game session")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Game session updated successfully"),
      @ApiResponse(responseCode = "404", description = "Game session not found"),
      @ApiResponse(responseCode = "400", description = "Invalid input")
  })
  @PutMapping("/{id}")
  ResponseEntity<GameSessionResponseDTO> updateGameSession(
      @Parameter(description = "ID of the game session to update") @PathVariable UUID id,
      @Parameter(description = "Updated game session data") @RequestBody UpdateGameSessionRequestDTO updateGameSessionRequestDTO);

  @Operation(summary = "Delete a game session")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "Game session deleted successfully"),
      @ApiResponse(responseCode = "404", description = "Game session not found")
  })
  @DeleteMapping("/{id}")
  ResponseEntity<Void> deleteGameSession(
      @Parameter(description = "ID of the game session to delete") @PathVariable UUID id);

  @Operation(summary = "Get all game history")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Successfully retrieved all game history")
  })
  @GetMapping("/history")
  ResponseEntity<List<GameActionLogResponseDTO>> getAllGameHistory();

  @Operation(summary = "Get game history by ID")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Successfully retrieved game history"),
      @ApiResponse(responseCode = "404", description = "Game history not found")
  })
  @GetMapping("/history/{id}")
  ResponseEntity<GameActionLogResponseDTO> getGameHistoryById(
      @Parameter(description = "ID of the game history to retrieve") @PathVariable UUID id);

  @Operation(summary = "Get game history by game ID")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Successfully retrieved game history"),
      @ApiResponse(responseCode = "404", description = "Game history not found")
  })
  @GetMapping("/history/gameId/{gameId}")
  ResponseEntity<List<GameActionLogResponseDTO>> getGameHistoryByGameId(
      @Parameter(description = "ID of the game to retrieve history for") @PathVariable UUID gameId);

  @Operation(summary = "Get game history by user ID and game ID")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Successfully retrieved game history"),
      @ApiResponse(responseCode = "404", description = "Game history not found")
  })
  @GetMapping("/history/userId/{userId}/gameId/{gameId}")
  ResponseEntity<List<GameActionLogResponseDTO>> getGameHistoryByUserIdAndGameId(
      @Parameter(description = "ID of the user to retrieve history for") @PathVariable String userId,
      @Parameter(description = "ID of the game to retrieve history for") @PathVariable UUID gameId);

  @Operation(summary = "Create a new game history entry")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "Game history entry created successfully"),
      @ApiResponse(responseCode = "400", description = "Invalid input")
  })
  @PostMapping("/history")
  ResponseEntity<GameActionLogResponseDTO> createGameHistory(
      @Parameter(description = "Game history entry to create") @RequestBody GameActionLogResponseDTO gameActionLogDTO);
}