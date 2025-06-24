package com.larplaner.api.tag.controller;

import com.larplaner.api.tag.TagController;
import com.larplaner.dto.tag.TagRequestDTO;
import com.larplaner.dto.tag.TagResponseDTO;
import com.larplaner.dto.tag.UpdateTagRequestDTO;
import com.larplaner.service.tag.TagService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagControllerImpl implements TagController {

  private final TagService tagService;

  @Override
  public ResponseEntity<List<TagResponseDTO>> getAllTags(String searchTerm) {
    return ResponseEntity.ok(tagService.getAllTags(searchTerm));
  }

  @Override
  public ResponseEntity<TagResponseDTO> getTagById(UUID id) {
    TagResponseDTO tag = tagService.getTagById(id);
    return tag != null
        ? ResponseEntity.ok(tag)
        : ResponseEntity.notFound().build();
  }

  @Override
  public ResponseEntity<List<TagResponseDTO>> createTags(List<TagRequestDTO> tagRequestDTOList) {
    List<TagResponseDTO> createdTags = tagService.createTags(tagRequestDTOList);
    return ResponseEntity.status(HttpStatus.CREATED).body(createdTags);
  }

  @Override
  public ResponseEntity<TagResponseDTO> updateTag(UUID id,
      UpdateTagRequestDTO updateTagRequestDTO) {
    TagResponseDTO updatedTag = tagService.updateTag(id, updateTagRequestDTO);
    return updatedTag != null
        ? ResponseEntity.ok(updatedTag)
        : ResponseEntity.notFound().build();
  }

  @Override
  public ResponseEntity<Void> deleteTag(UUID id) {
    tagService.deleteTag(id);
    return ResponseEntity.noContent().build();
  }
}