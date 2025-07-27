package com.larplaner.dto.scenario;

import com.larplaner.dto.scenario.action.UpdateScenarioActionRequestDTO;
import com.larplaner.dto.scenario.item.UpdateScenarioItemRequestDTO;
import com.larplaner.dto.scenario.role.UpdateScenarioRoleRequestDTO;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@SuperBuilder
public class UpdateScenarioRequestDTO {

  @NotBlank
  private String name;
  @NotBlank
  private String description;

  private List<UpdateScenarioRoleRequestDTO> roles;
  private List<UpdateScenarioItemRequestDTO> items;
  private List<UpdateScenarioActionRequestDTO> actions;
}