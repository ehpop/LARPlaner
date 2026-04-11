package com.larplaner.mapper.tag;

import static org.assertj.core.api.Assertions.assertThat;

import com.larplaner.dto.tag.TagRequestDTO;
import com.larplaner.dto.tag.TagResponseDTO;
import com.larplaner.dto.tag.UpdateTagRequestDTO;
import com.larplaner.model.tag.Tag;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

class TagMapperTest {

  private TagMapper tagMapper;

  @BeforeEach
  void setUp() {
    tagMapper = new TagMapper();
  }

  @Nested
  @DisplayName("toDTO")
  class ToDTO {

    @Test
    @DisplayName("Should correctly map Tag entity to TagResponseDTO")
    void givenValidTag_whenToDTO_thenReturnsMappedDTO() {
      // given
      Tag tag = Tag.builder()
          .value("Warrior")
          .isUnique(true)
          .expiresAfterMinutes(60)
          .build();

      // when
      TagResponseDTO result = tagMapper.toDTO(tag);

      // then
      assertThat(result).isNotNull();
      assertThat(result.getId()).isEqualTo(tag.getId());
      assertThat(result.getValue()).isEqualTo("Warrior");
      assertThat(result.getIsUnique()).isTrue();
      assertThat(result.getExpiresAfterMinutes()).isEqualTo(60);
    }

    @Test
    @DisplayName("Should return null when input is null")
    void givenNull_whenToDTO_thenReturnsNull() {
      // given
      Tag tag = null;

      // when
      TagResponseDTO result = tagMapper.toDTO(tag);

      // then
      assertThat(result).isNull();
    }
  }

  @Nested
  @DisplayName("toEntity from TagRequestDTO")
  class ToEntityFromRequest {

    @Test
    @DisplayName("Should correctly map TagRequestDTO to Tag entity")
    void givenValidRequestDTO_whenToEntity_thenReturnsMappedEntity() {
      // given
      TagRequestDTO dto = TagRequestDTO.builder()
          .value("Mage")
          .isUnique(false)
          .expiresAfterMinutes(30)
          .build();

      // when
      Tag result = tagMapper.toEntity(dto);

      // then
      assertThat(result).isNotNull();
      assertThat(result.getId()).isNotNull();
      assertThat(result.getValue()).isEqualTo("Mage");
      assertThat(result.getIsUnique()).isFalse();
      assertThat(result.getExpiresAfterMinutes()).isEqualTo(30);
    }

    @Test
    @DisplayName("Should return null when input is null")
    void givenNull_whenToEntity_thenReturnsNull() {
      // given
      TagRequestDTO dto = null;

      // when
      Tag result = tagMapper.toEntity(dto);

      // then
      assertThat(result).isNull();
    }
  }

  @Nested
  @DisplayName("toEntity from TagResponseDTO")
  class ToEntityFromResponse {

    @Test
    @DisplayName("Should correctly map TagResponseDTO to Tag entity")
    void givenValidResponseDTO_whenToEntity_thenReturnsMappedEntity() {
      // given
      TagResponseDTO dto = TagResponseDTO.builder()
          .value("Healer")
          .isUnique(true)
          .expiresAfterMinutes(15)
          .build();

      // when
      Tag result = tagMapper.toEntity(dto);

      // then
      assertThat(result).isNotNull();
      assertThat(result.getValue()).isEqualTo("Healer");
      assertThat(result.getIsUnique()).isTrue();
      assertThat(result.getExpiresAfterMinutes()).isEqualTo(15);
    }

    @Test
    @DisplayName("Should return null when input is null")
    void givenNull_whenToEntityFromResponseDTO_thenReturnsNull() {
      // given
      TagResponseDTO dto = null;

      // when
      Tag result = tagMapper.toEntity(dto);

      // then
      assertThat(result).isNull();
    }
  }

  @Nested
  @DisplayName("updateEntityFromDTO")
  class UpdateEntityFromDTO {

    @Test
    @DisplayName("Should update all fields of existing Tag from UpdateTagRequestDTO")
    void givenValidUpdateDTO_whenUpdateEntityFromDTO_thenUpdatesAllFields() {
      // given
      Tag existingTag = Tag.builder()
          .value("OldValue")
          .isUnique(false)
          .expiresAfterMinutes(0)
          .build();
      UpdateTagRequestDTO updateDTO = new UpdateTagRequestDTO("NewValue", true, 45);

      // when
      tagMapper.updateEntityFromDTO(updateDTO, existingTag);

      // then
      assertThat(existingTag.getValue()).isEqualTo("NewValue");
      assertThat(existingTag.getIsUnique()).isTrue();
      assertThat(existingTag.getExpiresAfterMinutes()).isEqualTo(45);
    }

    @Test
    @DisplayName("Should not update value when DTO value is null")
    void givenNullValue_whenUpdateEntityFromDTO_thenKeepsOriginalValue() {
      // given
      Tag existingTag = Tag.builder()
          .value("OriginalValue")
          .isUnique(false)
          .expiresAfterMinutes(10)
          .build();
      UpdateTagRequestDTO updateDTO = new UpdateTagRequestDTO(null, true, 20);

      // when
      tagMapper.updateEntityFromDTO(updateDTO, existingTag);

      // then
      assertThat(existingTag.getValue()).isEqualTo("OriginalValue");
      assertThat(existingTag.getIsUnique()).isTrue();
      assertThat(existingTag.getExpiresAfterMinutes()).isEqualTo(20);
    }

    @Test
    @DisplayName("Should do nothing when either argument is null")
    void givenNullArguments_whenUpdateEntityFromDTO_thenDoesNothing() {
      // given
      Tag existingTag = Tag.builder().value("Original").build();

      // when & then — should not throw
      tagMapper.updateEntityFromDTO(null, existingTag);
      assertThat(existingTag.getValue()).isEqualTo("Original");

      tagMapper.updateEntityFromDTO(new UpdateTagRequestDTO("New", false, 0), null);
      // no exception expected
    }
  }
}
