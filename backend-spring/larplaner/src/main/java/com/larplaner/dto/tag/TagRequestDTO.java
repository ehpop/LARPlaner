package com.larplaner.dto.tag;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Builder.Default;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@EqualsAndHashCode
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
public class TagRequestDTO {

  @NotBlank(message = "Tag value cannot be blank")
  private String value;

  @Default
  private Boolean isUnique = false;

  @Default
  private Integer expiresAfterMinutes = 0;
}