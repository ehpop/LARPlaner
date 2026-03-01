package com.larplaner.dto.game.action;

import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GameActionRequestDTO {

  private UUID performerRoleId;
  private UUID actionId;
  private UUID targetItemId;
}