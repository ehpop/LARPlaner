package com.larplaner.service.event.impl;

import com.larplaner.dto.event.EventRequestDTO;
import com.larplaner.dto.event.EventResponseDTO;
import com.larplaner.dto.event.EventUpdateRequestDTO;
import com.larplaner.dto.event.assignedRole.AssignedRoleUpdateRequestDTO;
import com.larplaner.exception.EntityCouldNotBeAdded;
import com.larplaner.exception.EntityCouldNotBeDeleted;
import com.larplaner.exception.event.status.EventStatusCouldNotBeChanged;
import com.larplaner.mapper.event.AssignedRoleMapper;
import com.larplaner.mapper.event.EventMapper;
import com.larplaner.model.BaseEntity;
import com.larplaner.model.event.AssignedRole;
import com.larplaner.model.event.Event;
import com.larplaner.model.event.EventStatusEnum;
import com.larplaner.repository.event.EventRepository;
import com.larplaner.repository.game.GameSessionRepository;
import com.larplaner.service.event.EventService;
import com.larplaner.service.admin.firebase.UserLookupService;
import com.larplaner.service.game.impl.GameSessionServiceImpl;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventServiceImpl implements EventService {

  private final UserLookupService userLookupService;
  @PersistenceContext
  private EntityManager entityManager;

  private final EventRepository eventRepository;
  private final EventMapper eventMapper;
  private final AssignedRoleMapper assignedRoleMapper;
  private final GameSessionRepository gameSessionRepository;
  private final GameSessionServiceImpl gameSessionService;

  @Override
  public List<EventResponseDTO> getAllEvents() {
    return eventRepository.findAll().stream()
        .map(eventMapper::toDTO)
        .collect(Collectors.toList());
  }

  @Override
  public EventResponseDTO getEventById(UUID id) {
    return eventRepository.findById(id)
        .map(eventMapper::toDTO)
        .orElse(null);
  }

  @Override
  public EventResponseDTO createEvent(EventRequestDTO eventDTO) {
    Event event = eventMapper.toEntity(eventDTO);

    eventDTO.getAssignedRoles().forEach(
        assignedRoleRequestDTO -> event.addAssignedRoleToEvent(
            assignedRoleMapper.toEntity(assignedRoleRequestDTO)));

    return eventMapper.toDTO(eventRepository.save(event));
  }

  @Override
  public EventResponseDTO updateEvent(UUID id, EventUpdateRequestDTO eventDTO) {
    if (!eventRepository.existsById(id)) {
      throw new EntityNotFoundException("Event not found with id: " + id);
    }

    Event event = eventRepository.getReferenceById(id);
    eventMapper.updateEntityFromDTO(eventDTO, event);

    updateAssignedRoles(event, eventDTO);

    return eventMapper.toDTO(eventRepository.save(event));
  }

  @Override
  public void deleteEvent(UUID id) {
    if (!eventRepository.existsById(id)) {
      throw new EntityNotFoundException("Event not found with id: " + id);
    }

    try {
      eventRepository.deleteById(id);
    } catch (DataIntegrityViolationException e) {
      var game = gameSessionRepository.findByEventId(id).orElseThrow(EntityNotFoundException::new);
      throw new EntityCouldNotBeDeleted(
          "Event could not be deleted because it is referenced in game: " + game.getId());
    }
  }

  @Override
  public EventResponseDTO updateEventStatus(UUID id, EventStatusEnum newStatus) {
    var event = eventRepository.findById(id).orElseThrow(EntityNotFoundException::new);

    var transitionedEvent = transitionEventStatus(newStatus, event);

    return eventMapper.toDTO(transitionedEvent);
  }

  private Event transitionEventStatus(EventStatusEnum newStatus, Event event) {
    if (event.getStatus().equals(newStatus)) {
      throw new EventStatusCouldNotBeChanged(
          "Event Status is already: " + event.getStatus().name());
    }

    switch (event.getStatus()) {
      case HISTORIC -> {
        return updateEventStatusFromHistoric(event, newStatus);
      }
      case ACTIVE -> {
        return updateEventStatusFromActive(event, newStatus);
      }
      case UPCOMING -> {
        return updateEventStatusFromUpcoming(event, newStatus);
      }
      default -> throw new IllegalStateException(
          "There is no logic for changing EventStatus from : " + event.getStatus().name());
    }
  }

  private Event updateEventStatusFromHistoric(Event event, EventStatusEnum newStatus) {
    throw new EventStatusCouldNotBeChanged("Cannot change event status from historic");
  }

  private Event updateEventStatusFromActive(Event event, EventStatusEnum newStatus) {
    if (!EventStatusEnum.HISTORIC.equals(newStatus)) {
      throw new EventStatusCouldNotBeChanged(
          "Cannot change event status from active to " + newStatus.name().toLowerCase());
    }

    event.setStatus(EventStatusEnum.HISTORIC);

    //TODO: This is archiving game session for now, in the future more complex
    // operation might be required and this should be moved to game session service
    event.getGameSession().setEndTime(ZonedDateTime.now());

    return eventRepository.save(event);
  }

  private Event updateEventStatusFromUpcoming(Event event, EventStatusEnum newStatus) {
    if (!EventStatusEnum.ACTIVE.equals(newStatus)) {
      throw new EventStatusCouldNotBeChanged(
          "Cannot change event status from upcoming to " + newStatus.name().toLowerCase());
    }

    //TODO: ENABLE THIS CHECK
//    checkIfAllEmailsAreValidInEvent(event);

    gameSessionService.createGameSession(event);

    event.setStatus(EventStatusEnum.ACTIVE);
    return eventRepository.save(event);
  }

  private void checkIfAllEmailsAreValidInEvent(Event event) {
    Set<String> assignedEmails = event.getEmailsAssignedToEvent();
    if (assignedEmails.size() != event.getAssignedRoles().size()) {
      throw new EventStatusCouldNotBeChanged(
          "Please assign all email roles before you change status to active");
    }

    var userIDs = userLookupService.getUserIDsByEmails(assignedEmails);
    userIDs.keySet().forEach(email -> {
      if (userIDs.get(email).isEmpty()) {
        throw new EventStatusCouldNotBeChanged(String.format(
            "Email %s doesn't have existing account in app yet. "
                + "Please create account or assign email with existing account to this role.",
            email));
      }
    });
  }

  private void updateAssignedRoles(Event event, EventUpdateRequestDTO eventDTO) {
    if (eventDTO.getAssignedRoles() == null || event.getAssignedRoles().isEmpty()) {
      return;
    }

    checkForDuplicatesInRequest(eventDTO);

    Map<UUID, AssignedRole> currentRolesMap = event.getAssignedRoles().stream()
        .collect(Collectors.toMap(BaseEntity::getId, Function.identity()));

    Set<UUID> requestedIdsToModify = eventDTO.getAssignedRoles().stream()
        .map(AssignedRoleUpdateRequestDTO::getId)
        .collect(Collectors.toSet());

    event.getAssignedRoles()
        .removeIf(assignedRole -> !requestedIdsToModify.contains(assignedRole.getId()));

    eventDTO.getAssignedRoles().forEach(dto -> {
      AssignedRole existingRole = currentRolesMap.get(dto.getId());
      if (existingRole != null) {
        existingRole.setAssignedEmail(dto.getAssignedEmail());
      } else {
        event.addAssignedRoleToEvent(assignedRoleMapper.toEntity(dto));
      }
    });
  }

  //TODO: Might extract counting logic and check if any id/roleId/email is duplicate

  /**
   * It is okay for multiple emails to be empty/nulls
   *
   * @param eventDTO
   */
  private void checkForDuplicatesInRequest(EventUpdateRequestDTO eventDTO) {
    List<String> emailsInRequest = eventDTO.getAssignedRoles().stream()
        .map(AssignedRoleUpdateRequestDTO::getAssignedEmail)
        .filter(StringUtils::hasText)
        .toList();

    Map<String, Long> emailCounts = emailsInRequest.stream()
        .collect(Collectors.groupingBy(
            Function.identity(),
            Collectors.counting()
        ));

    List<String> duplicateEmails = emailCounts.entrySet().stream()
        .filter(entry -> entry.getValue() > 1)
        .map(Map.Entry::getKey)
        .toList();

    if (!duplicateEmails.isEmpty()) {
      log.info("duplicateEmails = {}", duplicateEmails);
      String duplicatesListString = String.join(", ", duplicateEmails);
      throw new EntityCouldNotBeAdded(
          "The following emails appeared more than once: " + duplicatesListString
      );
    }
  }
}