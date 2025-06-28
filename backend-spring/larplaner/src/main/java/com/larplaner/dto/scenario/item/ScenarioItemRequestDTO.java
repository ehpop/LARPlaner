package com.larplaner.dto.scenario.item;

import com.larplaner.dto.BaseRequestDTO;
import com.larplaner.dto.scenario.itemAction.ScenarioItemActionRequestDTO;
import jakarta.validation.constraints.NotBlank;
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
public class ScenarioItemRequestDTO extends BaseRequestDTO {

  @NotBlank(message = "Name cannot be blank")
  private String name;

  @NotBlank(message = "Description cannot be blank")
  private String description;

  private List<ScenarioItemActionRequestDTO> actions;

  public static ScenarioItemRequestDTO fromUpdateDTO(UpdateScenarioItemRequestDTO updateDTO) {
    return ScenarioItemRequestDTO.builder()
        .name(updateDTO.getName())
        .description(updateDTO.getDescription())
        .actions(
            updateDTO.getActions().stream()
                .map(ScenarioItemActionRequestDTO::fromUpdateDTO)
                .toList()
        ).build();
  }

}