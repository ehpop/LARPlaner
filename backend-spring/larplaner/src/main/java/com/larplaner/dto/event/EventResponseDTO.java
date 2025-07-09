package com.larplaner.dto.event;

import com.larplaner.dto.BaseResponseDTO;
import com.larplaner.dto.event.assignedRole.AssignedRoleResponseDTO;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EventResponseDTO extends BaseResponseDTO {

  private String name;
  private String description;
  private String img;
  private String status;
  private ZonedDateTime date;
  private UUID scenarioId;
  private UUID gameSessionId;
  private List<AssignedRoleResponseDTO> assignedRoles;
}
