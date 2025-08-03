package com.larplaner.mapper.common;

import com.larplaner.dto.tag.TagResponseDTO;
import com.larplaner.mapper.tag.TagMapper;
import com.larplaner.model.BaseEntity;
import com.larplaner.model.tag.Tag;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class MapperHelper {

  /**
   * Maps a userEvents of Tag entities to a userEvents of TagResponseDTOs using the provided
   * TagMapper. Returns an empty userEvents if the input userEvents is null or empty.
   *
   * @param tags      The userEvents of Tag entities to map.
   * @param tagMapper The TagMapper instance to use for mapping individual tags.
   * @return A userEvents of TagResponseDTOs.
   */
  public static List<TagResponseDTO> mapTagsToDTOs(List<Tag> tags, TagMapper tagMapper) {
    if (tags == null || tags.isEmpty()) {
      return Collections.emptyList();
    }

    return tags.stream()
        .map(tagMapper::toDTO)
        .collect(Collectors.toList());
  }

  public static UUID getIdSafe(BaseEntity entity) {
    try {
      return entity.getId();
    } catch (NullPointerException e) {
      return null;
    }
  }
}
