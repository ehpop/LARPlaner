package com.larplaner.dto.game.action;

import java.util.UUID;
import lombok.Data;

@Data
public class GameActionRequestDTO {

  private UUID performerRoleId;
  private UUID actionId;
  private UUID targetItemId;
}