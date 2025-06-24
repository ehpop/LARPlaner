package com.larplaner.mapper.action;

import org.springframework.stereotype.Component;

import com.larplaner.dto.action.ActionRequestDTO;
import com.larplaner.dto.action.ActionResponseDTO;
import com.larplaner.dto.action.UpdateActionRequestDTO;
import com.larplaner.mapper.common.MapperHelper;
import com.larplaner.mapper.tag.TagMapper;
import com.larplaner.model.action.Action;
import com.larplaner.service.tag.helper.TagHelper;

import lombok.RequiredArgsConstructor;

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
     * Maps an ActionRequestDTO to a new Action entity. Tag associations are handled
     * separately in the
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
                .tagsToApplyOnSuccess(tagHelper.processTags(dto.getTagsToApplyOnSuccess()))
                .tagsToApplyOnFailure(tagHelper.processTags(dto.getTagsToApplyOnFailure()))
                .tagsToRemoveOnSuccess(tagHelper.processTags(dto.getTagsToRemoveOnSuccess()))
                .tagsToRemoveOnFailure(tagHelper.processTags(dto.getTagsToRemoveOnFailure()))
                .build();
    }

    /**
     * Updates an existing Action entity from an UpdateActionRequestDTO. Tag
     * associations are handled
     * separately in the service layer.
     */
    public void updateEntityFromDTO(UpdateActionRequestDTO dto, Action entity) {
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
    }
}