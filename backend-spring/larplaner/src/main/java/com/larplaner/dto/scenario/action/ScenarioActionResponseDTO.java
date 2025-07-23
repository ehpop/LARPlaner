package com.larplaner.dto.scenario.action;

import com.larplaner.dto.action.ActionResponseDTO;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@SuperBuilder
public class ScenarioActionResponseDTO extends ActionResponseDTO {

  @NotNull(message = "Scenario ID cannot be null")
  private UUID scenarioId;

  @NotNull(message = "Action ID cannot be null")
  private UUID id;

  public ScenarioActionResponseDTO(ActionResponseDTO actionDto) {
    super();

    if (actionDto == null) {
      return;
    }

    this.setId(actionDto.getId());
    this.setName(actionDto.getName());
    this.setDescription(actionDto.getDescription());
    this.setMessageOnSuccess(actionDto.getMessageOnSuccess());
    this.setMessageOnFailure(actionDto.getMessageOnFailure());
    this.setRequiredTagsToDisplay(actionDto.getRequiredTagsToDisplay());
    this.setRequiredTagsToSucceed(actionDto.getRequiredTagsToSucceed());
    this.setForbiddenTagsToDisplay(actionDto.getForbiddenTagsToDisplay());
    this.setForbiddenTagsToSucceed(actionDto.getForbiddenTagsToSucceed());
    this.setTagsToApplyOnSuccess(actionDto.getTagsToApplyOnSuccess());
    this.setTagsToApplyOnFailure(actionDto.getTagsToApplyOnFailure());
    this.setTagsToRemoveOnSuccess(actionDto.getTagsToRemoveOnSuccess());
    this.setTagsToRemoveOnFailure(actionDto.getTagsToRemoveOnFailure());
  }
}