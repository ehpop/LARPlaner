package com.larplaner.dto.event.assignedRole;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
public class AssignedRoleRequestDTO {

  @NotNull(message = "'Scenario Role ID' cannot be null")
  private UUID scenarioRoleId;

  @NotNull(message = "'Assigned Email' cannot be null")
  private String assignedEmail;

}
