package com.larplaner.mapper.role;

import com.larplaner.dto.role.RoleRequestDTO;
import com.larplaner.dto.role.RoleResponseDTO;
import com.larplaner.dto.role.UpdateRoleRequestDTO;
import com.larplaner.mapper.tag.TagMapper;
import com.larplaner.model.role.Role;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RoleMapper {

  private final TagMapper tagMapper;

  public RoleResponseDTO toDTO(Role role) {

    return RoleResponseDTO.builder()
        .id(role.getId())
        .name(role.getName())
        .description(role.getDescription())
        .tags(role.getTags().stream()
            .map(tagMapper::toDTO)
            .collect(Collectors.toList()))
        .build();
  }

  public Role toEntity(RoleResponseDTO dto) {
    return Role.builder()
        .id(dto.getId())
        .name(dto.getName())
        .description(dto.getDescription())
        .build();
  }

  public Role toEntity(RoleRequestDTO dto) {
    return Role.builder()
        .name(dto.getName())
        .description(dto.getDescription())
        .build();
  }

  public void updateEntityFromDTO(UpdateRoleRequestDTO dto, Role entity) {
    if (dto.getName() != null) {
      entity.setName(dto.getName());
    }
    if (dto.getDescription() != null) {
      entity.setDescription(dto.getDescription());
    }
  }
}