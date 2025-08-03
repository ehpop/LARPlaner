package com.larplaner.dto.scenario.role;

import com.larplaner.dto.BaseResponseDTO;
import com.larplaner.dto.role.RoleSummaryResponseDTO;
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
public class ScenarioRoleDetailedResponseDTO extends BaseResponseDTO {

  private RoleSummaryResponseDTO role;
  private UUID scenarioId;
  private String descriptionForGM;
  private String descriptionForOwner;
  private String descriptionForOthers;
}
