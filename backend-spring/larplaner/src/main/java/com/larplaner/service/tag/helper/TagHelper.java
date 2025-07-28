package com.larplaner.service.tag.helper;

import com.larplaner.model.tag.Tag;
import com.larplaner.repository.tag.TagRepository;
import java.util.ArrayList;
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
      return new ArrayList<>();
    }

    return tagRepository.findAllById(tagIds);
  }
}