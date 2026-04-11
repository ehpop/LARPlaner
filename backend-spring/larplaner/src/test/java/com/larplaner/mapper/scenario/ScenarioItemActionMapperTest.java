package com.larplaner.mapper.scenario;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

import com.larplaner.dto.action.ActionResponseDTO;
import com.larplaner.dto.scenario.itemAction.ScenarioItemActionResponseDTO;
import com.larplaner.mapper.action.ActionMapper;
import com.larplaner.model.action.Action;
import com.larplaner.model.scenario.ScenarioItem;
import com.larplaner.model.scenario.ScenarioItemAction;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ScenarioItemActionMapperTest {

  @Mock
  private ActionMapper actionMapper;

  @InjectMocks
  private ScenarioItemActionMapper scenarioItemActionMapper;

  @Test
  @DisplayName("Should delegate to ActionMapper and add itemId")
  void givenScenarioItemAction_whenToDTO_thenDelegatesAndAddsItemId() {
    // given
    Action action = Action.builder().name("Use").description("Use item").build();
    ScenarioItem item = ScenarioItem.builder().name("Potion").build();
    ScenarioItemAction scenarioItemAction = new ScenarioItemAction(action);
    scenarioItemAction.setItem(item);

    ActionResponseDTO actionDTO = ActionResponseDTO.builder()
        .id(action.getId())
        .name("Use")
        .build();
    given(actionMapper.toDTO(scenarioItemAction)).willReturn(actionDTO);

    // when
    ScenarioItemActionResponseDTO result = scenarioItemActionMapper.toDTO(scenarioItemAction);

    // then
    assertThat(result).isNotNull();
    assertThat(result.getName()).isEqualTo("Use");
    assertThat(result.getItemId()).isEqualTo(item.getId());
  }

  @Test
  @DisplayName("Should return null when input is null")
  void givenNull_whenToDTO_thenReturnsNull() {
    assertThat(scenarioItemActionMapper.toDTO(null)).isNull();
  }
}
