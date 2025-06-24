package com.larplaner.service.tag;

import java.util.List;
import java.util.UUID;

import com.larplaner.dto.tag.TagRequestDTO;
import com.larplaner.dto.tag.TagResponseDTO;
import com.larplaner.dto.tag.UpdateTagRequestDTO;

public interface TagService {

  List<TagResponseDTO> getAllTags();

  List<TagResponseDTO> getAllTags(String searchTerm);

  TagResponseDTO getTagById(UUID id);

  List<TagResponseDTO> createTags(List<TagRequestDTO> tagRequestDTOList);

  TagResponseDTO updateTag(UUID id, UpdateTagRequestDTO updateTagRequestDTO);

  void deleteTag(UUID id);
}