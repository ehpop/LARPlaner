package com.larplaner.dto.game;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GameSessionRequestDTO {

  @NotNull(message = "Event ID cannot be null")
  private String eventId;

}