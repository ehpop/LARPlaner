package com.larplaner.service.scenario;

import com.larplaner.dto.scenario.ScenarioDetailedResponseDTO;
import java.util.List;
import java.util.UUID;

import com.larplaner.dto.scenario.ScenarioRequestDTO;
import com.larplaner.dto.scenario.ScenarioResponseDTO;
import com.larplaner.dto.scenario.UpdateScenarioRequestDTO;

public interface ScenarioService {

  List<ScenarioResponseDTO> getAllScenarios();

  ScenarioResponseDTO getScenarioById(UUID id);

  ScenarioResponseDTO createScenario(ScenarioRequestDTO scenarioDTO);

  ScenarioResponseDTO updateScenario(UUID id, UpdateScenarioRequestDTO scenarioDTO);

  void deleteScenario(UUID id);

  ScenarioDetailedResponseDTO getDetailedScenarioById(UUID id);
}