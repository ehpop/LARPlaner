package com.larplaner.mapper.tag;

import static org.assertj.core.api.Assertions.assertThat;

import com.larplaner.dto.tag.AppliedTagResponseDTO;
import com.larplaner.model.tag.AppliedTag;
import com.larplaner.model.tag.Tag;
import java.time.ZonedDateTime;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AppliedTagMapperTest {

  @Spy
  private TagMapper tagMapper;

  @InjectMocks
  private AppliedTagMapper appliedTagMapper;

  @Test
  @DisplayName("Should map AppliedTag to DTO with nested tag")
  void givenAppliedTag_whenToDTO_thenMapsAllFieldsIncludingTag() {
    // given
    Tag tag = Tag.builder().value("Poisoned").isUnique(false).expiresAfterMinutes(30).build();
    ZonedDateTime appliedAt = ZonedDateTime.now();
    AppliedTag appliedTag = AppliedTag.builder()
        .tag(tag)
        .appliedToUserAt(appliedAt)
        .userID("user-123")
        .userEmail("user@example.com")
        .build();

    // when
    AppliedTagResponseDTO result = appliedTagMapper.toDTO(appliedTag);

    // then
    assertThat(result).isNotNull();
    assertThat(result.getId()).isEqualTo(appliedTag.getId());
    assertThat(result.getAppliedToUserAt()).isEqualTo(appliedAt);
    assertThat(result.getUserID()).isEqualTo("user-123");
    assertThat(result.getUserEmail()).isEqualTo("user@example.com");
    assertThat(result.getTag()).isNotNull();
    assertThat(result.getTag().getValue()).isEqualTo("Poisoned");
    assertThat(result.getTag().getExpiresAfterMinutes()).isEqualTo(30);
  }
}
