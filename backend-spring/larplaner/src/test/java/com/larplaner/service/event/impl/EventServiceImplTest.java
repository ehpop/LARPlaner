package com.larplaner.service.event.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import com.larplaner.dto.event.EventRequestDTO;
import com.larplaner.dto.event.EventResponseDTO;
import com.larplaner.dto.event.EventUpdateRequestDTO;
import com.larplaner.exception.EntityCouldNotBeDeleted;
import com.larplaner.exception.EntityCouldNotBeEdited;
import com.larplaner.exception.event.status.EventStatusCouldNotBeChanged;
import com.larplaner.mapper.event.AssignedRoleMapper;
import com.larplaner.mapper.event.EventMapper;
import com.larplaner.model.event.Event;
import com.larplaner.model.event.EventStatusEnum;
import com.larplaner.model.game.GameSession;
import com.larplaner.repository.event.EventRepository;
import com.larplaner.repository.game.GameSessionRepository;
import com.larplaner.service.admin.firebase.UserLookupService;
import com.larplaner.service.game.impl.GameSessionServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

@ExtendWith(MockitoExtension.class)
class EventServiceImplTest {

  @Mock
  private UserLookupService userLookupService;
  @Mock
  private EventRepository eventRepository;
  @Mock
  private EventMapper eventMapper;
  @Mock
  private AssignedRoleMapper assignedRoleMapper;
  @Mock
  private GameSessionRepository gameSessionRepository;
  @Mock
  private GameSessionServiceImpl gameSessionService;

  @InjectMocks
  private EventServiceImpl eventService;

  private Event sampleEvent;
  private EventResponseDTO sampleEventDTO;
  private UUID sampleEventId;

  @BeforeEach
  void setUp() {
    sampleEvent = Event.builder()
        .name("Test Event")
        .description("A test LARP event")
        .date(ZonedDateTime.now().plusDays(7))
        .status(EventStatusEnum.UPCOMING)
        .assignedRoles(new ArrayList<>())
        .build();

    sampleEventId = sampleEvent.getId();

    sampleEventDTO = EventResponseDTO.builder()
        .id(sampleEventId)
        .name(sampleEvent.getName())
        .description(sampleEvent.getDescription())
        .status(EventStatusEnum.UPCOMING.toString())
        .date(sampleEvent.getDate())
        .build();
  }

  @Nested
  @DisplayName("getAllEvents")
  class GetAllEvents {

