package com.larplaner.dto.tag;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTagRequestDTO {

  @NotBlank(message = "Tag value cannot be blank")
  private String value;

  @NotNull(message = "isUnique flag cannot be null")
  private Boolean isUnique;

  @NotNull(message = "expiresAfterMinutes cannot be null")
  private Integer expiresAfterMinutes;
}