package com.larplaner.mapper.scenario;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

import com.larplaner.dto.action.ActionResponseDTO;
import com.larplaner.dto.scenario.action.ScenarioActionResponseDTO;
import com.larplaner.mapper.action.ActionMapper;
import com.larplaner.model.action.Action;
import com.larplaner.model.scenario.Scenario;
import com.larplaner.model.scenario.ScenarioAction;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ScenarioActionMapperTest {

  @Mock
  private ActionMapper actionMapper;

  @InjectMocks
  private ScenarioActionMapper scenarioActionMapper;

  @Test
  @DisplayName("Should delegate to ActionMapper and add scenarioId")
  void givenScenarioAction_whenToDTO_thenDelegatesAndAddsScenarioId() {
    // given
    Action action = Action.builder().name("Attack").description("Basic attack").build();
    Scenario scenario = Scenario.builder().name("Scenario").build();
    ScenarioAction scenarioAction = new ScenarioAction(action);
    scenarioAction.setScenario(scenario);

    ActionResponseDTO actionDTO = ActionResponseDTO.builder()
        .id(action.getId())
        .name("Attack")
        .build();
    given(actionMapper.toDTO(scenarioAction)).willReturn(actionDTO);

    // when
    ScenarioActionResponseDTO result = scenarioActionMapper.toDTO(scenarioAction);

    // then
    assertThat(result).isNotNull();
    assertThat(result.getName()).isEqualTo("Attack");
    assertThat(result.getScenarioId()).isEqualTo(scenario.getId());
  }

  @Test
  @DisplayName("Should return null when input is null")
  void givenNull_whenToDTO_thenReturnsNull() {
    assertThat(scenarioActionMapper.toDTO(null)).isNull();
  }
}
