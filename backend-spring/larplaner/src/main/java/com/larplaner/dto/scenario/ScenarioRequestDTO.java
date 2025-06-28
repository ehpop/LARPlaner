package com.larplaner.dto.scenario;

import com.larplaner.dto.BaseRequestDTO;
import com.larplaner.dto.scenario.action.ScenarioActionRequestDTO;
import com.larplaner.dto.scenario.item.ScenarioItemRequestDTO;
import com.larplaner.dto.scenario.role.ScenarioRoleRequestDTO;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@SuperBuilder
public class ScenarioRequestDTO extends BaseRequestDTO {

  @NotBlank(message = "Name cannot be blank")
  private String name;

  private String description;

  private List<ScenarioRoleRequestDTO> roles;
  private List<ScenarioItemRequestDTO> items;
  private List<ScenarioActionRequestDTO> actions;
}