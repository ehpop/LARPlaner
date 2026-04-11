package com.larplaner.service.tag.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import com.larplaner.dto.tag.TagRequestDTO;
import com.larplaner.dto.tag.TagResponseDTO;
import com.larplaner.dto.tag.UpdateTagRequestDTO;
import com.larplaner.exception.EntityCouldNotBeAdded;
import com.larplaner.mapper.tag.TagMapper;
import com.larplaner.model.tag.Tag;
import com.larplaner.repository.tag.TagRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TagServiceImplTest {

  @Mock
  private TagRepository tagRepository;
  @Mock
  private TagMapper tagMapper;

  @InjectMocks
  private TagServiceImpl tagService;

  private Tag sampleTag;
  private TagResponseDTO sampleTagDTO;
  private UUID sampleTagId;

  @BeforeEach
  void setUp() {
    sampleTag = Tag.builder()
        .value("Warrior")
        .isUnique(false)
        .expiresAfterMinutes(0)
        .build();

    sampleTagId = sampleTag.getId();

    sampleTagDTO = TagResponseDTO.builder()
        .id(sampleTagId)
        .value(sampleTag.getValue())
        .isUnique(sampleTag.getIsUnique())
        .expiresAfterMinutes(sampleTag.getExpiresAfterMinutes())
        .build();
  }

  @Nested
  @DisplayName("getAllTags")
  class GetAllTags {

    @Test
    @DisplayName("Should return list of tag DTOs when no search term is provided")
    void givenNoSearchTerm_whenGetAllTags_thenReturnsListOfTagDTOs() {
      // given
      Tag secondTag = Tag.builder().value("Mage").build();
      TagResponseDTO secondTagDTO = TagResponseDTO.builder()
          .id(secondTag.getId())
          .value("Mage")
          .build();

      given(tagRepository.findAll()).willReturn(List.of(sampleTag, secondTag));
      given(tagMapper.toDTO(sampleTag)).willReturn(sampleTagDTO);
      given(tagMapper.toDTO(secondTag)).willReturn(secondTagDTO);

      // when
      List<TagResponseDTO> result = tagService.getAllTags();

      // then
      assertThat(result).isNotNull().hasSize(2);
      assertThat(result.get(0).getValue()).isEqualTo("Warrior");
      assertThat(result.get(1).getValue()).isEqualTo("Mage");
      verify(tagRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should return filtered results when search term is provided")
    void givenSearchTerm_whenGetAllTags_thenReturnsFilteredResults() {
      // given
      String searchTerm = "War";
      given(tagRepository.findByValueContainingIgnoreCase(searchTerm))
          .willReturn(List.of(sampleTag));
      given(tagMapper.toDTO(sampleTag)).willReturn(sampleTagDTO);

      // when
      List<TagResponseDTO> result = tagService.getAllTags(searchTerm);

      // then
      assertThat(result).isNotNull().hasSize(1);
      assertThat(result.get(0).getValue()).isEqualTo("Warrior");
      verify(tagRepository, times(1)).findByValueContainingIgnoreCase(searchTerm);
      verify(tagRepository, never()).findAll();
    }

    @ParameterizedTest
    @NullAndEmptySource
    @DisplayName("Should call findAll when search term is null or empty")
    void givenNullOrEmptySearchTerm_whenGetAllTags_thenCallsFindAll(String searchTerm) {
      // given
      given(tagRepository.findAll()).willReturn(List.of(sampleTag));
      given(tagMapper.toDTO(sampleTag)).willReturn(sampleTagDTO);

      // when
      List<TagResponseDTO> result = tagService.getAllTags(searchTerm);

      // then
      assertThat(result).isNotNull().hasSize(1);
      verify(tagRepository, times(1)).findAll();
      verify(tagRepository, never()).findByValueContainingIgnoreCase(any());
    }
  }

  @Nested
  @DisplayName("getTagById")
  class GetTagById {

    @Test
    @DisplayName("Should return tag DTO when tag exists")
    void givenExistingId_whenGetTagById_thenReturnsTagDTO() {
      // given
      given(tagRepository.findById(sampleTagId)).willReturn(Optional.of(sampleTag));
      given(tagMapper.toDTO(sampleTag)).willReturn(sampleTagDTO);

      // when
      TagResponseDTO result = tagService.getTagById(sampleTagId);

      // then
      assertThat(result).isNotNull();
      assertThat(result.getId()).isEqualTo(sampleTagId);
      assertThat(result.getValue()).isEqualTo("Warrior");
      verify(tagRepository, times(1)).findById(sampleTagId);
    }

    @Test
    @DisplayName("Should throw EntityNotFoundException when tag does not exist")
    void givenNonExistentId_whenGetTagById_thenThrowsEntityNotFoundException() {
      // given
      UUID nonExistentId = UUID.randomUUID();
      given(tagRepository.findById(nonExistentId)).willReturn(Optional.empty());

      // when & then
      assertThatThrownBy(() -> tagService.getTagById(nonExistentId))
          .isInstanceOf(EntityNotFoundException.class)
          .hasMessageContaining("Tag not found with id: " + nonExistentId);
      verify(tagMapper, never()).toDTO(any(Tag.class));
    }
  }

  @Nested
  @DisplayName("createTags")
  class CreateTags {

    @Test
    @DisplayName("Should save and return tag DTOs when values are unique")
    void givenUniqueTagValues_whenCreateTags_thenSavesAndReturnsDTOs() {
      // given
      TagRequestDTO requestDTO = TagRequestDTO.builder()
          .value("NewTag")
          .isUnique(false)
          .expiresAfterMinutes(0)
          .build();

      Tag mappedTag = Tag.builder()
          .value("NewTag")
          .isUnique(false)
          .expiresAfterMinutes(0)
          .build();

      TagResponseDTO expectedDTO = TagResponseDTO.builder()
          .id(mappedTag.getId())
          .value("NewTag")
          .build();

      given(tagMapper.toEntity(requestDTO)).willReturn(mappedTag);
      given(tagRepository.findByValueInIgnoreCase(any())).willReturn(Collections.emptyList());
      given(tagRepository.saveAll(any())).willReturn(List.of(mappedTag));
      given(tagMapper.toDTO(mappedTag)).willReturn(expectedDTO);

      // when
      List<TagResponseDTO> result = tagService.createTags(List.of(requestDTO));

      // then
      assertThat(result).isNotNull().hasSize(1);
      assertThat(result.get(0).getValue()).isEqualTo("NewTag");
      verify(tagRepository, times(1)).saveAll(any());
    }

    @Test
    @DisplayName("Should throw EntityCouldNotBeAdded when duplicate tag value exists")
    void givenDuplicateTagValue_whenCreateTags_thenThrowsEntityCouldNotBeAdded() {
      // given
      TagRequestDTO requestDTO = TagRequestDTO.builder()
          .value("Warrior")
          .build();

      Tag mappedTag = Tag.builder().value("Warrior").build();

      given(tagMapper.toEntity(requestDTO)).willReturn(mappedTag);
      given(tagRepository.findByValueInIgnoreCase(any())).willReturn(List.of(sampleTag));

      // when & then
      assertThatThrownBy(() -> tagService.createTags(List.of(requestDTO)))
          .isInstanceOf(EntityCouldNotBeAdded.class)
          .hasMessageContaining("Tags already exist with name(s): Warrior");
      verify(tagRepository, never()).saveAll(any());
    }
  }

  @Nested
  @DisplayName("updateTag")
  class UpdateTag {

    @Test
    @DisplayName("Should update and return tag DTO when tag exists")
    void givenExistingTag_whenUpdateTag_thenUpdatesAndReturnsDTO() {
      // given
      UpdateTagRequestDTO updateDTO = new UpdateTagRequestDTO("UpdatedValue", true, 30);

      given(tagRepository.findById(sampleTagId)).willReturn(Optional.of(sampleTag));
      given(tagRepository.save(sampleTag)).willReturn(sampleTag);

      TagResponseDTO updatedDTO = TagResponseDTO.builder()
          .id(sampleTagId)
          .value("UpdatedValue")
          .isUnique(true)
          .expiresAfterMinutes(30)
          .build();
      given(tagMapper.toDTO(sampleTag)).willReturn(updatedDTO);

      // when
      TagResponseDTO result = tagService.updateTag(sampleTagId, updateDTO);

      // then
      assertThat(result).isNotNull();
      assertThat(result.getValue()).isEqualTo("UpdatedValue");
      assertThat(result.getIsUnique()).isTrue();
      assertThat(result.getExpiresAfterMinutes()).isEqualTo(30);
      verify(tagMapper, times(1)).updateEntityFromDTO(updateDTO, sampleTag);
      verify(tagRepository, times(1)).save(sampleTag);
    }

    @Test
    @DisplayName("Should throw EntityNotFoundException when tag does not exist")
    void givenNonExistentId_whenUpdateTag_thenThrowsEntityNotFoundException() {
      // given
      UUID nonExistentId = UUID.randomUUID();
      UpdateTagRequestDTO updateDTO = new UpdateTagRequestDTO("Updated", false, 0);
      given(tagRepository.findById(nonExistentId)).willReturn(Optional.empty());

      // when & then
      assertThatThrownBy(() -> tagService.updateTag(nonExistentId, updateDTO))
          .isInstanceOf(EntityNotFoundException.class)
          .hasMessageContaining("Tag not found with id: " + nonExistentId);
      verify(tagRepository, never()).save(any(Tag.class));
    }
  }

  @Nested
  @DisplayName("deleteTag")
  class DeleteTag {

    @Test
    @DisplayName("Should call repository deleteById when tag exists")
    void givenExistingId_whenDeleteTag_thenCallsRepositoryDelete() {
      // given
      given(tagRepository.existsById(sampleTagId)).willReturn(true);
      willDoNothing().given(tagRepository).deleteById(sampleTagId);

      // when
      tagService.deleteTag(sampleTagId);

      // then
      verify(tagRepository, times(1)).deleteById(sampleTagId);
    }

    @Test
    @DisplayName("Should throw EntityNotFoundException when tag does not exist")
    void givenNonExistentId_whenDeleteTag_thenThrowsEntityNotFoundException() {
      // given
      UUID nonExistentId = UUID.randomUUID();
      given(tagRepository.existsById(nonExistentId)).willReturn(false);

      // when & then
      assertThatThrownBy(() -> tagService.deleteTag(nonExistentId))
          .isInstanceOf(EntityNotFoundException.class)
          .hasMessageContaining("Tag not found with id: " + nonExistentId);
      verify(tagRepository, never()).deleteById(any(UUID.class));
    }
  }
}
