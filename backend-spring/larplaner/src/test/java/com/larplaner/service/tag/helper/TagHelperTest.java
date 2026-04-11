package com.larplaner.service.tag.helper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import com.larplaner.model.tag.Tag;
import com.larplaner.repository.tag.TagRepository;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TagHelperTest {

  @Mock
  private TagRepository tagRepository;

  @InjectMocks
  private TagHelper tagHelper;

  @Test
  @DisplayName("Should return tags from repository when valid tag IDs are provided")
  void givenValidTagIds_whenProcessTags_thenReturnsTagsFromRepository() {
    // given
    Tag tag1 = Tag.builder().value("Warrior").build();
    Tag tag2 = Tag.builder().value("Mage").build();
    List<UUID> tagIds = List.of(tag1.getId(), tag2.getId());

    given(tagRepository.findAllById(tagIds)).willReturn(List.of(tag1, tag2));

    // when
    List<Tag> result = tagHelper.processTags(tagIds);

    // then
    assertThat(result).isNotNull().hasSize(2);
    assertThat(result).containsExactly(tag1, tag2);
    verify(tagRepository, times(1)).findAllById(tagIds);
  }

  @Test
  @DisplayName("Should return empty list when tag IDs list is null")
  void givenNullTagIds_whenProcessTags_thenReturnsEmptyList() {
    // given
    List<UUID> tagIds = null;

    // when
    List<Tag> result = tagHelper.processTags(tagIds);

    // then
    assertThat(result).isNotNull().isEmpty();
    verify(tagRepository, never()).findAllById(Collections.emptyList());
  }

  @Test
  @DisplayName("Should return empty list when tag IDs list is empty")
  void givenEmptyTagIds_whenProcessTags_thenReturnsEmptyList() {
    // given
    List<UUID> tagIds = Collections.emptyList();

    // when
    List<Tag> result = tagHelper.processTags(tagIds);

    // then
    assertThat(result).isNotNull().isEmpty();
    verify(tagRepository, never()).findAllById(Collections.emptyList());
  }
}
