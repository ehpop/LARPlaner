package com.larplaner.dto.game.roleState;

import com.larplaner.dto.BaseResponseDTO;
import com.larplaner.dto.game.GameSessionSummaryResponseDTO;
import com.larplaner.dto.game.actionLog.GameActionLogSummaryResponseDTO;
import com.larplaner.dto.scenario.role.ScenarioRoleResponseDTO;
import com.larplaner.dto.tag.AppliedTagResponseDTO;
import java.util.List;
import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
public class GameRoleStateDetailedResponseDTO extends BaseResponseDTO {

  private GameSessionSummaryResponseDTO gameSession;
  private ScenarioRoleResponseDTO scenarioRole;
  private String assignedEmail;
  private String assignedUserID;
  private List<AppliedTagResponseDTO> appliedTags;
  private List<GameActionLogSummaryResponseDTO> actionHistory;
}