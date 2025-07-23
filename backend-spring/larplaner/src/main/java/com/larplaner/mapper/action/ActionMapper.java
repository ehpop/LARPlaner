package com.larplaner.mapper.action;

import com.larplaner.dto.action.ActionRequestDTO;
import com.larplaner.dto.action.ActionResponseDTO;
import com.larplaner.mapper.common.MapperHelper;
import com.larplaner.mapper.tag.TagMapper;
import com.larplaner.model.action.Action;
import com.larplaner.model.tag.Tag;
import com.larplaner.service.tag.helper.TagHelper;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.function.Consumer;
import java.util.function.Supplier;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ActionMapper {

  private final TagMapper tagMapper;
  private final TagHelper tagHelper;

  /**
   * Maps an Action entity to an ActionResponseDTO.
   */
  public ActionResponseDTO toDTO(Action action) {
    if (action == null) {
      return null;
    }

    return ActionResponseDTO.builder()
        .id(action.getId())
        .name(action.getName())
        .description(action.getDescription())
        .messageOnSuccess(action.getMessageOnSuccess())
        .messageOnFailure(action.getMessageOnFailure())
        .requiredTagsToDisplay(
            MapperHelper.mapTagsToDTOs(action.getRequiredTagsToDisplay(), tagMapper))
        .requiredTagsToSucceed(
            MapperHelper.mapTagsToDTOs(action.getRequiredTagsToSucceed(), tagMapper))
        .forbiddenTagsToDisplay(
            MapperHelper.mapTagsToDTOs(action.getForbiddenTagsToDisplay(), tagMapper))
        .forbiddenTagsToSucceed(
            MapperHelper.mapTagsToDTOs(action.getForbiddenTagsToSucceed(), tagMapper))
        .tagsToApplyOnSuccess(
            MapperHelper.mapTagsToDTOs(action.getTagsToApplyOnSuccess(), tagMapper))
        .tagsToApplyOnFailure(
            MapperHelper.mapTagsToDTOs(action.getTagsToApplyOnFailure(), tagMapper))
        .tagsToRemoveOnSuccess(
            MapperHelper.mapTagsToDTOs(action.getTagsToRemoveOnSuccess(), tagMapper))
        .tagsToRemoveOnFailure(
            MapperHelper.mapTagsToDTOs(action.getTagsToRemoveOnFailure(), tagMapper))
        .build();
  }

  /**
   * Maps an ActionRequestDTO to a new Action entity. Tag associations are handled separately in the
   * service layer.
   */
  public Action toEntity(ActionRequestDTO dto) {
    if (dto == null) {
      return null;
    }

    return Action.builder()
        .name(dto.getName())
        .description(dto.getDescription())
        .messageOnSuccess(dto.getMessageOnSuccess())
        .messageOnFailure(dto.getMessageOnFailure())
        .requiredTagsToDisplay(tagHelper.processTags(dto.getRequiredTagsToDisplay()))
        .requiredTagsToSucceed(tagHelper.processTags(dto.getRequiredTagsToSucceed()))
        .forbiddenTagsToDisplay(tagHelper.processTags(dto.getForbiddenTagsToDisplay()))
        .forbiddenTagsToSucceed(tagHelper.processTags(dto.getForbiddenTagsToSucceed()))
        .tagsToApplyOnFailure(tagHelper.processTags(dto.getTagsToApplyOnFailure()))
        .tagsToRemoveOnSuccess(tagHelper.processTags(dto.getTagsToRemoveOnSuccess()))
        .tagsToRemoveOnFailure(tagHelper.processTags(dto.getTagsToRemoveOnFailure()))
        .build();
  }

  /**
   * Updates an existing Action entity from an UpdateActionRequestDTO. Tag associations are handled
   * separately in the service layer.
   */
  public void updateEntityFromDTO(ActionRequestDTO dto, Action entity) {
    if (dto == null || entity == null) {
      return;
    }

    if (dto.getName() != null) {
      entity.setName(dto.getName());
    }
    if (dto.getDescription() != null) {
      entity.setDescription(dto.getDescription());
    }
    if (dto.getMessageOnSuccess() != null) {
      entity.setMessageOnSuccess(dto.getMessageOnSuccess());
    }
    if (dto.getMessageOnFailure() != null) {
      entity.setMessageOnFailure(dto.getMessageOnFailure());
    }
    updateIfNotEmpty(dto::getRequiredTagsToDisplay, entity::setRequiredTagsToDisplay);
    updateIfNotEmpty(dto::getRequiredTagsToSucceed, entity::setRequiredTagsToSucceed);
    updateIfNotEmpty(dto::getForbiddenTagsToDisplay, entity::setForbiddenTagsToDisplay);
    updateIfNotEmpty(dto::getForbiddenTagsToSucceed, entity::setForbiddenTagsToSucceed);
    updateIfNotEmpty(dto::getTagsToApplyOnFailure, entity::setTagsToApplyOnFailure);
    updateIfNotEmpty(dto::getTagsToApplyOnSuccess, entity::setTagsToApplyOnSuccess);
    updateIfNotEmpty(dto::getTagsToRemoveOnSuccess, entity::setTagsToRemoveOnSuccess);
    updateIfNotEmpty(dto::getTagsToRemoveOnFailure, entity::setTagsToRemoveOnFailure);

  }

  public void updateIfNotEmpty(
      Supplier<List<UUID>> idSupplier,
      Consumer<List<Tag>> entityConsumer) {
    if (idSupplier.get() == null || idSupplier.get().isEmpty()) {
      entityConsumer.accept(new ArrayList<>());
      return;
    }

    List<UUID> ids = idSupplier.get();
    entityConsumer.accept(tagHelper.processTags(ids));
  }
}