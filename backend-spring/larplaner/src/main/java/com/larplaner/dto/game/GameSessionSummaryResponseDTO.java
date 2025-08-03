package com.larplaner.dto.game;

import com.larplaner.dto.BaseResponseDTO;
import java.time.ZonedDateTime;
import java.util.UUID;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;

@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
public class GameSessionSummaryResponseDTO extends BaseResponseDTO {

  private UUID eventId;

  private ZonedDateTime startTime;
  private ZonedDateTime endTime;

}