    @Test
    @DisplayName("Should return list of event DTOs")
    void givenEventsExist_whenGetAllEvents_thenReturnsListOfEventDTOs() {
      // given
      given(eventRepository.findAll()).willReturn(List.of(sampleEvent));
      given(eventMapper.toDTO(sampleEvent)).willReturn(sampleEventDTO);

      // when
      List<EventResponseDTO> result = eventService.getAllEvents();

      // then
      assertThat(result).isNotNull().hasSize(1);
      assertThat(result.get(0).getName()).isEqualTo("Test Event");
      verify(eventRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should return empty list when no events exist")
    void givenNoEvents_whenGetAllEvents_thenReturnsEmptyList() {
      // given
      given(eventRepository.findAll()).willReturn(Collections.emptyList());

      // when
      List<EventResponseDTO> result = eventService.getAllEvents();

      // then
      assertThat(result).isNotNull().isEmpty();
    }
  }

  @Nested
  @DisplayName("getEventById")
  class GetEventById {

    @Test
    @DisplayName("Should return event DTO when event exists")
    void givenExistingId_whenGetEventById_thenReturnsEventDTO() {
      // given
      given(eventRepository.findById(sampleEventId)).willReturn(Optional.of(sampleEvent));
      given(eventMapper.toDTO(sampleEvent)).willReturn(sampleEventDTO);

      // when
      EventResponseDTO result = eventService.getEventById(sampleEventId);

      // then
      assertThat(result).isNotNull();
      assertThat(result.getId()).isEqualTo(sampleEventId);
      assertThat(result.getName()).isEqualTo("Test Event");
    }

    @Test
    @DisplayName("Should return null when event does not exist")
    void givenNonExistentId_whenGetEventById_thenReturnsNull() {
      // given
      UUID nonExistentId = UUID.randomUUID();
      given(eventRepository.findById(nonExistentId)).willReturn(Optional.empty());

      // when
      EventResponseDTO result = eventService.getEventById(nonExistentId);

      // then
      assertThat(result).isNull();
    }
  }

  @Nested
  @DisplayName("createEvent")
  class CreateEvent {

    @Test
    @DisplayName("Should save and return event DTO")
    void givenValidRequest_whenCreateEvent_thenSavesAndReturnsDTO() {
      // given
      EventRequestDTO requestDTO = EventRequestDTO.builder()
          .name("New Event")
          .description("New event description")
          .date(ZonedDateTime.now().plusDays(14))
          .scenarioId(UUID.randomUUID())
          .assignedRoles(Collections.emptyList())
          .build();

      given(eventMapper.toEntity(requestDTO)).willReturn(sampleEvent);
      given(eventRepository.save(sampleEvent)).willReturn(sampleEvent);
      given(eventMapper.toDTO(sampleEvent)).willReturn(sampleEventDTO);

      // when
      EventResponseDTO result = eventService.createEvent(requestDTO);

      // then
      assertThat(result).isNotNull();
      assertThat(result.getName()).isEqualTo("Test Event");
      verify(eventRepository, times(1)).save(sampleEvent);
    }
  }

  @Nested
  @DisplayName("updateEvent")
  class UpdateEvent {

    @Test
    @DisplayName("Should throw EntityNotFoundException when event does not exist")
    void givenNonExistentId_whenUpdateEvent_thenThrowsEntityNotFoundException() {
      // given
      UUID nonExistentId = UUID.randomUUID();
      EventUpdateRequestDTO updateDTO = EventUpdateRequestDTO.builder()
          .name("Updated")
          .description("Updated desc")
          .date(ZonedDateTime.now())
          .scenarioId(UUID.randomUUID())
          .build();
      given(eventRepository.existsById(nonExistentId)).willReturn(false);

      // when & then
      assertThatThrownBy(() -> eventService.updateEvent(nonExistentId, updateDTO))
          .isInstanceOf(EntityNotFoundException.class)
          .hasMessageContaining("Event not found with id: " + nonExistentId);
      verify(eventRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw EntityCouldNotBeEdited when event status is not UPCOMING")
    void givenActiveStatus_whenUpdateEvent_thenThrowsEntityCouldNotBeEdited() {
      // given
      Event activeEvent = Event.builder()
          .name("Active Event")
          .description("Desc")
          .status(EventStatusEnum.ACTIVE)
          .build();
      UUID activeEventId = activeEvent.getId();

      EventUpdateRequestDTO updateDTO = EventUpdateRequestDTO.builder()
          .name("Updated")
          .description("Updated desc")
          .date(ZonedDateTime.now())
          .scenarioId(UUID.randomUUID())
          .build();

      given(eventRepository.existsById(activeEventId)).willReturn(true);
      given(eventRepository.getReferenceById(activeEventId)).willReturn(activeEvent);

      // when & then
      assertThatThrownBy(() -> eventService.updateEvent(activeEventId, updateDTO))
          .isInstanceOf(EntityCouldNotBeEdited.class)
          .hasMessageContaining("Event can not be edited");
      verify(eventRepository, never()).save(any());
    }
  }

  @Nested
  @DisplayName("deleteEvent")
  class DeleteEvent {

    @Test
    @DisplayName("Should call repository deleteById when event exists")
    void givenExistingId_whenDeleteEvent_thenCallsRepositoryDelete() {
      // given
      given(eventRepository.existsById(sampleEventId)).willReturn(true);
      willDoNothing().given(eventRepository).deleteById(sampleEventId);

      // when
      eventService.deleteEvent(sampleEventId);

      // then
      verify(eventRepository, times(1)).deleteById(sampleEventId);
    }

    @Test
    @DisplayName("Should throw EntityNotFoundException when event does not exist")
    void givenNonExistentId_whenDeleteEvent_thenThrowsEntityNotFoundException() {
      // given
      UUID nonExistentId = UUID.randomUUID();
      given(eventRepository.existsById(nonExistentId)).willReturn(false);

      // when & then
      assertThatThrownBy(() -> eventService.deleteEvent(nonExistentId))
          .isInstanceOf(EntityNotFoundException.class)
          .hasMessageContaining("Event not found with id: " + nonExistentId);
      verify(eventRepository, never()).deleteById(any());
    }

    @Test
    @DisplayName("Should throw EntityCouldNotBeDeleted when data integrity violation occurs")
    void givenForeignKeyConstraint_whenDeleteEvent_thenThrowsEntityCouldNotBeDeleted() {
      // given
      given(eventRepository.existsById(sampleEventId)).willReturn(true);
      willThrow(new DataIntegrityViolationException("FK constraint"))
          .given(eventRepository).deleteById(sampleEventId);

      GameSession referencedGame = GameSession.builder()
          .event(sampleEvent)
          .startTime(ZonedDateTime.now())
          .build();
      given(gameSessionRepository.findByEventId(sampleEventId))
          .willReturn(Optional.of(referencedGame));

      // when & then
      assertThatThrownBy(() -> eventService.deleteEvent(sampleEventId))
          .isInstanceOf(EntityCouldNotBeDeleted.class)
          .hasMessageContaining("Event could not be deleted");
    }
  }

  @Nested
  @DisplayName("updateEventStatus")
  class UpdateEventStatus {

    @Nested
    @DisplayName("Edge Cases — Invalid Transitions")
    class InvalidTransitions {

      @Test
      @DisplayName("Should throw EventStatusCouldNotBeChanged when current status equals new status")
      void givenSameStatus_whenUpdateEventStatus_thenThrowsException() {
        // given
        given(eventRepository.findById(sampleEventId)).willReturn(Optional.of(sampleEvent));

        // when & then
        assertThatThrownBy(
            () -> eventService.updateEventStatus(sampleEventId, EventStatusEnum.UPCOMING))
            .isInstanceOf(EventStatusCouldNotBeChanged.class)
            .hasMessageContaining("Event Status is already");
      }

      @Test
      @DisplayName("Should throw EventStatusCouldNotBeChanged when transitioning from HISTORIC")
      void givenHistoricStatus_whenUpdateEventStatus_thenThrowsException() {
        // given
        Event historicEvent = Event.builder()
            .name("Historic Event")
            .description("Desc")
            .status(EventStatusEnum.HISTORIC)
            .build();
        UUID historicId = historicEvent.getId();
        given(eventRepository.findById(historicId)).willReturn(Optional.of(historicEvent));

        // when & then
        assertThatThrownBy(
            () -> eventService.updateEventStatus(historicId, EventStatusEnum.ACTIVE))
            .isInstanceOf(EventStatusCouldNotBeChanged.class)
            .hasMessageContaining("Cannot change event status from historic");
      }

      @ParameterizedTest
      @MethodSource(
          "com.larplaner.service.event.impl.EventServiceImplTest#invalidStatusTransitions")
      @DisplayName("Should throw EventStatusCouldNotBeChanged for invalid transitions")
      void givenInvalidTransition_whenUpdateEventStatus_thenThrowsException(
          EventStatusEnum currentStatus, EventStatusEnum newStatus, String expectedMessage) {
        // given
        Event event = Event.builder()
            .name("Event")
            .description("Desc")
            .status(currentStatus)
            .build();
        given(eventRepository.findById(event.getId())).willReturn(Optional.of(event));

        // when & then
        assertThatThrownBy(
            () -> eventService.updateEventStatus(event.getId(), newStatus))
            .isInstanceOf(EventStatusCouldNotBeChanged.class)
            .hasMessageContaining(expectedMessage);
      }
    }

    @Nested
    @DisplayName("Happy Path — Valid Transitions")
    class ValidTransitions {

      @Test
      @DisplayName("Should transition ACTIVE to HISTORIC and set end time")
      void givenActiveEvent_whenUpdateToHistoric_thenTransitionsAndSetsEndTime() {
        // given
        GameSession gameSession = GameSession.builder()
            .startTime(ZonedDateTime.now().minusHours(2))
            .build();
        Event activeEvent = Event.builder()
            .name("Active Event")
            .description("Desc")
            .status(EventStatusEnum.ACTIVE)
            .gameSession(gameSession)
            .build();
        UUID activeId = activeEvent.getId();

        EventResponseDTO expectedDTO = EventResponseDTO.builder()
            .id(activeId)
            .name("Active Event")
            .status(EventStatusEnum.HISTORIC.toString())
            .build();

        given(eventRepository.findById(activeId)).willReturn(Optional.of(activeEvent));
        given(eventRepository.save(activeEvent)).willReturn(activeEvent);
        given(eventMapper.toDTO(activeEvent)).willReturn(expectedDTO);

        // when
        EventResponseDTO result = eventService.updateEventStatus(activeId,
            EventStatusEnum.HISTORIC);

        // then
        assertThat(result.getStatus()).isEqualTo(EventStatusEnum.HISTORIC.toString());
        assertThat(activeEvent.getStatus()).isEqualTo(EventStatusEnum.HISTORIC);
        assertThat(gameSession.getEndTime()).isNotNull();
        verify(eventRepository, times(1)).save(activeEvent);
      }
    }
  }

  static Stream<Arguments> invalidStatusTransitions() {
    return Stream.of(
        Arguments.of(EventStatusEnum.ACTIVE, EventStatusEnum.UPCOMING,
            "Cannot change event status from active to upcoming"),
        Arguments.of(EventStatusEnum.HISTORIC, EventStatusEnum.UPCOMING,
            "Cannot change event status from historic"),
        Arguments.of(EventStatusEnum.HISTORIC, EventStatusEnum.ACTIVE,
            "Cannot change event status from historic")
    );
  }
}
