package com.larplaner.mapper.action;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

import com.larplaner.dto.action.ActionRequestDTO;
import com.larplaner.dto.action.ActionResponseDTO;
import com.larplaner.dto.tag.TagResponseDTO;
import com.larplaner.mapper.tag.TagMapper;
import com.larplaner.model.action.Action;
import com.larplaner.model.tag.Tag;
import com.larplaner.service.tag.helper.TagHelper;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ActionMapperTest {

  @Mock
  private TagMapper tagMapper;
  @Mock
  private TagHelper tagHelper;

  @InjectMocks
  private ActionMapper actionMapper;

  @Nested
  @DisplayName("toDTO")
  class ToDTO {

    @Test
    @DisplayName("Should map Action entity to DTO with tag lists")
    void givenActionWithTags_whenToDTO_thenMapsAllFields() {
      // given
      Tag tag = Tag.builder().value("Fire").build();
      TagResponseDTO tagDTO = TagResponseDTO.builder()
          .id(tag.getId()).value("Fire").build();

      Action action = Action.builder()
          .name("Fireball")
          .description("Cast fireball")
          .messageOnSuccess("Hit!")
          .messageOnFailure("Miss!")
          .requiredTagsToDisplay(List.of(tag))
          .requiredTagsToSucceed(Collections.emptyList())
          .forbiddenTagsToDisplay(Collections.emptyList())
          .forbiddenTagsToSucceed(Collections.emptyList())
          .tagsToApplyOnSuccess(Collections.emptyList())
          .tagsToApplyOnFailure(Collections.emptyList())
          .tagsToRemoveOnSuccess(Collections.emptyList())
          .tagsToRemoveOnFailure(Collections.emptyList())
          .build();

      given(tagMapper.toDTO(tag)).willReturn(tagDTO);

      // when
      ActionResponseDTO result = actionMapper.toDTO(action);

      // then
      assertThat(result).isNotNull();
      assertThat(result.getName()).isEqualTo("Fireball");
      assertThat(result.getDescription()).isEqualTo("Cast fireball");
      assertThat(result.getMessageOnSuccess()).isEqualTo("Hit!");
      assertThat(result.getMessageOnFailure()).isEqualTo("Miss!");
      assertThat(result.getRequiredTagsToDisplay()).hasSize(1);
      assertThat(result.getRequiredTagsToDisplay().get(0).getValue()).isEqualTo("Fire");
    }

    @Test
    @DisplayName("Should return null when input is null")
    void givenNull_whenToDTO_thenReturnsNull() {
      assertThat(actionMapper.toDTO(null)).isNull();
    }
  }

  @Nested
  @DisplayName("toEntity")
  class ToEntity {

    @Test
    @DisplayName("Should map DTO to entity with tags resolved via TagHelper")
    void givenValidDTO_whenToEntity_thenDelegatesTagResolution() {
      // given
      Tag resolvedTag = Tag.builder().value("Warrior").build();
      UUID tagId = resolvedTag.getId();

      ActionRequestDTO dto = ActionRequestDTO.builder()
          .name("Strike")
          .description("Basic strike")
          .messageOnSuccess("You hit!")
          .messageOnFailure("You missed!")
          .requiredTagsToDisplay(List.of(tagId))
          .requiredTagsToSucceed(Collections.emptyList())
          .forbiddenTagsToDisplay(Collections.emptyList())
          .forbiddenTagsToSucceed(Collections.emptyList())
          .tagsToApplyOnSuccess(Collections.emptyList())
          .tagsToApplyOnFailure(Collections.emptyList())
          .tagsToRemoveOnSuccess(Collections.emptyList())
          .tagsToRemoveOnFailure(Collections.emptyList())
          .build();

      given(tagHelper.processTags(List.of(tagId))).willReturn(List.of(resolvedTag));
      given(tagHelper.processTags(Collections.emptyList())).willReturn(Collections.emptyList());

      // when
      Action result = actionMapper.toEntity(dto);

      // then
      assertThat(result).isNotNull();
      assertThat(result.getName()).isEqualTo("Strike");
      assertThat(result.getRequiredTagsToDisplay()).hasSize(1);
      assertThat(result.getRequiredTagsToDisplay().get(0).getValue()).isEqualTo("Warrior");
    }

    @Test
    @DisplayName("Should return null when input is null")
    void givenNull_whenToEntity_thenReturnsNull() {
      assertThat(actionMapper.toEntity(null)).isNull();
    }
  }

  @Nested
  @DisplayName("updateEntityFromDTO")
  class UpdateEntityFromDTO {

    @Test
    @DisplayName("Should update only non-null fields on entity")
    void givenPartialDTO_whenUpdate_thenUpdatesProvidedFields() {
      // given
      Action entity = Action.builder()
          .name("Old Name")
          .description("Old Desc")
          .messageOnSuccess("Old success")
          .messageOnFailure("Old failure")
          .build();

      ActionRequestDTO dto = ActionRequestDTO.builder()
          .name("New Name")
          .description(null)
          .messageOnSuccess("New success")
          .messageOnFailure(null)
          .build();

      // when
      actionMapper.updateEntityFromDTO(dto, entity);

      // then
      assertThat(entity.getName()).isEqualTo("New Name");
      assertThat(entity.getDescription()).isEqualTo("Old Desc");
      assertThat(entity.getMessageOnSuccess()).isEqualTo("New success");
      assertThat(entity.getMessageOnFailure()).isEqualTo("Old failure");
    }

    @Test
    @DisplayName("Should do nothing when both arguments are null")
    void givenNullArguments_whenUpdate_thenDoesNothing() {
      actionMapper.updateEntityFromDTO(null, null);
      // no exception = success
    }
  }
}
