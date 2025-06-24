package com.larplaner.dto.action;

import java.util.List;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
public class ActionRequestDTO {

  private String name;
  private String description;
  private String messageOnSuccess;
  private String messageOnFailure;

  private List<UUID> requiredTagsToDisplay;
  private List<UUID> requiredTagsToSucceed;
  private List<UUID> tagsToApplyOnSuccess;
  private List<UUID> tagsToApplyOnFailure;
  private List<UUID> tagsToRemoveOnSuccess;
  private List<UUID> tagsToRemoveOnFailure;
}