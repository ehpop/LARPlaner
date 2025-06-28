package com.larplaner.service.tag.helper;

import com.larplaner.mapper.tag.TagMapper;
import com.larplaner.model.tag.Tag;
import com.larplaner.repository.tag.TagRepository;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TagHelper {

  private final TagRepository tagRepository;

  public List<Tag> processTags(List<UUID> tagIds) {
    if (tagIds == null || tagIds.isEmpty()) {
      return Collections.emptyList();
    }

    return tagRepository.findAllById(tagIds);
  }
}