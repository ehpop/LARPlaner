package com.larplaner.mapper.event;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

import com.larplaner.dto.event.EventRequestDTO;
import com.larplaner.dto.event.EventResponseDTO;
import com.larplaner.dto.event.EventUpdateRequestDTO;
import com.larplaner.dto.event.assignedRole.AssignedRoleResponseDTO;
import com.larplaner.model.event.AssignedRole;
import com.larplaner.model.event.Event;
import com.larplaner.model.event.EventStatusEnum;
import com.larplaner.model.game.GameSession;
import com.larplaner.model.scenario.Scenario;
import com.larplaner.repository.scenario.ScenarioRepository;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class EventMapperTest {

  @Mock
  private AssignedRoleMapper assignedRoleMapper;
  @Mock
  private ScenarioRepository scenarioRepository;

  @InjectMocks
  private EventMapper eventMapper;

  private Scenario sampleScenario;
  private Event sampleEvent;

  @BeforeEach
  void setUp() {
    sampleScenario = Scenario.builder().name("Test Scenario").build();
    sampleEvent = Event.builder()
        .name("Test Event")
        .description("A LARP event")
        .img("img.png")
        .date(ZonedDateTime.now().plusDays(7))
        .status(EventStatusEnum.UPCOMING)
        .scenario(sampleScenario)
        .build();
  }

  @Nested
  @DisplayName("toDTO")
  class ToDTO {

    @Test
    @DisplayName("Should map Event entity to EventResponseDTO with all fields")
    void givenEventWithScenarioAndNoGameSession_whenToDTO_thenMapAllFields() {
      // given
      AssignedRole assignedRole = AssignedRole.builder()
          .assignedEmail("test@example.com")
          .event(sampleEvent)
          .build();
      sampleEvent.getAssignedRoles().add(assignedRole);

      AssignedRoleResponseDTO assignedRoleDTO = AssignedRoleResponseDTO.builder()
          .id(assignedRole.getId())
          .assignedEmail("test@example.com")
          .build();
      given(assignedRoleMapper.toDTO(assignedRole)).willReturn(assignedRoleDTO);

      // when
      EventResponseDTO result = eventMapper.toDTO(sampleEvent);

      // then
      assertThat(result).isNotNull();
      assertThat(result.getId()).isEqualTo(sampleEvent.getId());
      assertThat(result.getName()).isEqualTo("Test Event");
      assertThat(result.getDescription()).isEqualTo("A LARP event");
      assertThat(result.getImg()).isEqualTo("img.png");
      assertThat(result.getStatus()).isEqualTo("upcoming");
      assertThat(result.getScenarioId()).isEqualTo(sampleScenario.getId());
      assertThat(result.getGameSessionId()).isNull();
      assertThat(result.getAssignedRoles()).hasSize(1);
      assertThat(result.getAssignedRoles().get(0).getAssignedEmail()).isEqualTo("test@example.com");
    }

    @Test
    @DisplayName("Should map gameSessionId when game session is present")
    void givenEventWithGameSession_whenToDTO_thenMapsGameSessionId() {
      // given
      GameSession gameSession = GameSession.builder()
          .startTime(ZonedDateTime.now())
          .build();
      sampleEvent.setGameSession(gameSession);

      // when
      EventResponseDTO result = eventMapper.toDTO(sampleEvent);

      // then
      assertThat(result.getGameSessionId()).isEqualTo(gameSession.getId());
    }
  }

  @Nested
  @DisplayName("toEntity")
  class ToEntity {

    @Test
    @DisplayName("Should map EventRequestDTO to Event entity")
    void givenValidDTO_whenToEntity_thenMapsCorrectly() {
      // given
      UUID scenarioId = sampleScenario.getId();
      EventRequestDTO dto = EventRequestDTO.builder()
          .name("New Event")
          .description("Desc")
          .img("new-img.png")
          .date(ZonedDateTime.now().plusDays(14))
          .scenarioId(scenarioId)
          .build();

      given(scenarioRepository.getReferenceById(scenarioId)).willReturn(sampleScenario);

      // when
      Event result = eventMapper.toEntity(dto);

      // then
      assertThat(result).isNotNull();
      assertThat(result.getName()).isEqualTo("New Event");
      assertThat(result.getDescription()).isEqualTo("Desc");
      assertThat(result.getImg()).isEqualTo("new-img.png");
      assertThat(result.getScenario()).isEqualTo(sampleScenario);
    }
  }

  @Nested
  @DisplayName("updateEntityFromDTO")
  class UpdateEntityFromDTO {

    @Test
    @DisplayName("Should update all fields of existing Event")
    void givenValidUpdateDTO_whenUpdate_thenUpdatesAllFields() {
      // given
      Scenario newScenario = Scenario.builder().name("New Scenario").build();
      UUID newScenarioId = newScenario.getId();
      ZonedDateTime newDate = ZonedDateTime.now().plusDays(21);

      EventUpdateRequestDTO dto = EventUpdateRequestDTO.builder()
          .name("Updated Name")
          .description("Updated Desc")
          .img("updated-img.png")
          .date(newDate)
          .scenarioId(newScenarioId)
          .build();

      given(scenarioRepository.getReferenceById(newScenarioId)).willReturn(newScenario);

      // when
      eventMapper.updateEntityFromDTO(dto, sampleEvent);

      // then
      assertThat(sampleEvent.getName()).isEqualTo("Updated Name");
      assertThat(sampleEvent.getDescription()).isEqualTo("Updated Desc");
      assertThat(sampleEvent.getImg()).isEqualTo("updated-img.png");
      assertThat(sampleEvent.getDate()).isEqualTo(newDate);
      assertThat(sampleEvent.getScenario()).isEqualTo(newScenario);
    }
  }
}
