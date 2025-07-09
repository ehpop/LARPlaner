package com.larplaner.dto.game;

import com.larplaner.dto.BaseResponseDTO;
import com.larplaner.dto.game.actionLog.GameActionLogResponseDTO;
import com.larplaner.dto.game.itemState.GameItemStateResponseDTO;
import com.larplaner.dto.game.roleState.GameRoleStateResponseDTO;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class GameSessionResponseDTO extends BaseResponseDTO {

  private UUID eventId;

  private ZonedDateTime startTime;
  private ZonedDateTime endTime;

  private List<GameRoleStateResponseDTO> assignedRoles;
  private List<GameItemStateResponseDTO> items;
  private List<GameActionLogResponseDTO> actions;
}