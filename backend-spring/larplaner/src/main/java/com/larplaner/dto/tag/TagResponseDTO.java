package com.larplaner.dto.tag;

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
public class TagResponseDTO extends BaseResponseDTO {

  private String value;
  private Boolean isUnique;
  private Integer expiresAfterMinutes;
}