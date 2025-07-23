import {
  IAction,
  IActionPostDTO,
  IScenario,
  IScenarioAction,
  IScenarioActionPostDTO,
  IScenarioGetDTO,
  IScenarioItem,
  IScenarioItemAction,
  IScenarioItemActionPostDTO,
  IScenarioItemPostDTO,
  IScenarioPostDTO,
  IScenarioRole,
  IScenarioRolePostDTO,
} from "@/types/scenario.types";
import { ITag } from "@/types/tags.types";

function convertActionToActionPostDTO(action: IAction): IActionPostDTO {
  const mapTagsToIds = (tags: ITag[]): string[] =>
    tags.map((tag) => tag.id).filter((id): id is string => !!id);

  return {
    ...(action.id && { id: action.id }),
    name: action.name,
    description: action.description,
    messageOnSuccess: action.messageOnSuccess,
    messageOnFailure: action.messageOnFailure,
    requiredTagsToDisplay: mapTagsToIds(action.requiredTagsToDisplay),
    requiredTagsToSucceed: mapTagsToIds(action.requiredTagsToSucceed),
    forbiddenTagsToDisplay: mapTagsToIds(action.forbiddenTagsToDisplay),
    forbiddenTagsToSucceed: mapTagsToIds(action.forbiddenTagsToSucceed),
    tagsToApplyOnSuccess: mapTagsToIds(action.tagsToApplyOnSuccess),
    tagsToApplyOnFailure: mapTagsToIds(action.tagsToApplyOnFailure),
    tagsToRemoveOnSuccess: mapTagsToIds(action.tagsToRemoveOnSuccess),
    tagsToRemoveOnFailure: mapTagsToIds(action.tagsToRemoveOnFailure),
  };
}

/**
 * Converts a scenario GET DTO to the main IScenario domain model.
 *
 * NOTE: This implementation assumes that the nested DTOs (e.g., IScenarioRoleGetDTO,
 * ITagGetDTO) are structurally compatible with their domain counterparts (IScenarioRole, ITag).
 *
 */
export function convertGetDtoToScenario(dto: IScenarioGetDTO): IScenario {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    roles: dto.roles.map((role) => ({ ...role })),
    items: dto.items.map((item) => ({
      ...item,
      actions: item.actions.map((action) => ({ ...action })),
    })),
    actions: dto.actions.map((action) => ({ ...action })),
  };
}

/**
 * Converts an IScenario domain model to a POST DTO, suitable for sending to an API.
 * This function correctly transforms nested objects and maps tag objects to tag IDs.
 */
export function convertScenarioToPostDto(
  scenario: IScenario,
): IScenarioPostDTO {
  return {
    name: scenario.name,
    description: scenario.description,

    roles: scenario.roles.map(
      (role: IScenarioRole): IScenarioRolePostDTO => ({
        ...(role.id && { id: role.id }),
        roleId: role.roleId,
        ...(role.scenarioId && { scenarioId: role.scenarioId }),
        descriptionForGM: role.descriptionForGM,
        descriptionForOwner: role.descriptionForOwner,
        descriptionForOthers: role.descriptionForOthers,
      }),
    ),

    items: scenario.items.map(
      (item: IScenarioItem): IScenarioItemPostDTO => ({
        ...(item.id && { id: item.id }),
        name: item.name,
        description: item.description,
        ...(item.scenarioId && { scenarioId: item.scenarioId }),
        actions: item.actions.map(
          (action: IScenarioItemAction): IScenarioItemActionPostDTO => ({
            ...convertActionToActionPostDTO(action),
            ...(action.itemId && { itemId: action.itemId }),
          }),
        ),
      }),
    ),

    actions: scenario.actions.map(
      (action: IScenarioAction): IScenarioActionPostDTO => ({
        ...convertActionToActionPostDTO(action),
        ...(action.scenarioId && { scenarioId: action.scenarioId }),
      }),
    ),
  };
}
