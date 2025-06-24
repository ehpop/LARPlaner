package com.larplaner.dto.scenario.action;

import com.larplaner.dto.action.UpdateActionRequestDTO;
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
public class UpdateScenarioActionRequestDTO extends UpdateActionRequestDTO {

  private UUID id;

  public UpdateScenarioActionRequestDTO(UpdateActionRequestDTO actionDto) {
    super();

    if (actionDto == null) {
      return;
    }

    this.setName(actionDto.getName());
    this.setDescription(actionDto.getDescription());
    this.setMessageOnSuccess(actionDto.getMessageOnSuccess());
    this.setMessageOnFailure(actionDto.getMessageOnFailure());
    this.setRequiredTagsToDisplay(actionDto.getRequiredTagsToDisplay());
    this.setRequiredTagsToSucceed(actionDto.getRequiredTagsToSucceed());
    this.setTagsToApplyOnSuccess(actionDto.getTagsToApplyOnSuccess());
    this.setTagsToApplyOnFailure(actionDto.getTagsToApplyOnFailure());
    this.setTagsToRemoveOnSuccess(actionDto.getTagsToRemoveOnSuccess());
    this.setTagsToRemoveOnFailure(actionDto.getTagsToRemoveOnFailure());
  }
}