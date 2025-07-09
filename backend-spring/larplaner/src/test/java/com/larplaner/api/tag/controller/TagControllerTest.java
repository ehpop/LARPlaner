package com.larplaner.api.tag.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.larplaner.service.tag.TagService;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.larplaner.api.common.BaseTestClass;
import com.larplaner.dto.tag.TagRequestDTO;
import com.larplaner.dto.tag.TagResponseDTO;
import com.larplaner.dto.tag.UpdateTagRequestDTO;

import jakarta.persistence.EntityNotFoundException;

@WebMvcTest(TagControllerImpl.class)
class TagControllerTest extends BaseTestClass {

  private final MockMvc mockMvc;
  private final TagService tagService;
  private final ObjectMapper objectMapper;

  private TagResponseDTO tag1Response;
  private TagResponseDTO tag2Response;

  // Constructor injection for MockMvc, mocked TagService, and ObjectMapper
  TagControllerTest(
      @Autowired MockMvc mockMvc,
      @Autowired TagService tagService, // Provided & mocked by @WebMvcTest
      @Autowired ObjectMapper objectMapper) {
    this.mockMvc = mockMvc;
    this.tagService = tagService;
    this.objectMapper = objectMapper;
  }

  @BeforeEach
  void setUp() {
    tag1Response = TagResponseDTO.builder()
        .id(UUID.fromString("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"))
        .value("Urgent")
        .isUnique(true)
        .expiresAfterMinutes(60)
        .build();

    tag2Response = TagResponseDTO.builder()
        .id(UUID.fromString("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"))
        .value("LowPriority")
        .isUnique(false)
        .expiresAfterMinutes(30)
        .build();
  }

  @Test
  void getAllTags_shouldReturnListOfTags() throws Exception {
    List<TagResponseDTO> tags = Arrays.asList(tag1Response, tag2Response);
    given(tagService.getAllTags()).willReturn(tags);

    mockMvc.perform(get("/api/tags")
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(2)))
        .andExpect(jsonPath("$[0].value", is("Urgent")))
        .andExpect(jsonPath("$[1].value", is("LowPriority")));

    verify(tagService).getAllTags();
  }

  @Test
  void getTagById_whenTagExists_shouldReturnTag() throws Exception {
    given(tagService.getTagById(UUID.fromString("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"))).willReturn(tag1Response);

    mockMvc.perform(get("/api/tags/{id}", "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", is("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")))
        .andExpect(jsonPath("$.value", is("Urgent")));

    verify(tagService).getTagById(UUID.fromString("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"));
  }

  @Test
  void getTagById_whenTagDoesNotExist_shouldReturnNotFound() throws Exception {
    given(tagService.getTagById(UUID.fromString("cccccccc-cccc-cccc-cccc-cccccccccccc")))
        .willThrow(new EntityNotFoundException("Tag not found"));

    mockMvc.perform(get("/api/tags/{id}", "cccccccc-cccc-cccc-cccc-cccccccccccc")
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound());

    verify(tagService).getTagById(UUID.fromString("cccccccc-cccc-cccc-cccc-cccccccccccc"));
  }

  @Test
  void createTag_shouldReturnCreatedTag() throws Exception {
    TagRequestDTO createRequest = TagRequestDTO.builder().value("Urgent").isUnique(true)
        .expiresAfterMinutes(60).build();

    given(tagService.createTags(anyList())).willReturn(List.of(tag1Response));

    mockMvc.perform(post("/api/tags")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(List.of(createRequest))))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$[0].id", is("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")))
        .andExpect(jsonPath("$[0].value", is("Urgent")));

    verify(tagService).createTags(anyList());
  }

  @Test
  void updateTag_whenTagExists_shouldReturnUpdatedTag() throws Exception {
    UpdateTagRequestDTO updateRequest = new UpdateTagRequestDTO();
    updateRequest.setValue("Critical");
    updateRequest.setIsUnique(true);
    updateRequest.setExpiresAfterMinutes(30);

    TagResponseDTO updatedTagResponse = TagResponseDTO.builder()
        .id(UUID.fromString("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"))
        .value("Critical")
        .isUnique(true)
        .expiresAfterMinutes(30)
        .build();

    given(tagService.updateTag(eq(UUID.fromString("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")),
        any(UpdateTagRequestDTO.class))).willReturn(
            updatedTagResponse);

    mockMvc.perform(put("/api/tags/{id}", "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(updateRequest)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", is("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")))
        .andExpect(jsonPath("$.value", is("Critical")));

    verify(tagService).updateTag(eq(UUID.fromString("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")),
        any(UpdateTagRequestDTO.class));
  }

  @Test
  void updateTag_whenTagDoesNotExist_shouldReturnNotFound() throws Exception {
    UpdateTagRequestDTO updateRequest = new UpdateTagRequestDTO();
    updateRequest.setValue("NonExistentValue");
    updateRequest.setIsUnique(false);

    given(tagService.updateTag(eq(UUID.fromString("cccccccc-cccc-cccc-cccc-cccccccccccc")),
        any(UpdateTagRequestDTO.class)))
        .willThrow(new EntityNotFoundException("Tag not found"));

    mockMvc.perform(put("/api/tags/{id}", "cccccccc-cccc-cccc-cccc-cccccccccccc")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(updateRequest)))
        .andExpect(status().isNotFound());

    verify(tagService).updateTag(eq(UUID.fromString("cccccccc-cccc-cccc-cccc-cccccccccccc")),
        any(UpdateTagRequestDTO.class));
  }

  @Test
  void deleteTag_shouldReturnNoContent() throws Exception {
    doNothing().when(tagService).deleteTag(UUID.fromString("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"));

    mockMvc.perform(delete("/api/tags/{id}", "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNoContent());

    verify(tagService).deleteTag(UUID.fromString("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"));
  }
}