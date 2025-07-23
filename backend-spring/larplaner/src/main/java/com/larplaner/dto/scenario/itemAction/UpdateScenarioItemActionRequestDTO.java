package com.larplaner.dto.scenario.itemAction;

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
public class UpdateScenarioItemActionRequestDTO extends ScenarioItemActionRequestDTO {

  private UUID id;

  public static UpdateScenarioItemActionRequestDTO fromUpdateActionRequest(
      UpdateActionRequestDTO actionDto) {
    return UpdateScenarioItemActionRequestDTO.builder()
        .name(actionDto.getName())
        .description(actionDto.getDescription())
        .messageOnSuccess(actionDto.getMessageOnSuccess())
        .messageOnFailure(actionDto.getMessageOnFailure())
        .requiredTagsToDisplay(actionDto.getRequiredTagsToDisplay())
        .requiredTagsToSucceed(actionDto.getRequiredTagsToSucceed())
        .forbiddenTagsToDisplay(actionDto.getForbiddenTagsToDisplay())
        .forbiddenTagsToSucceed(actionDto.getForbiddenTagsToSucceed())
        .tagsToApplyOnSuccess(actionDto.getTagsToApplyOnSuccess())
        .tagsToApplyOnFailure(actionDto.getTagsToApplyOnFailure())
        .tagsToRemoveOnSuccess(actionDto.getTagsToRemoveOnSuccess())
        .tagsToRemoveOnFailure(actionDto.getTagsToRemoveOnFailure())
        .build();
  }
}