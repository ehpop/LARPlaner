package com.larplaner.api.tag.controller;

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
import com.larplaner.dto.tag.TagRequestDTO;
import com.larplaner.dto.tag.TagResponseDTO;
import com.larplaner.dto.tag.UpdateTagRequestDTO;
import com.larplaner.service.tag.TagService;
import jakarta.persistence.EntityNotFoundException;
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

@WebMvcTest(TagControllerImpl.class)
@AutoConfigureMockMvc(addFilters = false)
class TagControllerIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @MockBean
  private TagService tagService;

  private TagResponseDTO sampleTagDTO;
  private UUID sampleTagId;

  @BeforeEach
  void setUp() {
    sampleTagId = UUID.randomUUID();
    sampleTagDTO = TagResponseDTO.builder()
        .id(sampleTagId)
        .value("Warrior")
        .isUnique(false)
        .expiresAfterMinutes(0)
        .build();
  }

  @Nested
  @DisplayName("GET /api/tags")
  class GetAllTags {

    @Test
    @DisplayName("Should return 200 and list of tags")
    void givenTagsExist_whenGetAllTags_thenReturns200WithList() throws Exception {
      // given
      given(tagService.getAllTags(any())).willReturn(List.of(sampleTagDTO));

      // when & then
      mockMvc.perform(get("/api/tags"))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$", hasSize(1)))
          .andExpect(jsonPath("$[0].value", is("Warrior")));
    }

    @Test
    @DisplayName("Should return 200 and pass search term to service")
    void givenSearchTerm_whenGetAllTags_thenReturns200WithFilteredResults() throws Exception {
      // given
      given(tagService.getAllTags("War")).willReturn(List.of(sampleTagDTO));

      // when & then
      mockMvc.perform(get("/api/tags").param("search", "War"))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$", hasSize(1)))
          .andExpect(jsonPath("$[0].value", is("Warrior")));
    }
  }

  @Nested
  @DisplayName("GET /api/tags/{id}")
  class GetTagById {

    @Test
    @DisplayName("Should return 200 and tag when it exists")
    void givenExistingId_whenGetTagById_thenReturns200() throws Exception {
      // given
      given(tagService.getTagById(sampleTagId)).willReturn(sampleTagDTO);

      // when & then
      mockMvc.perform(get("/api/tags/{id}", sampleTagId))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.value", is("Warrior")))
          .andExpect(jsonPath("$.id", is(sampleTagId.toString())));
    }

    @Test
    @DisplayName("Should return 404 when tag does not exist")
    void givenNonExistentId_whenGetTagById_thenReturns404() throws Exception {
      // given
      UUID nonExistentId = UUID.randomUUID();
      given(tagService.getTagById(nonExistentId))
          .willThrow(new EntityNotFoundException("Tag not found with id: " + nonExistentId));

      // when & then
      mockMvc.perform(get("/api/tags/{id}", nonExistentId))
          .andExpect(status().isNotFound());
    }
  }

  @Nested
  @DisplayName("POST /api/tags")
  class CreateTags {

    @Test
    @DisplayName("Should return 201 when tags are created successfully")
    void givenValidRequest_whenCreateTags_thenReturns201() throws Exception {
      // given
      TagRequestDTO requestDTO = TagRequestDTO.builder()
          .value("NewTag")
          .isUnique(false)
          .expiresAfterMinutes(0)
          .build();

      given(tagService.createTags(any())).willReturn(List.of(sampleTagDTO));

      // when & then
      mockMvc.perform(post("/api/tags")
              .contentType(MediaType.APPLICATION_JSON)
              .content(objectMapper.writeValueAsString(List.of(requestDTO))))
          .andExpect(status().isCreated())
          .andExpect(jsonPath("$", hasSize(1)))
          .andExpect(jsonPath("$[0].value", is("Warrior")));
    }

    @Test
    @DisplayName("Should return 400 when validation fails (blank value)")
    void givenBlankValue_whenCreateTags_thenReturns400() throws Exception {
      // given
      TagRequestDTO invalidDTO = TagRequestDTO.builder()
          .value("")
          .build();

      // when & then
      mockMvc.perform(post("/api/tags")
              .contentType(MediaType.APPLICATION_JSON)
              .content(objectMapper.writeValueAsString(List.of(invalidDTO))))
          .andExpect(status().isBadRequest());
    }
  }

  @Nested
  @DisplayName("PUT /api/tags/{id}")
  class UpdateTag {

    @Test
    @DisplayName("Should return 200 when tag is updated successfully")
    void givenValidRequest_whenUpdateTag_thenReturns200() throws Exception {
      // given
      UpdateTagRequestDTO updateDTO = new UpdateTagRequestDTO("UpdatedTag", true, 30);
      TagResponseDTO updatedDTO = TagResponseDTO.builder()
          .id(sampleTagId)
          .value("UpdatedTag")
          .isUnique(true)
          .expiresAfterMinutes(30)
          .build();

      given(tagService.updateTag(eq(sampleTagId), any(UpdateTagRequestDTO.class)))
          .willReturn(updatedDTO);

      // when & then
      mockMvc.perform(put("/api/tags/{id}", sampleTagId)
              .contentType(MediaType.APPLICATION_JSON)
              .content(objectMapper.writeValueAsString(updateDTO)))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.value", is("UpdatedTag")))
          .andExpect(jsonPath("$.isUnique", is(true)));
    }
  }

  @Nested
  @DisplayName("DELETE /api/tags/{id}")
  class DeleteTag {

    @Test
    @DisplayName("Should return 204 when tag is deleted successfully")
    void givenExistingId_whenDeleteTag_thenReturns204() throws Exception {
      // given
      willDoNothing().given(tagService).deleteTag(sampleTagId);

      // when & then
      mockMvc.perform(delete("/api/tags/{id}", sampleTagId))
          .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("Should return 404 when tag to delete does not exist")
    void givenNonExistentId_whenDeleteTag_thenReturns404() throws Exception {
      // given
      UUID nonExistentId = UUID.randomUUID();
      willThrow(new EntityNotFoundException("Tag not found"))
          .given(tagService).deleteTag(nonExistentId);

      // when & then
      mockMvc.perform(delete("/api/tags/{id}", nonExistentId))
          .andExpect(status().isNotFound());
    }
  }
}
