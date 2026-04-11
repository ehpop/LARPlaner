package com.larplaner.mapper.scenario;

import static org.assertj.core.api.Assertions.assertThat;

import com.larplaner.dto.scenario.item.ScenarioItemRequestDTO;
import com.larplaner.dto.scenario.item.ScenarioItemSummaryResponseDTO;
import com.larplaner.dto.scenario.item.UpdateScenarioItemRequestDTO;
import com.larplaner.model.scenario.Scenario;
import com.larplaner.model.scenario.ScenarioItem;
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
class ScenarioItemMapperTest {

  @Mock
  private ScenarioItemActionMapper scenarioItemActionMapper;

  @InjectMocks
  private ScenarioItemMapper scenarioItemMapper;

  private ScenarioItem sampleItem;
  private Scenario sampleScenario;

  @BeforeEach
  void setUp() {
    sampleScenario = Scenario.builder().name("Test Scenario").build();
    sampleItem = ScenarioItem.builder()
        .name("Magic Sword")
        .description("A legendary sword")
        .scenario(sampleScenario)
        .actions(new ArrayList<>())
        .build();
  }

  @Nested
  @DisplayName("toDTO")
  class ToDTO {

    @Test
    @DisplayName("Should map ScenarioItem to summary DTO")
    void givenValidItem_whenToDTO_thenMapsAllFields() {
      // when
      ScenarioItemSummaryResponseDTO result = scenarioItemMapper.toDTO(sampleItem);

      // then
      assertThat(result).isNotNull();
      assertThat(result.getId()).isEqualTo(sampleItem.getId());
      assertThat(result.getName()).isEqualTo("Magic Sword");
      assertThat(result.getDescription()).isEqualTo("A legendary sword");
      assertThat(result.getScenarioId()).isEqualTo(sampleScenario.getId());
    }

    @Test
    @DisplayName("Should return null when input is null")
    void givenNull_whenToDTO_thenReturnsNull() {
      assertThat(scenarioItemMapper.toDTO(null)).isNull();
    }
  }

  @Nested
  @DisplayName("toEntity")
  class ToEntity {

    @Test
    @DisplayName("Should map DTO to entity")
    void givenValidDTO_whenToEntity_thenMapsCorrectly() {
      // given
      ScenarioItemRequestDTO dto = ScenarioItemRequestDTO.builder()
          .name("Shield")
          .description("A sturdy shield")
          .build();

      // when
      ScenarioItem result = scenarioItemMapper.toEntity(dto);

      // then
      assertThat(result).isNotNull();
      assertThat(result.getName()).isEqualTo("Shield");
      assertThat(result.getDescription()).isEqualTo("A sturdy shield");
    }

    @Test
    @DisplayName("Should return null when input is null")
    void givenNull_whenToEntity_thenReturnsNull() {
      assertThat(scenarioItemMapper.toEntity(null)).isNull();
    }
  }

  @Nested
  @DisplayName("updateEntityFromUpdateDTO")
  class UpdateEntityFromUpdateDTO {

    @Test
    @DisplayName("Should update only non-null fields")
    void givenPartialDTO_whenUpdate_thenUpdatesOnlyProvidedFields() {
      // given
      UpdateScenarioItemRequestDTO dto = UpdateScenarioItemRequestDTO.builder()
          .name("Updated Sword")
          .description(null)
          .build();

      // when
      scenarioItemMapper.updateEntityFromUpdateDTO(sampleItem, dto);

      // then
      assertThat(sampleItem.getName()).isEqualTo("Updated Sword");
      assertThat(sampleItem.getDescription()).isEqualTo("A legendary sword");
    }

    @Test
    @DisplayName("Should do nothing when DTO is null")
    void givenNullDTO_whenUpdate_thenDoesNothing() {
      scenarioItemMapper.updateEntityFromUpdateDTO(sampleItem, null);
      assertThat(sampleItem.getName()).isEqualTo("Magic Sword");
    }
  }
}
