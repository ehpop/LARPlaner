package com.larplaner.api.scenario;

import com.larplaner.dto.scenario.ScenarioRequestDTO;
import com.larplaner.dto.scenario.ScenarioResponseDTO;
import com.larplaner.dto.scenario.UpdateScenarioRequestDTO;
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

@Tag(name = "Scenario", description = "Scenario management APIs")
@SecurityRequirement(name = "bearer-key")
public interface ScenarioController {

  @Operation(summary = "Get all scenarios")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Successfully retrieved all scenarios")
  })
  @GetMapping
  ResponseEntity<List<ScenarioResponseDTO>> getAllScenarios();

  @Operation(summary = "Get scenario by ID")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Successfully retrieved scenario"),
      @ApiResponse(responseCode = "404", description = "Scenario not found")
  })
  @GetMapping("/{id}")
  ResponseEntity<ScenarioResponseDTO> getScenarioById(
      @Parameter(description = "ID of the scenario to retrieve") @PathVariable UUID id);

  @Operation(summary = "Create a new scenario")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "Scenario created successfully"),
      @ApiResponse(responseCode = "400", description = "Invalid input")
  })
  @PostMapping
  ResponseEntity<ScenarioResponseDTO> createScenario(
      @Parameter(description = "Scenario to create") @Valid @RequestBody ScenarioRequestDTO scenarioDTO);

  @Operation(summary = "Update an existing scenario")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Scenario updated successfully"),
      @ApiResponse(responseCode = "404", description = "Scenario not found"),
      @ApiResponse(responseCode = "400", description = "Invalid input")
  })
  @PutMapping("/{id}")
  ResponseEntity<ScenarioResponseDTO> updateScenario(
      @Parameter(description = "ID of the scenario to update") @PathVariable UUID id,
      @Parameter(description = "Updated scenario data") @Valid @RequestBody UpdateScenarioRequestDTO scenarioDTO);

  @Operation(summary = "Delete a scenario")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "Scenario deleted successfully"),
      @ApiResponse(responseCode = "404", description = "Scenario not found")
  })
  @DeleteMapping("/{id}")
  ResponseEntity<Void> deleteScenario(
      @Parameter(description = "ID of the scenario to delete") @PathVariable UUID id);
}