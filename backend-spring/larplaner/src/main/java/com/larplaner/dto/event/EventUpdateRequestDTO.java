package com.larplaner.dto.event;

import com.larplaner.dto.event.assignedRole.AssignedRoleUpdateRequestDTO;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EventUpdateRequestDTO {

  @NotBlank(message = "Event name cannot be blank")
  private String name;

  @NotBlank(message = "Event description cannot be blank")
  private String description;

  private String img;

  @NotNull(message = "Event date cannot be null")
  private ZonedDateTime date;

  @NotNull(message = "Scenario cannot be null")
  private UUID scenarioId;

  private List<AssignedRoleUpdateRequestDTO> assignedRoles;
}
