package com.larplaner.mapper.role;

import static org.assertj.core.api.Assertions.assertThat;

import com.larplaner.dto.role.RoleDetailedResponseDTO;
import com.larplaner.dto.role.RoleRequestDTO;
import com.larplaner.dto.role.RoleSummaryResponseDTO;
import com.larplaner.dto.role.UpdateRoleRequestDTO;
import com.larplaner.mapper.tag.TagMapper;
import com.larplaner.model.role.Role;
import com.larplaner.model.tag.Tag;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

class RoleMapperTest {

  private RoleMapper roleMapper;

  @BeforeEach
  void setUp() {
    TagMapper tagMapper = new TagMapper();
    roleMapper = new RoleMapper(tagMapper);
  }

  @Nested
  @DisplayName("toDetailedDTO")
  class ToDetailedDTO {

    @Test
    @DisplayName("Should correctly map Role entity to RoleDetailedResponseDTO with tags")
    void givenRoleWithTags_whenToDetailedDTO_thenReturnsMappedDTOWithTags() {
      // given
      Tag tag = Tag.builder().value("Warrior").isUnique(false).expiresAfterMinutes(0).build();
      Role role = Role.builder()
          .name("ROLE_ADMIN")
          .description("Administrator")
          .tags(List.of(tag))
          .build();

      // when
      RoleDetailedResponseDTO result = roleMapper.toDetailedDTO(role);

      // then
      assertThat(result).isNotNull();
      assertThat(result.getId()).isEqualTo(role.getId());
      assertThat(result.getName()).isEqualTo("ROLE_ADMIN");
      assertThat(result.getDescription()).isEqualTo("Administrator");
      assertThat(result.getTags()).hasSize(1);
      assertThat(result.getTags().get(0).getValue()).isEqualTo("Warrior");
    }

    @Test
    @DisplayName("Should return DTO with empty tags list when role has no tags")
    void givenRoleWithoutTags_whenToDetailedDTO_thenReturnsDTOWithEmptyTags() {
      // given
      Role role = Role.builder()
          .name("ROLE_USER")
          .description("User")
          .build();

      // when
      RoleDetailedResponseDTO result = roleMapper.toDetailedDTO(role);

      // then
      assertThat(result).isNotNull();
      assertThat(result.getTags()).isNotNull().isEmpty();
    }
  }

  @Nested
  @DisplayName("toDTO (summary)")
  class ToDTOSummary {

    @Test
    @DisplayName("Should correctly map Role entity to RoleSummaryResponseDTO")
    void givenRole_whenToDTO_thenReturnsSummaryDTO() {
      // given
      Role role = Role.builder()
          .name("ROLE_MODERATOR")
          .description("Moderator role")
          .build();

      // when
      RoleSummaryResponseDTO result = roleMapper.toDTO(role);

      // then
      assertThat(result).isNotNull();
      assertThat(result.getId()).isEqualTo(role.getId());
      assertThat(result.getName()).isEqualTo("ROLE_MODERATOR");
      assertThat(result.getDescription()).isEqualTo("Moderator role");
    }
  }

  @Nested
  @DisplayName("toEntity")
  class ToEntity {

    @Test
    @DisplayName("Should correctly map RoleRequestDTO to Role entity")
    void givenValidRequestDTO_whenToEntity_thenReturnsMappedEntity() {
      // given
      RoleRequestDTO dto = RoleRequestDTO.builder()
          .name("ROLE_NEW")
          .description("A new role")
          .build();

      // when
      Role result = roleMapper.toEntity(dto);

      // then
      assertThat(result).isNotNull();
      assertThat(result.getId()).isNotNull();
      assertThat(result.getName()).isEqualTo("ROLE_NEW");
      assertThat(result.getDescription()).isEqualTo("A new role");
    }
  }

  @Nested
  @DisplayName("updateEntityFromDTO")
  class UpdateEntityFromDTO {

    @Test
    @DisplayName("Should update all provided fields of existing Role")
    void givenFullUpdateDTO_whenUpdateEntityFromDTO_thenUpdatesAllFields() {
      // given
      Role existingRole = Role.builder()
          .name("OLD_NAME")
          .description("Old description")
          .build();
      UpdateRoleRequestDTO updateDTO = UpdateRoleRequestDTO.builder()
          .name("NEW_NAME")
          .description("New description")
          .build();

      // when
      roleMapper.updateEntityFromDTO(updateDTO, existingRole);

      // then
      assertThat(existingRole.getName()).isEqualTo("NEW_NAME");
      assertThat(existingRole.getDescription()).isEqualTo("New description");
    }

    @Test
    @DisplayName("Should not update fields when DTO values are null")
    void givenNullFields_whenUpdateEntityFromDTO_thenKeepsOriginalValues() {
      // given
      Role existingRole = Role.builder()
          .name("ORIGINAL_NAME")
          .description("Original description")
          .build();
      UpdateRoleRequestDTO updateDTO = UpdateRoleRequestDTO.builder()
          .name(null)
          .description(null)
          .build();

      // when
      roleMapper.updateEntityFromDTO(updateDTO, existingRole);

      // then
      assertThat(existingRole.getName()).isEqualTo("ORIGINAL_NAME");
      assertThat(existingRole.getDescription()).isEqualTo("Original description");
    }

    @Test
    @DisplayName("Should update only name when description is null")
    void givenOnlyNameSet_whenUpdateEntityFromDTO_thenUpdatesOnlyName() {
      // given
      Role existingRole = Role.builder()
          .name("OLD_NAME")
          .description("Keep this description")
          .build();
      UpdateRoleRequestDTO updateDTO = UpdateRoleRequestDTO.builder()
          .name("UPDATED_NAME")
          .description(null)
          .build();

      // when
      roleMapper.updateEntityFromDTO(updateDTO, existingRole);

      // then
      assertThat(existingRole.getName()).isEqualTo("UPDATED_NAME");
      assertThat(existingRole.getDescription()).isEqualTo("Keep this description");
    }
  }
}
