package com.larplaner.service.event;

import java.util.List;
import java.util.UUID;

import com.larplaner.dto.event.EventRequestDTO;
import com.larplaner.dto.event.EventResponseDTO;
import com.larplaner.dto.event.EventUpdateRequestDTO;

public interface EventService {

  List<EventResponseDTO> getAllEvents();

  EventResponseDTO getEventById(UUID id);

  EventResponseDTO createEvent(EventRequestDTO eventDTO);

  EventResponseDTO updateEvent(UUID id, EventUpdateRequestDTO eventDTO);

  void deleteEvent(UUID id);
}