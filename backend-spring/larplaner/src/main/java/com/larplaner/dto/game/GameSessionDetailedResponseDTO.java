package com.larplaner.dto.game;

import com.larplaner.dto.BaseResponseDTO;
import com.larplaner.dto.game.itemState.GameItemStateSummaryResponseDTO;
import com.larplaner.dto.game.roleState.GameRoleStateSummaryResponseDTO;
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
public class GameSessionDetailedResponseDTO extends BaseResponseDTO {

  private UUID eventId;

  private ZonedDateTime startTime;
  private ZonedDateTime endTime;

  @Default
  private List<GameRoleStateSummaryResponseDTO> assignedRoles = new ArrayList<>();

  @Default
  private List<GameItemStateSummaryResponseDTO> items = new ArrayList<>();
}