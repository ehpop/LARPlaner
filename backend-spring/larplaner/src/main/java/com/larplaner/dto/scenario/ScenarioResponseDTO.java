package com.larplaner.dto.scenario;

import com.larplaner.dto.BaseResponseDTO;
import com.larplaner.dto.scenario.action.ScenarioActionResponseDTO;
import com.larplaner.dto.scenario.item.ScenarioItemDetailedResponseDTO;
import com.larplaner.dto.scenario.role.ScenarioRoleResponseDTO;
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
public class ScenarioResponseDTO extends BaseResponseDTO {

  private String name;
  private String description;
  private List<ScenarioRoleResponseDTO> roles;
  private List<ScenarioItemDetailedResponseDTO> items;
  private List<ScenarioActionResponseDTO> actions;
}