package com.larplaner.api.event;

import com.larplaner.dto.event.EventRequestDTO;
import com.larplaner.dto.event.EventResponseDTO;
import com.larplaner.dto.event.EventUpdateRequestDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Event", description = "Event management APIs")
public interface EventController {

  @Operation(summary = "Get all events")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Successfully retrieved all events")
  })
  @GetMapping
  ResponseEntity<List<EventResponseDTO>> getAllEvents();

  @Operation(summary = "Get event by ID")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Successfully retrieved event"),
      @ApiResponse(responseCode = "404", description = "Event not found")
  })
  @GetMapping("/{id}")
  ResponseEntity<EventResponseDTO> getEventById(
      @Parameter(description = "ID of the event to retrieve") @PathVariable UUID id);

  @Operation(summary = "Create a new event")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "Event created successfully"),
      @ApiResponse(responseCode = "400", description = "Invalid input")
  })
  @PostMapping
  ResponseEntity<EventResponseDTO> createEvent(
      @Parameter(description = "Event to create") @Valid @RequestBody EventRequestDTO eventDTO);

  @Operation(summary = "Update an existing event")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Event updated successfully"),
      @ApiResponse(responseCode = "404", description = "Event not found"),
      @ApiResponse(responseCode = "400", description = "Invalid input")
  })
  @PutMapping("/{id}")
  ResponseEntity<EventResponseDTO> updateEvent(
      @Parameter(description = "ID of the event to update") @PathVariable UUID id,
      @Parameter(description = "Updated event data") @Valid @RequestBody EventUpdateRequestDTO eventDTO);

  @Operation(summary = "Delete an event")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "Event deleted successfully"),
      @ApiResponse(responseCode = "404", description = "Event not found")
  })
  @DeleteMapping("/{id}")
  ResponseEntity<Void> deleteEvent(
      @Parameter(description = "ID of the event to delete") @PathVariable UUID id);
}