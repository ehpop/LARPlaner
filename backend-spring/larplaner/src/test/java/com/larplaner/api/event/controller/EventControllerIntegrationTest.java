package com.larplaner.api.event.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.mockito.BDDMockito.willThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.larplaner.dto.event.EventRequestDTO;
import com.larplaner.dto.event.EventResponseDTO;
import com.larplaner.dto.event.EventUpdateRequestDTO;
import com.larplaner.dto.event.statusUpdate.UpdateEventStatusRequestDTO;
import com.larplaner.model.event.EventStatusEnum;
import com.larplaner.service.event.EventService;
import jakarta.persistence.EntityNotFoundException;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(EventControllerImpl.class)
@AutoConfigureMockMvc(addFilters = false)
class EventControllerIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @MockBean
  private EventService eventService;

  private EventResponseDTO sampleEventDTO;
  private UUID sampleEventId;
  private UUID sampleScenarioId;

  @BeforeEach
  void setUp() {
    sampleEventId = UUID.randomUUID();
    sampleScenarioId = UUID.randomUUID();
    sampleEventDTO = EventResponseDTO.builder()
        .id(sampleEventId)
        .name("Test Event")
        .description("A LARP event")
        .status(EventStatusEnum.UPCOMING.toString())
        .date(ZonedDateTime.now().plusDays(7))
        .scenarioId(sampleScenarioId)
        .assignedRoles(Collections.emptyList())
        .build();
  }

  @Nested
  @DisplayName("GET /api/events")
  class GetAllEvents {

    @Test
    @DisplayName("Should return 200 and list of events")
    void givenEventsExist_whenGetAllEvents_thenReturns200() throws Exception {
      // given
      given(eventService.getAllEvents()).willReturn(List.of(sampleEventDTO));

      // when & then
      mockMvc.perform(get("/api/events"))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$", hasSize(1)))
          .andExpect(jsonPath("$[0].name", is("Test Event")));
    }
  }

  @Nested
  @DisplayName("GET /api/events/{id}")
  class GetEventById {

    @Test
    @DisplayName("Should return 200 when event exists")
    void givenExistingId_whenGetEventById_thenReturns200() throws Exception {
      // given
      given(eventService.getEventById(sampleEventId)).willReturn(sampleEventDTO);

      // when & then
      mockMvc.perform(get("/api/events/{id}", sampleEventId))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.name", is("Test Event")))
          .andExpect(jsonPath("$.status", is("upcoming")));
    }

    @Test
    @DisplayName("Should return 404 when event does not exist")
    void givenNonExistentId_whenGetEventById_thenReturns404() throws Exception {
      // given
      UUID nonExistentId = UUID.randomUUID();
      given(eventService.getEventById(nonExistentId)).willReturn(null);

      // when & then
      mockMvc.perform(get("/api/events/{id}", nonExistentId))
          .andExpect(status().isNotFound());
    }
  }

  @Nested
  @DisplayName("POST /api/events")
  class CreateEvent {

    @Test
    @DisplayName("Should return 201 when event is created successfully")
    void givenValidRequest_whenCreateEvent_thenReturns201() throws Exception {
      // given
      EventRequestDTO requestDTO = EventRequestDTO.builder()
          .name("New Event")
          .description("New event description")
          .date(ZonedDateTime.now().plusDays(14))
          .scenarioId(sampleScenarioId)
          .assignedRoles(Collections.emptyList())
          .build();

      given(eventService.createEvent(any(EventRequestDTO.class))).willReturn(sampleEventDTO);

      // when & then
      mockMvc.perform(post("/api/events")
              .contentType(MediaType.APPLICATION_JSON)
              .content(objectMapper.writeValueAsString(requestDTO)))
          .andExpect(status().isCreated())
          .andExpect(jsonPath("$.name", is("Test Event")));
    }

    @Test
    @DisplayName("Should return 400 when validation fails (blank name)")
    void givenBlankName_whenCreateEvent_thenReturns400() throws Exception {
      // given
      EventRequestDTO invalidDTO = EventRequestDTO.builder()
          .name("")
          .description("Description")
          .date(ZonedDateTime.now().plusDays(7))
          .scenarioId(sampleScenarioId)
          .build();

      // when & then
      mockMvc.perform(post("/api/events")
              .contentType(MediaType.APPLICATION_JSON)
              .content(objectMapper.writeValueAsString(invalidDTO)))
          .andExpect(status().isBadRequest());
    }
  }

  @Nested
  @DisplayName("PUT /api/events/{id}")
  class UpdateEvent {

    @Test
    @DisplayName("Should return 200 when event is updated successfully")
    void givenValidRequest_whenUpdateEvent_thenReturns200() throws Exception {
      // given
      EventUpdateRequestDTO updateDTO = EventUpdateRequestDTO.builder()
          .name("Updated Event")
          .description("Updated desc")
          .date(ZonedDateTime.now().plusDays(10))
          .scenarioId(sampleScenarioId)
          .build();

      EventResponseDTO updatedDTO = EventResponseDTO.builder()
          .id(sampleEventId)
          .name("Updated Event")
          .description("Updated desc")
          .status(EventStatusEnum.UPCOMING.toString())
          .build();

      given(eventService.updateEvent(eq(sampleEventId), any(EventUpdateRequestDTO.class)))
          .willReturn(updatedDTO);

      // when & then
      mockMvc.perform(put("/api/events/{id}", sampleEventId)
              .contentType(MediaType.APPLICATION_JSON)
              .content(objectMapper.writeValueAsString(updateDTO)))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.name", is("Updated Event")));
    }
  }

  @Nested
  @DisplayName("DELETE /api/events/{id}")
  class DeleteEvent {

    @Test
    @DisplayName("Should return 204 when event is deleted successfully")
    void givenExistingId_whenDeleteEvent_thenReturns204() throws Exception {
      // given
      willDoNothing().given(eventService).deleteEvent(sampleEventId);

      // when & then
      mockMvc.perform(delete("/api/events/{id}", sampleEventId))
          .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("Should return 404 when event to delete does not exist")
    void givenNonExistentId_whenDeleteEvent_thenReturns404() throws Exception {
      // given
      UUID nonExistentId = UUID.randomUUID();
      willThrow(new EntityNotFoundException("Event not found"))
          .given(eventService).deleteEvent(nonExistentId);

      // when & then
      mockMvc.perform(delete("/api/events/{id}", nonExistentId))
          .andExpect(status().isNotFound());
    }
  }

  @Nested
  @DisplayName("PUT /api/events/{id}/status")
  class UpdateEventStatus {

    @Test
    @DisplayName("Should return 200 when event status is updated successfully")
    void givenValidStatusUpdate_whenUpdateEventStatus_thenReturns200() throws Exception {
      // given
      UpdateEventStatusRequestDTO statusUpdateDTO = new UpdateEventStatusRequestDTO();
      statusUpdateDTO.setStatus(EventStatusEnum.ACTIVE);

      EventResponseDTO updatedDTO = EventResponseDTO.builder()
          .id(sampleEventId)
          .name("Test Event")
          .status(EventStatusEnum.ACTIVE.toString())
          .build();

      given(eventService.updateEventStatus(eq(sampleEventId), eq(EventStatusEnum.ACTIVE)))
          .willReturn(updatedDTO);

      // when & then
      mockMvc.perform(put("/api/events/{id}/status", sampleEventId)
              .contentType(MediaType.APPLICATION_JSON)
              .content(objectMapper.writeValueAsString(statusUpdateDTO)))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.status", is("active")));
    }
  }
}
