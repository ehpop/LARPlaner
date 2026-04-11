package com.larplaner.api.scenario.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.mockito.BDDMockito.willThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.larplaner.dto.scenario.ScenarioDetailedResponseDTO;
import com.larplaner.dto.scenario.ScenarioRequestDTO;
import com.larplaner.dto.scenario.ScenarioResponseDTO;
import com.larplaner.dto.scenario.UpdateScenarioRequestDTO;
import com.larplaner.service.scenario.ScenarioService;
import jakarta.persistence.EntityNotFoundException;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ScenarioControllerImpl.class)
@AutoConfigureMockMvc(addFilters = false)
class ScenarioControllerIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @MockBean
  private ScenarioService scenarioService;

  private ScenarioResponseDTO sampleScenarioDTO;
  private UUID sampleScenarioId;

  @BeforeEach
  void setUp() {
    sampleScenarioId = UUID.randomUUID();
    sampleScenarioDTO = ScenarioResponseDTO.builder()
        .id(sampleScenarioId)
        .name("Test Scenario")
        .description("A LARP scenario")
        .roles(Collections.emptyList())
        .items(Collections.emptyList())
        .actions(Collections.emptyList())
        .build();
  }

  @Nested
  @DisplayName("GET /api/scenarios")
  class GetAllScenarios {

    @Test
    @DisplayName("Should return 200 and list of scenarios")
    void givenScenariosExist_whenGetAllScenarios_thenReturns200() throws Exception {
      // given
      given(scenarioService.getAllScenarios()).willReturn(List.of(sampleScenarioDTO));

      // when & then
      mockMvc.perform(get("/api/scenarios"))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$", hasSize(1)))
          .andExpect(jsonPath("$[0].name", is("Test Scenario")));
    }
  }

  @Nested
  @DisplayName("GET /api/scenarios/{id}")
  class GetScenarioById {

    @Test
    @DisplayName("Should return 200 when scenario exists")
    void givenExistingId_whenGetScenarioById_thenReturns200() throws Exception {
      // given
      given(scenarioService.getScenarioById(sampleScenarioId)).willReturn(sampleScenarioDTO);

      // when & then
      mockMvc.perform(get("/api/scenarios/{id}", sampleScenarioId))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.name", is("Test Scenario")))
          .andExpect(jsonPath("$.id", is(sampleScenarioId.toString())));
    }

    @Test
    @DisplayName("Should return 404 when scenario does not exist")
    void givenNonExistentId_whenGetScenarioById_thenReturns404() throws Exception {
      // given
      UUID nonExistentId = UUID.randomUUID();
      given(scenarioService.getScenarioById(nonExistentId))
          .willThrow(
              new EntityNotFoundException("Scenario not found with id: " + nonExistentId));

      // when & then
      mockMvc.perform(get("/api/scenarios/{id}", nonExistentId))
          .andExpect(status().isNotFound());
    }
  }

  @Nested
  @DisplayName("GET /api/scenarios/{id}/detailed")
  class GetDetailedScenarioById {

    @Test
    @DisplayName("Should return 200 when detailed scenario exists")
    void givenExistingId_whenGetDetailedScenarioById_thenReturns200() throws Exception {
      // given
      ScenarioDetailedResponseDTO detailedDTO = ScenarioDetailedResponseDTO.builder()
          .id(sampleScenarioId)
          .name("Test Scenario")
          .description("A LARP scenario")
          .roles(Collections.emptyList())
          .items(Collections.emptyList())
          .actions(Collections.emptyList())
          .build();

      given(scenarioService.getDetailedScenarioById(sampleScenarioId)).willReturn(detailedDTO);

      // when & then
      mockMvc.perform(get("/api/scenarios/{id}/detailed", sampleScenarioId))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.name", is("Test Scenario")));
    }
  }

  @Nested
  @DisplayName("POST /api/scenarios")
  class CreateScenario {

    @Test
    @DisplayName("Should return 201 when scenario is created successfully")
    void givenValidRequest_whenCreateScenario_thenReturns201() throws Exception {
      // given
      ScenarioRequestDTO requestDTO = ScenarioRequestDTO.builder()
          .name("New Scenario")
          .description("A new scenario")
          .build();

      given(scenarioService.createScenario(any(ScenarioRequestDTO.class)))
          .willReturn(sampleScenarioDTO);

      // when & then
      mockMvc.perform(post("/api/scenarios")
              .contentType(MediaType.APPLICATION_JSON)
              .content(objectMapper.writeValueAsString(requestDTO)))
          .andExpect(status().isCreated())
          .andExpect(jsonPath("$.name", is("Test Scenario")));
    }

    @Test
    @DisplayName("Should return 400 when validation fails (blank name)")
    void givenBlankName_whenCreateScenario_thenReturns400() throws Exception {
      // given
      ScenarioRequestDTO invalidDTO = ScenarioRequestDTO.builder()
          .name("")
          .description("Description")
          .build();

      // when & then
      mockMvc.perform(post("/api/scenarios")
              .contentType(MediaType.APPLICATION_JSON)
              .content(objectMapper.writeValueAsString(invalidDTO)))
          .andExpect(status().isBadRequest());
    }
  }

  @Nested
  @DisplayName("PUT /api/scenarios/{id}")
  class UpdateScenario {

    @Test
    @DisplayName("Should return 200 when scenario is updated successfully")
    void givenValidRequest_whenUpdateScenario_thenReturns200() throws Exception {
      // given
      UpdateScenarioRequestDTO updateDTO = UpdateScenarioRequestDTO.builder()
          .name("Updated Scenario")
          .description("Updated description")
          .build();

      ScenarioResponseDTO updatedDTO = ScenarioResponseDTO.builder()
          .id(sampleScenarioId)
          .name("Updated Scenario")
          .description("Updated description")
          .build();

      given(scenarioService.updateScenario(eq(sampleScenarioId),
          any(UpdateScenarioRequestDTO.class)))
          .willReturn(updatedDTO);

      // when & then
      mockMvc.perform(put("/api/scenarios/{id}", sampleScenarioId)
              .contentType(MediaType.APPLICATION_JSON)
              .content(objectMapper.writeValueAsString(updateDTO)))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.name", is("Updated Scenario")));
    }
  }

  @Nested
  @DisplayName("DELETE /api/scenarios/{id}")
  class DeleteScenario {

    @Test
    @DisplayName("Should return 204 when scenario is deleted successfully")
    void givenExistingId_whenDeleteScenario_thenReturns204() throws Exception {
      // given
      willDoNothing().given(scenarioService).deleteScenario(sampleScenarioId);

      // when & then
      mockMvc.perform(delete("/api/scenarios/{id}", sampleScenarioId))
          .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("Should return 404 when scenario to delete does not exist")
    void givenNonExistentId_whenDeleteScenario_thenReturns404() throws Exception {
      // given
      UUID nonExistentId = UUID.randomUUID();
      willThrow(new EntityNotFoundException("Scenario not found"))
          .given(scenarioService).deleteScenario(nonExistentId);

      // when & then
      mockMvc.perform(delete("/api/scenarios/{id}", nonExistentId))
          .andExpect(status().isNotFound());
    }
  }
}
