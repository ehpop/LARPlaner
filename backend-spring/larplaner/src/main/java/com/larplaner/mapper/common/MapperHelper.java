package com.larplaner.mapper.common;

import com.larplaner.dto.tag.TagResponseDTO;
import com.larplaner.mapper.tag.TagMapper;
import com.larplaner.model.tag.Tag;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class MapperHelper {

  /**
   * Maps a list of Tag entities to a list of TagResponseDTOs using the provided TagMapper. Returns
   * an empty list if the input list is null or empty.
   *
   * @param tags      The list of Tag entities to map.
   * @param tagMapper The TagMapper instance to use for mapping individual tags.
   * @return A list of TagResponseDTOs.
   */
  public static List<TagResponseDTO> mapTagsToDTOs(List<Tag> tags, TagMapper tagMapper) {
    if (tags == null || tags.isEmpty()) {
      return Collections.emptyList();
    }

    return tags.stream()
        .map(tagMapper::toDTO)
        .collect(Collectors.toList());
  }
}