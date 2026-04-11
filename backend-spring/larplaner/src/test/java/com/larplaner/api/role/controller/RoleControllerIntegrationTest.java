package com.larplaner.api.role.controller;

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
import com.larplaner.dto.role.RoleDetailedResponseDTO;
import com.larplaner.dto.role.RoleRequestDTO;
import com.larplaner.dto.role.UpdateRoleRequestDTO;
import com.larplaner.service.role.RoleService;
import jakarta.persistence.EntityNotFoundException;
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

@WebMvcTest(RoleControllerImpl.class)
@AutoConfigureMockMvc(addFilters = false)
class RoleControllerIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @MockBean
  private RoleService roleService;

  private RoleDetailedResponseDTO sampleRoleDTO;
  private UUID sampleRoleId;

  @BeforeEach
  void setUp() {
    sampleRoleId = UUID.randomUUID();
    sampleRoleDTO = RoleDetailedResponseDTO.builder()
        .id(sampleRoleId)
        .name("ROLE_ADMIN")
        .description("Administrator role")
        .tags(Collections.emptyList())
        .build();
  }

  @Nested
  @DisplayName("GET /api/roles")
  class GetAllRoles {

    @Test
    @DisplayName("Should return 200 and list of roles")
    void givenRolesExist_whenGetAllRoles_thenReturns200WithList() throws Exception {
      // given
      given(roleService.getAllRoles()).willReturn(List.of(sampleRoleDTO));

      // when & then
      mockMvc.perform(get("/api/roles"))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$", hasSize(1)))
          .andExpect(jsonPath("$[0].name", is("ROLE_ADMIN")));
    }
  }

  @Nested
  @DisplayName("GET /api/roles/{id}")
  class GetRoleById {

    @Test
    @DisplayName("Should return 200 and role when it exists")
    void givenExistingId_whenGetRoleById_thenReturns200() throws Exception {
      // given
      given(roleService.getRoleById(sampleRoleId)).willReturn(sampleRoleDTO);

      // when & then
      mockMvc.perform(get("/api/roles/{id}", sampleRoleId))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.name", is("ROLE_ADMIN")))
          .andExpect(jsonPath("$.id", is(sampleRoleId.toString())));
    }

    @Test
    @DisplayName("Should return 404 when role does not exist")
    void givenNonExistentId_whenGetRoleById_thenReturns404() throws Exception {
      // given
      UUID nonExistentId = UUID.randomUUID();
      given(roleService.getRoleById(nonExistentId))
          .willThrow(new EntityNotFoundException("Role not found with id: " + nonExistentId));

      // when & then
      mockMvc.perform(get("/api/roles/{id}", nonExistentId))
          .andExpect(status().isNotFound());
    }
  }

  @Nested
  @DisplayName("POST /api/roles")
  class CreateRole {

    @Test
    @DisplayName("Should return 201 when role is created successfully")
    void givenValidRequest_whenCreateRole_thenReturns201() throws Exception {
      // given
      RoleRequestDTO requestDTO = RoleRequestDTO.builder()
          .name("ROLE_NEW")
          .description("A new role")
          .tags(Collections.emptyList())
          .build();

      given(roleService.createRole(any(RoleRequestDTO.class))).willReturn(sampleRoleDTO);

      // when & then
      mockMvc.perform(post("/api/roles")
              .contentType(MediaType.APPLICATION_JSON)
              .content(objectMapper.writeValueAsString(requestDTO)))
          .andExpect(status().isCreated())
          .andExpect(jsonPath("$.name", is("ROLE_ADMIN")));
    }

    @Test
    @DisplayName("Should return 400 when name is blank")
    void givenBlankName_whenCreateRole_thenReturns400() throws Exception {
      // given
      RoleRequestDTO invalidDTO = RoleRequestDTO.builder()
          .name("")
          .description("Description")
          .tags(Collections.emptyList())
          .build();

      // when & then
      mockMvc.perform(post("/api/roles")
              .contentType(MediaType.APPLICATION_JSON)
              .content(objectMapper.writeValueAsString(invalidDTO)))
          .andExpect(status().isBadRequest());
    }
  }

  @Nested
  @DisplayName("PUT /api/roles/{id}")
  class UpdateRole {

    @Test
    @DisplayName("Should return 200 when role is updated successfully")
    void givenValidRequest_whenUpdateRole_thenReturns200() throws Exception {
      // given
      UpdateRoleRequestDTO updateDTO = UpdateRoleRequestDTO.builder()
          .name("ROLE_UPDATED")
          .description("Updated description")
          .tags(Collections.emptyList())
          .build();

      RoleDetailedResponseDTO updatedDTO = RoleDetailedResponseDTO.builder()
          .id(sampleRoleId)
          .name("ROLE_UPDATED")
          .description("Updated description")
          .tags(Collections.emptyList())
          .build();

      given(roleService.updateRole(eq(sampleRoleId), any(UpdateRoleRequestDTO.class)))
          .willReturn(updatedDTO);

      // when & then
      mockMvc.perform(put("/api/roles/{id}", sampleRoleId)
              .contentType(MediaType.APPLICATION_JSON)
              .content(objectMapper.writeValueAsString(updateDTO)))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.name", is("ROLE_UPDATED")));
    }
  }

  @Nested
  @DisplayName("DELETE /api/roles/{id}")
  class DeleteRole {

    @Test
    @DisplayName("Should return 204 when role is deleted successfully")
    void givenExistingId_whenDeleteRole_thenReturns204() throws Exception {
      // given
      willDoNothing().given(roleService).deleteRole(sampleRoleId);

      // when & then
      mockMvc.perform(delete("/api/roles/{id}", sampleRoleId))
          .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("Should return 404 when role to delete does not exist")
    void givenNonExistentId_whenDeleteRole_thenReturns404() throws Exception {
      // given
      UUID nonExistentId = UUID.randomUUID();
      willThrow(new EntityNotFoundException("Role not found"))
          .given(roleService).deleteRole(nonExistentId);

      // when & then
      mockMvc.perform(delete("/api/roles/{id}", nonExistentId))
          .andExpect(status().isNotFound());
    }
  }
}
