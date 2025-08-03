package com.larplaner.dto.game.itemState;

import com.larplaner.dto.BaseResponseDTO;
import com.larplaner.dto.game.GameSessionSummaryResponseDTO;
import com.larplaner.dto.game.roleState.GameRoleStateSummaryResponseDTO;
import com.larplaner.dto.scenario.item.ScenarioItemSummaryResponseDTO;
import com.larplaner.dto.tag.TagResponseDTO;
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
public class GameItemStateDetailedResponseDTO extends BaseResponseDTO {

  private GameSessionSummaryResponseDTO gameSession;
  private ScenarioItemSummaryResponseDTO scenarioItem;
  private GameRoleStateSummaryResponseDTO currentHolderRole;

  @Default
  private List<TagResponseDTO> activeTags = new ArrayList<>();

}