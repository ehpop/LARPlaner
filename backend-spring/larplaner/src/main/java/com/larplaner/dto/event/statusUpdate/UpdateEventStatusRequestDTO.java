package com.larplaner.dto.event.statusUpdate;

import com.larplaner.model.event.EventStatusEnum;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateEventStatusRequestDTO {

  @NotNull(message = "Status cannot be null.")
  @Schema(description = "The new status for the event.",
      example = "ACTIVE",
      requiredMode = Schema.RequiredMode.REQUIRED)
  private EventStatusEnum status;
}
