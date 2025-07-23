package com.larplaner.api.event.controller;

import com.larplaner.api.event.EventController;
import com.larplaner.dto.event.EventRequestDTO;
import com.larplaner.dto.event.EventResponseDTO;
import com.larplaner.dto.event.EventUpdateRequestDTO;
import com.larplaner.dto.event.statusUpdate.UpdateEventStatusRequestDTO;
import com.larplaner.service.event.EventService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/events")
public class EventControllerImpl implements EventController {

  private final EventService eventService;

  @Override
  public ResponseEntity<List<EventResponseDTO>> getAllEvents() {
    return ResponseEntity.ok(eventService.getAllEvents());
  }

  @Override
  @PreAuthorize("hasAuthority('ROLE_ADMIN') or @securityService.isUserAssignedToEvent(#id)")
  public ResponseEntity<EventResponseDTO> getEventById(UUID id) {
    EventResponseDTO event = eventService.getEventById(id);
    return event != null
        ? ResponseEntity.ok(event)
        : ResponseEntity.notFound().build();
  }

  @Override
  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<EventResponseDTO> createEvent(EventRequestDTO eventDTO) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(eventService.createEvent(eventDTO));
  }

  @Override
  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<EventResponseDTO> updateEvent(UUID id, EventUpdateRequestDTO eventDTO) {
    EventResponseDTO updatedEvent = eventService.updateEvent(id, eventDTO);
    return updatedEvent != null
        ? ResponseEntity.ok(updatedEvent)
        : ResponseEntity.notFound().build();
  }

  @Override
  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<Void> deleteEvent(UUID id) {
    eventService.deleteEvent(id);
    return ResponseEntity.noContent().build();
  }

  @Override
  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<EventResponseDTO> updateEventStatus(UUID id,
      UpdateEventStatusRequestDTO statusUpdateRequest) {
    EventResponseDTO updatedEvent = eventService.updateEventStatus(id,
        statusUpdateRequest.getStatus());

    return ResponseEntity.ok(updatedEvent);
  }
}