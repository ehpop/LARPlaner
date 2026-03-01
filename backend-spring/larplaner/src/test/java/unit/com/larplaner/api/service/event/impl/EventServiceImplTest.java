package unit.com.larplaner.api.service.event.impl;

import com.larplaner.dto.event.EventRequestDTO;
import com.larplaner.dto.event.EventResponseDTO;
import com.larplaner.dto.event.EventUpdateRequestDTO;
import com.larplaner.exception.EntityCouldNotBeDeleted;
import com.larplaner.exception.EntityCouldNotBeEdited;
import com.larplaner.exception.event.status.EventStatusCouldNotBeChanged;
import com.larplaner.mapper.event.EventMapper;
import com.larplaner.model.event.AssignedRole;
import com.larplaner.model.event.Event;
import com.larplaner.model.event.EventStatusEnum;
import com.larplaner.model.game.GameSession;
import com.larplaner.repository.event.EventRepository;
import com.larplaner.repository.game.GameSessionRepository;
import com.larplaner.service.admin.firebase.UserLookupService;
import com.larplaner.service.event.impl.EventServiceImpl;
import com.larplaner.service.game.impl.GameSessionServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;

@ExtendWith(MockitoExtension.class)
class EventServiceImplTest {

    @Mock
    private UserLookupService userLookupService;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private EventMapper eventMapper;

    @Mock
    private GameSessionRepository gameSessionRepository;

    @Mock
    private GameSessionServiceImpl gameSessionService;

    @InjectMocks
    private EventServiceImpl eventService;

    @Nested
    class GetAllEvents {

        @Test
        void givenNoEventsExist_whenGetAllEvents_thenReturnEmptyList() {
            // given
            given(eventRepository.findAll()).willReturn(Collections.emptyList());

            // when
            var result = eventService.getAllEvents();

            // then
            then(eventRepository).should().findAll();
            then(eventRepository).shouldHaveNoMoreInteractions();

            assertNotNull(result);
            assertThat(result).isEmpty();
        }

        @Test
        void givenEventsExist_whenGetAllEvents_thenReturnListsWithDTOs() {
            // given
            List<Event> events = List.of(
                    Event.builder().name("Event_1").build(),
                    Event.builder().name("Event_2").build()
            );
            given(eventRepository.findAll()).willReturn(events);
            given(eventMapper.toDTO(any(Event.class))).willReturn(
                    EventResponseDTO.builder().build()
            );

            // when
            var result = eventService.getAllEvents();

            // then
            then(eventRepository).should().findAll();
            then(eventRepository).shouldHaveNoMoreInteractions();

            assertNotNull(result);
            assertThat(result).isNotEmpty();
            assertThat(result).hasSize(2);
        }
    }

    @Nested
    class GetEventById {

        @Test
        void givenEventExist_whenGetEventById_thenReturnEventDTO() {
            // given
            Event event = Event.builder().name("Event_1").build();

            given(eventRepository.findById(any(UUID.class))).willReturn(Optional.of(event));
            given(eventMapper.toDTO(any(Event.class))).willReturn(
                    EventResponseDTO.builder().build()
            );

            // when
            var result = eventService.getEventById(event.getId());

            // then
            then(eventRepository).should().findById(event.getId());
            then(eventRepository).shouldHaveNoMoreInteractions();

            assertNotNull(result);
        }
    }

    @Nested
    class CreateEvent {

        @Test
        void givenEventRequestDTO_whenCreateEvent_thenCreateEventAndReturnDTO() {
            // given
            EventRequestDTO eventRequestDTO = EventRequestDTO.builder().name("Event_1").build();
            Event event = Event.builder().name("Event_1").build();

            given(eventMapper.toEntity(any(EventRequestDTO.class))).willReturn(event);
            given(eventRepository.save(any(Event.class))).willReturn(event);
            given(eventMapper.toDTO(any(Event.class))).willReturn(
                    EventResponseDTO.builder().build()
            );

            // when
            var result = eventService.createEvent(eventRequestDTO);

            // then
            then(eventRepository).should().save(event);
            then(eventRepository).shouldHaveNoMoreInteractions();

            assertNotNull(result);
        }
    }

    @Nested
    class UpdateEvent {

        @Test
        void givenValidRequest_whenUpdateEvent_thenSuccess() {
            // given
            EventUpdateRequestDTO updateRequest = EventUpdateRequestDTO.builder().build();
            Event event = Event.builder().status(EventStatusEnum.UPCOMING).build();
            UUID eventId = event.getId();

            given(eventRepository.existsById(eventId)).willReturn(true);
            given(eventRepository.getReferenceById(eventId)).willReturn(event);
            given(eventRepository.save(any(Event.class))).willReturn(event);
            given(eventMapper.toDTO(any(Event.class))).willReturn(EventResponseDTO.builder().build());

            // when
            var result = eventService.updateEvent(eventId, updateRequest);

            // then
            assertNotNull(result);
            then(eventMapper).should().updateEntityFromDTO(updateRequest, event);
            then(eventRepository).should().save(event);
        }

        @Test
        void givenEventNotFound_whenUpdateEvent_thenThrowEntityNotFoundException() {
            // given
            UUID eventId = UUID.randomUUID();
            given(eventRepository.existsById(eventId)).willReturn(false);

            // when & then
            assertThrows(EntityNotFoundException.class,
                    () -> eventService.updateEvent(eventId, EventUpdateRequestDTO.builder().build()));
        }

