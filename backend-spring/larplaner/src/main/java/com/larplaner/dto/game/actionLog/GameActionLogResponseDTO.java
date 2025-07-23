package com.larplaner.dto.game.actionLog;

import com.larplaner.dto.BaseResponseDTO;
import com.larplaner.dto.tag.TagResponseDTO;
import java.time.ZonedDateTime;
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
public class GameActionLogResponseDTO extends BaseResponseDTO {

  private UUID gameSessionId;
  private UUID actionId;

  private ZonedDateTime timestamp;

  private UUID performerRoleId;
  private UUID targetItemId;

  private Boolean success;

  @Default
  private List<TagResponseDTO> appliedTags = new ArrayList<>();

  @Default
  private List<TagResponseDTO> removedTags = new ArrayList<>();

  private String message;
}