package com.larplaner.dto.scenario;

import com.larplaner.dto.scenario.action.UpdateScenarioActionRequestDTO;
import com.larplaner.dto.scenario.item.UpdateScenarioItemRequestDTO;
import com.larplaner.dto.scenario.role.UpdateScenarioRoleRequestDTO;
import java.util.List;
import lombok.Data;

@Data
public class UpdateScenarioRequestDTO {

  private String name;
  private String description;

  private List<UpdateScenarioRoleRequestDTO> roles;
  private List<UpdateScenarioItemRequestDTO> items;
  private List<UpdateScenarioActionRequestDTO> actions;
}