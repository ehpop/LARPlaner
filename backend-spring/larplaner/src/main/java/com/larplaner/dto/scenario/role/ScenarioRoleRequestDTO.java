package com.larplaner.dto.scenario.role;

import com.larplaner.dto.BaseRequestDTO;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
public class ScenarioRoleRequestDTO extends BaseRequestDTO {

  @NotNull(message = "Role ID cannot be null")
  private UUID roleId;

  private String descriptionForGM;
  private String descriptionForOwner;
  private String descriptionForOthers;
}