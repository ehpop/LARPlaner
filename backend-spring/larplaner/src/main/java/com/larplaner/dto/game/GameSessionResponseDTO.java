package com.larplaner.dto.game;

import com.larplaner.dto.BaseResponseDTO;
import com.larplaner.dto.game.actionLog.GameActionLogResponseDTO;
import com.larplaner.dto.game.itemState.GameItemStateResponseDTO;
import com.larplaner.dto.game.roleState.GameRoleStateResponseDTO;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.Builder.Default;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;

@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
public class GameSessionResponseDTO extends BaseResponseDTO {

  private UUID eventId;

  private ZonedDateTime startTime;
  private ZonedDateTime endTime;

  @Default
  private List<GameRoleStateResponseDTO> assignedRoles = new ArrayList<>();

  @Default
  private List<GameItemStateResponseDTO> items = new ArrayList<>();

  @Default
  private List<GameActionLogResponseDTO> actions = new ArrayList<>();
}