package com.larplaner.dto.scenario.item;

import com.larplaner.dto.BaseRequestDTO;
import com.larplaner.dto.scenario.itemAction.UpdateScenarioItemActionRequestDTO;
import jakarta.validation.constraints.NotBlank;
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
public class UpdateScenarioItemRequestDTO extends BaseRequestDTO {

  private UUID id;

  @NotBlank(message = "Name cannot be blank")
  private String name;

  @NotBlank(message = "Description cannot be blank")
  private String description;

  private List<UpdateScenarioItemActionRequestDTO> actions;

}