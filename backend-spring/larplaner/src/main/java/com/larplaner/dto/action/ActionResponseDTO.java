package com.larplaner.dto.action;

import com.larplaner.dto.BaseResponseDTO;
import com.larplaner.dto.tag.TagResponseDTO;
import java.util.List;
import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
public class ActionResponseDTO extends BaseResponseDTO {

  private String name;
  private String description;
  private String messageOnSuccess;
  private String messageOnFailure;
  private List<TagResponseDTO> requiredTagsToDisplay;
  private List<TagResponseDTO> requiredTagsToSucceed;
  private List<TagResponseDTO> forbiddenTagsToDisplay;
  private List<TagResponseDTO> forbiddenTagsToSucceed;
  private List<TagResponseDTO> tagsToApplyOnSuccess;
  private List<TagResponseDTO> tagsToApplyOnFailure;
  private List<TagResponseDTO> tagsToRemoveOnSuccess;
  private List<TagResponseDTO> tagsToRemoveOnFailure;
}