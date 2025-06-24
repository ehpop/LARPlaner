package com.larplaner.dto.event;

import java.time.ZonedDateTime;
import java.util.List;

import com.larplaner.dto.BaseResponseDTO;
import com.larplaner.dto.event.assignedRole.AssignedRoleResponseDTO;
import com.larplaner.dto.game.GameSessionResponseDTO;
import com.larplaner.dto.scenario.ScenarioResponseDTO;

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
  private GameSessionResponseDTO gameSession;
  private List<AssignedRoleResponseDTO> assignedRoles;
}
