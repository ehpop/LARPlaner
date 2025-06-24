package com.larplaner.dto.event.assignedRole;

import com.larplaner.dto.BaseResponseDTO;
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
public class AssignedRoleResponseDTO extends BaseResponseDTO {

  private UUID scenarioRoleId;
  private String assignedEmail;
  private UUID eventId;
}
