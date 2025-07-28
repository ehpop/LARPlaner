package com.larplaner.dto.game.roleState;

import com.larplaner.dto.BaseResponseDTO;
import com.larplaner.dto.game.actionLog.GameActionLogResponseDTO;
import com.larplaner.dto.tag.AppliedTagResponseDTO;
import java.util.List;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
public class GameRoleStateResponseDTO extends BaseResponseDTO {

  private UUID gameSessionId;
  private UUID scenarioRoleId;
  private String assignedEmail;
  private String assignedUserID;
  private List<AppliedTagResponseDTO> appliedTags;
  private List<GameActionLogResponseDTO> actionHistory;
}