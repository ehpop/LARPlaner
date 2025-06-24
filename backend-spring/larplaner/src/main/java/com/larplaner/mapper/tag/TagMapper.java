package com.larplaner.mapper.tag;

import com.larplaner.dto.tag.TagRequestDTO;
import com.larplaner.dto.tag.TagResponseDTO;
import com.larplaner.dto.tag.UpdateTagRequestDTO;
import com.larplaner.model.tag.Tag;
import org.springframework.stereotype.Component;

@Component
public class TagMapper {

  public TagResponseDTO toDTO(Tag tag) {
    if (tag == null) {
      return null;
    }

    return TagResponseDTO.builder()
        .id(tag.getId())
        .value(tag.getValue())
        .isUnique(tag.getIsUnique())
        .expiresAfterMinutes(tag.getExpiresAfterMinutes())
        .build();
  }

  public Tag toEntity(TagResponseDTO dto) {
    if (dto == null) {
      return null;
    }

    return Tag.builder()
        .id(dto.getId())
        .value(dto.getValue())
        .isUnique(dto.getIsUnique())
        .expiresAfterMinutes(dto.getExpiresAfterMinutes())
        .build();
  }

  public Tag toEntity(TagRequestDTO createDto) {
    if (createDto == null) {
      return null;
    }

    return Tag.builder()
        .value(createDto.getValue())
        .isUnique(createDto.getIsUnique())
        .expiresAfterMinutes(createDto.getExpiresAfterMinutes())
        .build();
  }

  public void updateEntityFromDTO(UpdateTagRequestDTO updateDto, Tag existingTag) {
    if (updateDto == null || existingTag == null) {
      return;
    }
    if (updateDto.getValue() != null) {
      existingTag.setValue(updateDto.getValue());
    }
    if (updateDto.getIsUnique() != null) {
      existingTag.setIsUnique(updateDto.getIsUnique());
    }
    existingTag.setExpiresAfterMinutes(updateDto.getExpiresAfterMinutes());
  }
}