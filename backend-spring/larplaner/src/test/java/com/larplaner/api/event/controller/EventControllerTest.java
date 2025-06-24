package com.larplaner.api.event.controller;

import static com.larplaner.api.common.TestConstants.ASSIGNED_ROLE_ID_1;
import static com.larplaner.api.common.TestConstants.ASSIGNED_ROLE_ID_2;
import static com.larplaner.api.common.TestConstants.ASSIGNED_ROLE_ID_3;
import static com.larplaner.api.common.TestConstants.EVENT_ID_MYSTERY_NIGHT;
import static com.larplaner.api.common.TestConstants.SCENARIO_ID_MIDNIGHT_MYSTERY;
import static com.larplaner.api.common.TestConstants.SCENARIO_ROLE_ID_DETECTIVE_LINK;
import static com.larplaner.api.common.TestConstants.SCENARIO_ROLE_ID_SUSPECT_LINK;
import static com.larplaner.api.common.TestConstants.SCENARIO_ROLE_ID_WITNESS_LINK;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.ZonedDateTime;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.larplaner.api.common.BaseTestClass;
import com.larplaner.dto.event.EventRequestDTO;
import com.larplaner.dto.event.EventResponseDTO;
import com.larplaner.dto.event.assignedRole.AssignedRoleRequestDTO;
import com.larplaner.dto.event.assignedRole.AssignedRoleResponseDTO;
import com.larplaner.service.event.EventService;

@WebMvcTest(EventControllerImpl.class)
public class EventControllerTest extends BaseTestClass {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EventService eventService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /api/events should create 'Mystery Night at the Mansion' event")
    void createEvent_MysteryNight_shouldReturnCreatedEvent() throws Exception {
        String eventDateStr = "2024-09-15T18:00:00Z";
        // Arrange (Request DTO)
        EventRequestDTO requestDTO = EventRequestDTO.builder()
                .name("Mystery Night at the Mansion")
                .description("Join us for an immersive experience solving 'The Midnight Mansion Mystery'.")
                .img("http://example.com/images/mansion_event.png")
                .date(ZonedDateTime.parse(eventDateStr))
                .scenarioId(SCENARIO_ID_MIDNIGHT_MYSTERY)
                .assignedRoles(List.of(
                        AssignedRoleRequestDTO.builder()
                                .scenarioRoleId(SCENARIO_ROLE_ID_DETECTIVE_LINK)
                                .assignedEmail("player.detective@example.com")
                                .build(),
                        AssignedRoleRequestDTO.builder()
                                .scenarioRoleId(SCENARIO_ROLE_ID_WITNESS_LINK)
                                .assignedEmail("player.witness@example.com")
                                .build(),
                        AssignedRoleRequestDTO.builder()
                                .scenarioRoleId(SCENARIO_ROLE_ID_SUSPECT_LINK)
                                .assignedEmail("player.suspect@example.com")
                                .build()))
                .build();

        // Arrange (Response DTO)
        EventResponseDTO responseDTO = EventResponseDTO.builder()
                .id(EVENT_ID_MYSTERY_NIGHT)
                .name("Mystery Night at the Mansion")
                .description("Join us for an immersive experience solving 'The Midnight Mansion Mystery'.")
                .img("http://example.com/images/mansion_event.png")
                .date(ZonedDateTime.parse(eventDateStr))
                .scenarioId(SCENARIO_ID_MIDNIGHT_MYSTERY)
                .assignedRoles(List.of(
                        AssignedRoleResponseDTO.builder()
                                .id(ASSIGNED_ROLE_ID_1)
                                .scenarioRoleId(SCENARIO_ROLE_ID_DETECTIVE_LINK)
                                .assignedEmail("player.detective@example.com")
                                .eventId(EVENT_ID_MYSTERY_NIGHT)
                                .build(),
                        AssignedRoleResponseDTO.builder()
                                .id(ASSIGNED_ROLE_ID_2)
                                .scenarioRoleId(SCENARIO_ROLE_ID_WITNESS_LINK)
                                .assignedEmail("player.witness@example.com")
                                .eventId(EVENT_ID_MYSTERY_NIGHT)
                                .build(),
                        AssignedRoleResponseDTO.builder()
                                .id(ASSIGNED_ROLE_ID_3)
                                .scenarioRoleId(SCENARIO_ROLE_ID_SUSPECT_LINK)
                                .assignedEmail("player.suspect@example.com")
                                .eventId(EVENT_ID_MYSTERY_NIGHT)
                                .build()))
                .build();
        when(eventService.createEvent(any(EventRequestDTO.class))).thenReturn(responseDTO);

        // Act & Assert
        mockMvc.perform(post("/api/events")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(EVENT_ID_MYSTERY_NIGHT.toString()))
                .andExpect(jsonPath("$.name").value("Mystery Night at the Mansion"))
                .andExpect(jsonPath("$.scenario").value(SCENARIO_ID_MIDNIGHT_MYSTERY.toString()))
                .andExpect(jsonPath("$.assignedRoleList.length()").value(3))
                .andExpect(
                        jsonPath("$.assignedRoleList[0].assignedEmail")
                                .value("player.detective@example.com"))
                .andExpect(jsonPath("$.assignedRoleList[0].scenarioRoleId").value(
                        SCENARIO_ROLE_ID_DETECTIVE_LINK.toString()));

        verify(eventService, times(1)).createEvent(any(EventRequestDTO.class));
    }
}