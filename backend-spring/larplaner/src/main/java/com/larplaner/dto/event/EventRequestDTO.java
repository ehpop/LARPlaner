package com.larplaner.dto.event;

import com.larplaner.dto.event.assignedRole.AssignedRoleRequestDTO;
import jakarta.persistence.Column;
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
public class EventRequestDTO {

  @NotBlank(message = "Event name cannot be blank")
  private String name;

  @NotBlank(message = "Event description cannot be blank")
  @Column(length = 4096)
  private String description;

  private String img;

  @NotNull(message = "Event date cannot be null")
  private ZonedDateTime date;

  @NotNull(message = "Scenario cannot be null")
  private UUID scenarioId;

  private List<AssignedRoleRequestDTO> assignedRoles;
}
