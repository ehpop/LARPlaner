package com.larplaner.dto.game;

import com.larplaner.dto.BaseResponseDTO;
import com.larplaner.dto.game.actionLog.GameActionLogResponseDTO;
import com.larplaner.dto.game.itemState.GameItemStateResponseDTO;
import com.larplaner.dto.game.roleState.GameRoleStateResponseDTO;
import com.larplaner.model.game.GameStatusEnum;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class GameSessionResponseDTO extends BaseResponseDTO {

  private String eventId;
  private GameStatusEnum status;
  private String startTime;
  private String endTime;
  private List<GameRoleStateResponseDTO> assignedRoles;
  private List<GameItemStateResponseDTO> items;
  private List<GameActionLogResponseDTO> actions;
}