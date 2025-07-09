package com.larplaner.api.role.controller;

import static com.larplaner.api.common.TestConstants.ROLE_ID_DETECTIVE;
import static com.larplaner.api.common.TestConstants.ROLE_ID_SUSPECT;
import static com.larplaner.api.common.TestConstants.ROLE_ID_WITNESS;
import static com.larplaner.api.common.TestConstants.TAG_ID_HAS_MOTIVE_X;
import static com.larplaner.api.common.TestConstants.TAG_ID_IS_DECEPTIVE;
import static com.larplaner.api.common.TestConstants.TAG_ID_KNOWS_SECRET_A;
import static com.larplaner.api.common.TestConstants.TAG_ID_ROLE_DETECTIVE;
import static com.larplaner.api.common.TestConstants.TAG_ID_ROLE_SUSPECT;
import static com.larplaner.api.common.TestConstants.TAG_ID_ROLE_WITNESS;
import static com.larplaner.api.common.TestConstants.TAG_ID_SKILL_DEDUCTION;
import static com.larplaner.api.common.TestConstants.TAG_ID_SKILL_OBSERVATION;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.larplaner.service.role.RoleService;
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
import com.larplaner.dto.role.RoleRequestDTO;
import com.larplaner.dto.role.RoleResponseDTO;
import com.larplaner.dto.tag.TagResponseDTO;

@WebMvcTest(RoleControllerImpl.class) // Assuming RoleControllerImpl is your controller
public class RoleControllerTest extends BaseTestClass {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RoleService roleService;

    @Autowired
    private ObjectMapper objectMapper;

    // ... (existing tests like getAllRoles, getRoleById, updateRole, deleteRole)

    @Test
    @DisplayName("POST /api/roles should create Lead Detective role")
    void createRole_LeadDetective_shouldReturnCreatedRole() throws Exception {
        // Arrange (Request)
        RoleRequestDTO requestDTO = RoleRequestDTO.builder()
                .name("Lead Detective")
                .description("The primary investigator trying to solve the mystery. Observant and logical.")
                .tags(List.of(TAG_ID_ROLE_DETECTIVE, TAG_ID_SKILL_OBSERVATION, TAG_ID_SKILL_DEDUCTION))
                .build();

        // Arrange (Response)
        RoleResponseDTO responseDTO = RoleResponseDTO.builder()
                .id(ROLE_ID_DETECTIVE)
                .name("Lead Detective")
                .description("The primary investigator trying to solve the mystery. Observant and logical.")
                .tags(List.of(
                        TagResponseDTO.builder().id(TAG_ID_ROLE_DETECTIVE).value("Role_Detective").build(),
                        TagResponseDTO.builder().id(TAG_ID_SKILL_OBSERVATION).value("Skill_Observation")
                                .build(),
                        TagResponseDTO.builder().id(TAG_ID_SKILL_DEDUCTION).value("Skill_Deduction").build()))
                .build();
        when(roleService.createRole(any(RoleRequestDTO.class))).thenReturn(responseDTO);

        // Act & Assert
        mockMvc.perform(post("/api/roles")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(ROLE_ID_DETECTIVE.toString()))
                .andExpect(jsonPath("$.name").value("Lead Detective"))
                .andExpect(jsonPath("$.tags.length()").value(3))
                .andExpect(jsonPath("$.tags[0].value").value("Role_Detective"));

        verify(roleService, times(1)).createRole(any(RoleRequestDTO.class));
    }

    @Test
    @DisplayName("POST /api/roles should create Nervous Witness role")
    void createRole_NervousWitness_shouldReturnCreatedRole() throws Exception {
        // Arrange (Request)
        RoleRequestDTO requestDTO = RoleRequestDTO.builder()
                .name("Nervous Witness")
                .description("Saw something crucial but is hesitant to share. Knows a secret.")
                .tags(List.of(TAG_ID_ROLE_WITNESS, TAG_ID_KNOWS_SECRET_A))
                .build();

        // Arrange (Response)
        RoleResponseDTO responseDTO = RoleResponseDTO.builder()
                .id(ROLE_ID_WITNESS)
                .name("Nervous Witness")
                .description("Saw something crucial but is hesitant to share. Knows a secret.")
                .tags(List.of(
                        TagResponseDTO.builder().id(TAG_ID_ROLE_WITNESS).value("Role_Witness").build(),
                        TagResponseDTO.builder().id(TAG_ID_KNOWS_SECRET_A).value("Knows_Secret_A")
                                .isUnique(true)
                                .expiresAfterMinutes(120).build()))
                .build();
        when(roleService.createRole(any(RoleRequestDTO.class))).thenReturn(responseDTO);

        // Act & Assert
        mockMvc.perform(post("/api/roles")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(ROLE_ID_WITNESS.toString()))
                .andExpect(jsonPath("$.name").value("Nervous Witness"))
                .andExpect(jsonPath("$.tags.length()").value(2))
                .andExpect(jsonPath("$.tags[1].value").value("Knows_Secret_A"))
                .andExpect(jsonPath("$.tags[1].isUnique").value(true));

        verify(roleService, times(1)).createRole(any(RoleRequestDTO.class));
    }

    @Test
    @DisplayName("POST /api/roles should create Main Suspect role")
    void createRole_MainSuspect_shouldReturnCreatedRole() throws Exception {
        // Arrange (Request)
        RoleRequestDTO requestDTO = RoleRequestDTO.builder()
                .name("Main Suspect")
                .description("Has a motive and opportunity, but claims innocence. Deceptive.")
                .tags(List.of(TAG_ID_ROLE_SUSPECT, TAG_ID_IS_DECEPTIVE, TAG_ID_HAS_MOTIVE_X))
                .build();

        // Arrange (Response)
        RoleResponseDTO responseDTO = RoleResponseDTO.builder()
                .id(ROLE_ID_SUSPECT)
                .name("Main Suspect")
                .description("Has a motive and opportunity, but claims innocence. Deceptive.")
                .tags(List.of(
                        TagResponseDTO.builder().id(TAG_ID_ROLE_SUSPECT).value("Role_Suspect").build(),
                        TagResponseDTO.builder().id(TAG_ID_IS_DECEPTIVE).value("Is_Deceptive").build(),
                        TagResponseDTO.builder().id(TAG_ID_HAS_MOTIVE_X).value("Has_Motive_X").isUnique(true)
                                .build()))
                .build();
        when(roleService.createRole(any(RoleRequestDTO.class))).thenReturn(responseDTO);

        // Act & Assert
        mockMvc.perform(post("/api/roles")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(ROLE_ID_SUSPECT.toString()))
                .andExpect(jsonPath("$.name").value("Main Suspect"))
                .andExpect(jsonPath("$.tags.length()").value(3))
                .andExpect(jsonPath("$.tags[2].value").value("Has_Motive_X"));

        verify(roleService, times(1)).createRole(any(RoleRequestDTO.class));
    }
}