package com.larplaner.api.scenario.controller;

import com.larplaner.api.scenario.ScenarioController;
import com.larplaner.dto.scenario.ScenarioRequestDTO;
import com.larplaner.dto.scenario.ScenarioResponseDTO;
import com.larplaner.dto.scenario.UpdateScenarioRequestDTO;
import com.larplaner.service.scenario.ScenarioService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/scenarios")
@RequiredArgsConstructor
public class ScenarioControllerImpl implements ScenarioController {

  private final ScenarioService scenarioService;

  @Override
  public ResponseEntity<List<ScenarioResponseDTO>> getAllScenarios() {
    return ResponseEntity.ok(scenarioService.getAllScenarios());
  }

  @Override
  public ResponseEntity<ScenarioResponseDTO> getScenarioById(UUID id) {
    ScenarioResponseDTO scenario = scenarioService.getScenarioById(id);
    return scenario != null
        ? ResponseEntity.ok(scenario)
        : ResponseEntity.notFound().build();
  }

  @Override
  public ResponseEntity<ScenarioResponseDTO> createScenario(ScenarioRequestDTO scenarioDTO) {
    var createdScenario = scenarioService.createScenario(scenarioDTO);

    return ResponseEntity.status(HttpStatus.CREATED)
        .body(createdScenario);
  }

  @Override
  public ResponseEntity<ScenarioResponseDTO> updateScenario(UUID id,
      UpdateScenarioRequestDTO scenarioDTO) {
    ScenarioResponseDTO updatedScenario = scenarioService.updateScenario(id, scenarioDTO);
    return updatedScenario != null
        ? ResponseEntity.ok(updatedScenario)
        : ResponseEntity.notFound().build();
  }

  @Override
  public ResponseEntity<Void> deleteScenario(UUID id) {
    scenarioService.deleteScenario(id);
    return ResponseEntity.noContent().build();
  }
}