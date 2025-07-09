package com.larplaner.service.tag.impl;

import com.larplaner.dto.tag.TagRequestDTO;
import com.larplaner.dto.tag.TagResponseDTO;
import com.larplaner.dto.tag.UpdateTagRequestDTO;
import com.larplaner.exception.EntityCouldNotBeAdded;
import com.larplaner.mapper.tag.TagMapper;
import com.larplaner.model.tag.Tag;
import com.larplaner.repository.tag.TagRepository;
import com.larplaner.service.tag.TagService;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {

  private final TagRepository tagRepository;
  private final TagMapper tagMapper;

  @Override
  @Transactional(readOnly = true)
  public List<TagResponseDTO> getAllTags() {
    return getAllTags("");
  }

  @Override
  @Transactional(readOnly = true)
  public List<TagResponseDTO> getAllTags(String searchTerm) {
    List<Tag> tagList = StringUtils.hasText(searchTerm)
        ? tagRepository.findByValueContainingIgnoreCase(searchTerm)
        : tagRepository.findAll();

    return tagList.stream()
        .map(tagMapper::toDTO)
        .collect(Collectors.toList());
  }

  @Override
  public TagResponseDTO getTagById(UUID id) {
    return tagRepository.findById(id)
        .map(tagMapper::toDTO)
        .orElseThrow(() -> new EntityNotFoundException("Tag not found with id: " + id));
  }

  @Override
  public List<TagResponseDTO> createTags(List<TagRequestDTO> tagRequestDTOList) {
    var tags = tagRequestDTOList.stream().map(tagMapper::toEntity).toList();

    var existingTagsWithSameValues = tagRepository.findByValueInIgnoreCase(
        tags.stream().map(Tag::getValue).collect(Collectors.toSet()));

    if(!existingTagsWithSameValues.isEmpty()) {
      throw new EntityCouldNotBeAdded("Tags already exist with name(s): " +
          existingTagsWithSameValues.stream()
          .map(Tag::getValue)
          .collect(Collectors.joining(",")));
    }

    return tagRepository.saveAll(tags).stream().map(tagMapper::toDTO).toList();
  }

  @Override
  public TagResponseDTO updateTag(UUID id, UpdateTagRequestDTO updateTagRequestDTO) {
    Tag tag = tagRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Tag not found with id: " + id));
    tagMapper.updateEntityFromDTO(updateTagRequestDTO, tag);
    return tagMapper.toDTO(tagRepository.save(tag));
  }

  @Override
  public void deleteTag(UUID id) {
    if (!tagRepository.existsById(id)) {
      throw new EntityNotFoundException("Tag not found with id: " + id);
    }
    tagRepository.deleteById(id);
  }
}