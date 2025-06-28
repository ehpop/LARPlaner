package com.larplaner.dto.scenario.role;

import java.util.UUID;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@SuperBuilder
public class UpdateScenarioRoleRequestDTO extends ScenarioRoleRequestDTO {

  private UUID id;

}