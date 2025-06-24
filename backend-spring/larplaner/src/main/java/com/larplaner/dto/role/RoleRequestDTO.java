package com.larplaner.dto.role;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
public class RoleRequestDTO {

  @NotBlank(message = "Role name cannot be blank")
  private String name;

  @NotBlank(message = "Role description cannot be blank")
  private String description;

  @NotNull(message = "Tags list cannot be null")
  private List<UUID> tags;
}