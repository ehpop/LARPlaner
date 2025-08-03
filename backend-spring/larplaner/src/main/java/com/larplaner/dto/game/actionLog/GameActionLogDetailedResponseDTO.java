package com.larplaner.dto.game.actionLog;

import com.larplaner.dto.BaseResponseDTO;
import com.larplaner.dto.action.ActionResponseDTO;
import com.larplaner.dto.game.GameSessionSummaryResponseDTO;
import com.larplaner.dto.game.itemState.GameItemStateDetailedResponseDTO;
import com.larplaner.dto.game.roleState.GameRoleStateSummaryResponseDTO;
import com.larplaner.dto.tag.TagResponseDTO;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.Builder.Default;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
public class GameActionLogDetailedResponseDTO extends BaseResponseDTO {

  private ActionResponseDTO action;
  private GameSessionSummaryResponseDTO gameSession;
  private GameRoleStateSummaryResponseDTO performerRole;
  private GameItemStateDetailedResponseDTO targetItem;

  private ZonedDateTime timestamp;
  private String message;
  private Boolean success;

  @Default
  private List<TagResponseDTO> appliedTags = new ArrayList<>();

  @Default
  private List<TagResponseDTO> removedTags = new ArrayList<>();
}
