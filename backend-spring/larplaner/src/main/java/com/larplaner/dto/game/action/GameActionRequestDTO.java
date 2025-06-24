package com.larplaner.dto.game.action;

import com.larplaner.dto.BaseResponseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class GameActionRequestDTO extends BaseResponseDTO {

  private String sessionId;
  private String performerRoleId;
  private String actionId;
  private String targetItemId;
}