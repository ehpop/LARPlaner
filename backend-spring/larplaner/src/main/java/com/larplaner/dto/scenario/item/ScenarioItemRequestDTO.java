package com.larplaner.dto.scenario.item;

import com.larplaner.dto.scenario.itemAction.ScenarioItemActionRequestDTO;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
public class ScenarioItemRequestDTO {

  @NotBlank(message = "Name cannot be blank")
  private String name;

  @NotBlank(message = "Description cannot be blank")
  private String description;

  private List<ScenarioItemActionRequestDTO> actions;
}