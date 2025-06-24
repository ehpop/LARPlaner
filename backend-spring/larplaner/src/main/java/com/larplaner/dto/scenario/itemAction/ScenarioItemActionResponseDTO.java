package com.larplaner.dto.scenario.itemAction;

import com.larplaner.dto.action.ActionResponseDTO;
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
public class ScenarioItemActionResponseDTO extends ActionResponseDTO {

  private UUID itemId;

  public ScenarioItemActionResponseDTO(ActionResponseDTO actionDto) {
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
    this.setTagsToApplyOnSuccess(actionDto.getTagsToApplyOnSuccess());
    this.setTagsToApplyOnFailure(actionDto.getTagsToApplyOnFailure());
    this.setTagsToRemoveOnSuccess(actionDto.getTagsToRemoveOnSuccess());
    this.setTagsToRemoveOnFailure(actionDto.getTagsToRemoveOnFailure());
  }
}