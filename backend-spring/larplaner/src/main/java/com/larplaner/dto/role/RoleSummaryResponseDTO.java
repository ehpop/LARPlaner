package com.larplaner.dto.role;

import com.larplaner.dto.BaseResponseDTO;
import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
public class RoleSummaryResponseDTO extends BaseResponseDTO {

  private String name;
  private String description;
}
