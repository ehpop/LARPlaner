package com.larplaner.mapper.scenario;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

import com.larplaner.dto.scenario.ScenarioDetailedResponseDTO;
import com.larplaner.dto.scenario.ScenarioRequestDTO;
import com.larplaner.dto.scenario.ScenarioResponseDTO;
import com.larplaner.dto.scenario.UpdateScenarioRequestDTO;
import com.larplaner.model.scenario.Scenario;
import java.util.ArrayList;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ScenarioMapperTest {

  @Mock
  private ScenarioItemMapper scenarioItemMapper;
  @Mock
  private ScenarioRoleMapper scenarioRoleMapper;
  @Mock
  private ScenarioActionMapper scenarioActionMapper;

  @InjectMocks
  private ScenarioMapper scenarioMapper;

  private Scenario sampleScenario;

  @BeforeEach
  void setUp() {
    sampleScenario = Scenario.builder()
        .name("Test Scenario")
        .description("A LARP scenario")
        .roles(new ArrayList<>())
        .items(new ArrayList<>())
        .actions(new ArrayList<>())
        .build();
  }

  @Nested
  @DisplayName("toDTO")
  class ToDTO {

    @Test
    @DisplayName("Should map Scenario entity to ScenarioResponseDTO")
    void givenScenario_whenToDTO_thenMapsAllFields() {
      // when
      ScenarioResponseDTO result = scenarioMapper.toDTO(sampleScenario);

      // then
      assertThat(result).isNotNull();
      assertThat(result.getId()).isEqualTo(sampleScenario.getId());
      assertThat(result.getName()).isEqualTo("Test Scenario");
      assertThat(result.getDescription()).isEqualTo("A LARP scenario");
      assertThat(result.getRoles()).isEmpty();
      assertThat(result.getItems()).isEmpty();
      assertThat(result.getActions()).isEmpty();
    }

    @Test
    @DisplayName("Should return null when input is null")
    void givenNull_whenToDTO_thenReturnsNull() {
      assertThat(scenarioMapper.toDTO(null)).isNull();
    }
  }

  @Nested
  @DisplayName("toDetailedDTO")
  class ToDetailedDTO {

    @Test
    @DisplayName("Should map Scenario entity to ScenarioDetailedResponseDTO")
    void givenScenario_whenToDetailedDTO_thenMapsAllFields() {
      // when
      ScenarioDetailedResponseDTO result = scenarioMapper.toDetailedDTO(sampleScenario);

      // then
      assertThat(result).isNotNull();
      assertThat(result.getId()).isEqualTo(sampleScenario.getId());
      assertThat(result.getName()).isEqualTo("Test Scenario");
    }

    @Test
    @DisplayName("Should return null when input is null")
    void givenNull_whenToDetailedDTO_thenReturnsNull() {
      assertThat(scenarioMapper.toDetailedDTO(null)).isNull();
    }
  }

  @Nested
  @DisplayName("toEntity")
  class ToEntity {

    @Test
    @DisplayName("Should map ScenarioRequestDTO to Scenario entity")
    void givenValidDTO_whenToEntity_thenMapsCorrectly() {
      // given
      ScenarioRequestDTO dto = ScenarioRequestDTO.builder()
          .name("New Scenario")
          .description("New description")
          .build();

      // when
      Scenario result = scenarioMapper.toEntity(dto);

      // then
      assertThat(result).isNotNull();
      assertThat(result.getName()).isEqualTo("New Scenario");
      assertThat(result.getDescription()).isEqualTo("New description");
    }

    @Test
    @DisplayName("Should return null when input is null")
    void givenNull_whenToEntity_thenReturnsNull() {
      assertThat(scenarioMapper.toEntity(null)).isNull();
    }
  }

  @Nested
  @DisplayName("updateEntityFromDTO")
  class UpdateEntityFromDTO {

    @Test
    @DisplayName("Should update name and description when both are provided")
    void givenFullUpdateDTO_whenUpdate_thenUpdatesFields() {
      // given
      UpdateScenarioRequestDTO dto = UpdateScenarioRequestDTO.builder()
          .name("Updated Name")
          .description("Updated Description")
          .build();

      // when
      scenarioMapper.updateEntityFromDTO(dto, sampleScenario);

      // then
      assertThat(sampleScenario.getName()).isEqualTo("Updated Name");
      assertThat(sampleScenario.getDescription()).isEqualTo("Updated Description");
    }

    @Test
    @DisplayName("Should not update fields when DTO values are null")
    void givenNullFields_whenUpdate_thenKeepsOriginalValues() {
      // given
      UpdateScenarioRequestDTO dto = UpdateScenarioRequestDTO.builder()
          .name(null)
          .description(null)
          .build();

      // when
      scenarioMapper.updateEntityFromDTO(dto, sampleScenario);

      // then
      assertThat(sampleScenario.getName()).isEqualTo("Test Scenario");
      assertThat(sampleScenario.getDescription()).isEqualTo("A LARP scenario");
    }

    @Test
    @DisplayName("Should do nothing when either argument is null")
    void givenNullArguments_whenUpdate_thenDoesNothing() {
      scenarioMapper.updateEntityFromDTO(null, sampleScenario);
      assertThat(sampleScenario.getName()).isEqualTo("Test Scenario");
    }
  }
}
