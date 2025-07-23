package com.larplaner.dto.scenario.itemAction;

import com.larplaner.dto.action.ActionRequestDTO;
import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
public class ScenarioItemActionRequestDTO extends ActionRequestDTO {

  public static ScenarioItemActionRequestDTO fromUpdateDTO(
      UpdateScenarioItemActionRequestDTO dto
  ) {
    return ScenarioItemActionRequestDTO
        .builder()
        .name(dto.getName())
        .description(dto.getDescription())
        .messageOnFailure(dto.getMessageOnFailure())
        .messageOnSuccess(dto.getMessageOnSuccess())
        .requiredTagsToDisplay(dto.getRequiredTagsToDisplay())
        .requiredTagsToSucceed(dto.getRequiredTagsToSucceed())
        .forbiddenTagsToDisplay(dto.getForbiddenTagsToDisplay())
        .forbiddenTagsToSucceed(dto.getForbiddenTagsToSucceed())
        .tagsToApplyOnFailure(dto.getTagsToApplyOnFailure())
        .tagsToApplyOnSuccess(dto.getTagsToApplyOnSuccess())
        .tagsToRemoveOnFailure(dto.getTagsToRemoveOnFailure())
        .tagsToRemoveOnSuccess(dto.getTagsToRemoveOnSuccess())
        .build();
  }
}