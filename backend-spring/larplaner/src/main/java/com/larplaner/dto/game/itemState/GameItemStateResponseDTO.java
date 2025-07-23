package com.larplaner.dto.game.itemState;

import com.larplaner.dto.BaseResponseDTO;
import com.larplaner.dto.game.actionLog.GameActionLogResponseDTO;
import com.larplaner.dto.tag.TagResponseDTO;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
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
public class GameItemStateResponseDTO extends BaseResponseDTO {

  private UUID gameSessionId;
  private UUID scenarioItemId;
  private UUID currentHolderRoleId;

  @Default
  private List<TagResponseDTO> activeTags = new ArrayList<>();

  @Default
  private List<GameActionLogResponseDTO> actionHistory = new ArrayList<>();
}