        @Test
        void givenEventNotUpcoming_whenUpdateEvent_thenThrowEntityCouldNotBeEdited() {
            // given
            Event event = Event.builder().status(EventStatusEnum.ACTIVE).build();
            UUID eventId = event.getId();

            given(eventRepository.existsById(eventId)).willReturn(true);
            given(eventRepository.getReferenceById(eventId)).willReturn(event);

            // when & then
            assertThrows(EntityCouldNotBeEdited.class,
                    () -> eventService.updateEvent(eventId, EventUpdateRequestDTO.builder().build()));
        }
    }

    @Nested
    class DeleteEvent {

        @Test
        void givenEventExists_whenDeleteEvent_thenDeleteSuccessfully() {
            // given
            UUID eventId = UUID.randomUUID();
            given(eventRepository.existsById(eventId)).willReturn(true);

            // when
            eventService.deleteEvent(eventId);

            // then
            then(eventRepository).should().deleteById(eventId);
        }

        @Test
        void givenEventNotFound_whenDeleteEvent_thenThrowEntityNotFoundException() {
            // given
            UUID eventId = UUID.randomUUID();
            given(eventRepository.existsById(eventId)).willReturn(false);

            // when & then
            assertThrows(EntityNotFoundException.class, () -> eventService.deleteEvent(eventId));
        }

        @Test
        void givenEventInUse_whenDeleteEvent_thenThrowEntityCouldNotBeDeleted() {
            // given
            UUID eventId = UUID.randomUUID();
            given(eventRepository.existsById(eventId)).willReturn(true);
            willThrow(new DataIntegrityViolationException("Constraint violation")).given(eventRepository)
                    .deleteById(eventId);

            GameSession gameSession = mock(GameSession.class);
            given(gameSession.getId()).willReturn(UUID.randomUUID());
            given(gameSessionRepository.findByEventId(eventId)).willReturn(Optional.of(gameSession));

            // when & then
            assertThrows(EntityCouldNotBeDeleted.class, () -> eventService.deleteEvent(eventId));
        }
    }

    @Nested
    class UpdateEventStatus {

        @Test
        void givenUpcomingEvent_whenUpdateEventStatusToActive_thenSuccess() {
            // given
            String testEmail = "player@larplaner.com";
            Event event = spy(Event.builder().status(EventStatusEnum.UPCOMING).build());
            UUID eventId = event.getId();

            AssignedRole assignedRole = mock(AssignedRole.class);
            given(event.getAssignedRoles()).willReturn(List.of(assignedRole));
            given(event.getEmailsAssignedToEvent()).willReturn(Set.of(testEmail));

            given(eventRepository.findById(eventId)).willReturn(Optional.of(event));
            given(userLookupService.getUserIDsByEmails(Set.of(testEmail))).willReturn(Map.of(testEmail, "user-id-123"));
            given(eventRepository.save(any(Event.class))).willReturn(event);
            given(eventMapper.toDTO(any(Event.class))).willReturn(EventResponseDTO.builder().build());

            // when
            var result = eventService.updateEventStatus(eventId, EventStatusEnum.ACTIVE);

            // then
            assertNotNull(result);
            then(gameSessionService).should().createGameSession(event);
            then(event).should().setStatus(EventStatusEnum.ACTIVE);
            then(eventRepository).should().save(event);
        }

        @Test
        void givenActiveEvent_whenUpdateEventStatusToHistoric_thenSuccess() {
            // given
            Event event = spy(Event.builder().status(EventStatusEnum.ACTIVE).build());
            UUID eventId = event.getId();
            GameSession gameSession = mock(GameSession.class);

            given(event.getGameSession()).willReturn(gameSession);
            given(eventRepository.findById(eventId)).willReturn(Optional.of(event));
            given(eventRepository.save(any(Event.class))).willReturn(event);
            given(eventMapper.toDTO(any(Event.class))).willReturn(EventResponseDTO.builder().build());

            // when
            var result = eventService.updateEventStatus(eventId, EventStatusEnum.HISTORIC);

            // then
            assertNotNull(result);
            then(gameSession).should().setEndTime(any(ZonedDateTime.class));
            then(event).should().setStatus(EventStatusEnum.HISTORIC);
            then(eventRepository).should().save(event);
        }

        @Test
        void givenSameStatus_whenUpdateEventStatus_thenThrowEventStatusCouldNotBeChanged() {
            // given
            Event event = Event.builder().status(EventStatusEnum.UPCOMING).build();
            UUID eventId = event.getId();

            given(eventRepository.findById(eventId)).willReturn(Optional.of(event));

            // when & then
            assertThrows(EventStatusCouldNotBeChanged.class,
                    () -> eventService.updateEventStatus(eventId, EventStatusEnum.UPCOMING));
        }

        @Test
        void givenUpcomingEventMissingAssignedEmails_whenUpdateEventStatusToActive_thenThrowEventStatusCouldNotBeChanged() {
            // given
            Event event = spy(Event.builder().status(EventStatusEnum.UPCOMING).build());
            UUID eventId = event.getId();

            // Setup mismatch: 2 roles but only 1 assigned email
            given(event.getAssignedRoles()).willReturn(List.of(mock(AssignedRole.class), mock(AssignedRole.class)));
            given(event.getEmailsAssignedToEvent()).willReturn(Set.of("single.email@larplaner.com"));

            given(eventRepository.findById(eventId)).willReturn(Optional.of(event));

            // when & then
            assertThrows(EventStatusCouldNotBeChanged.class,
                    () -> eventService.updateEventStatus(eventId, EventStatusEnum.ACTIVE));
        }
    }

}