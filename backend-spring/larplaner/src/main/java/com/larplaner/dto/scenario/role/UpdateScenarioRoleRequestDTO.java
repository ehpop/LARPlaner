package com.larplaner.dto.scenario.role;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@SuperBuilder
public class UpdateScenarioRoleRequestDTO {

  private UUID id;

  @NotNull(message = "Role ID cannot be null")
  private UUID roleId;

  private String descriptionForGM;
  private String descriptionForOwner;
  private String descriptionForOthers;
}