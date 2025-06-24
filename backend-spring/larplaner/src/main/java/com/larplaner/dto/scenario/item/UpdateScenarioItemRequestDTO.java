package com.larplaner.dto.scenario.item;

import com.larplaner.dto.scenario.itemAction.UpdateScenarioItemActionRequestDTO;
import java.util.List;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
public class UpdateScenarioItemRequestDTO {

  private UUID id;

  private String name;

  private String description;

  private List<UpdateScenarioItemActionRequestDTO> actions;
}