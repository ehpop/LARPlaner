package com.larplaner.dto.action;

import com.larplaner.dto.BaseRequestDTO;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
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
public class ActionRequestDTO extends BaseRequestDTO {

  @NotBlank
  private String name;
  @NotBlank
  private String description;
  @NotBlank
  private String messageOnSuccess;
  @NotBlank
  private String messageOnFailure;

  private List<UUID> requiredTagsToDisplay;
  private List<UUID> requiredTagsToSucceed;
  private List<UUID> forbiddenTagsToDisplay;
  private List<UUID> forbiddenTagsToSucceed;
  private List<UUID> tagsToApplyOnSuccess;
  private List<UUID> tagsToApplyOnFailure;
  private List<UUID> tagsToRemoveOnSuccess;
  private List<UUID> tagsToRemoveOnFailure;
}