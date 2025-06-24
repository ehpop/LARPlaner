package com.larplaner.dto.scenario.item;

import com.larplaner.dto.BaseResponseDTO;
import com.larplaner.dto.scenario.itemAction.ScenarioItemActionResponseDTO;
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
public class ScenarioItemResponseDTO extends BaseResponseDTO {

  private UUID scenarioId;
  private String name;
  private String description;
  private List<ScenarioItemActionResponseDTO> actions;
}