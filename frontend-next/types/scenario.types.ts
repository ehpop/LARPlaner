import { ITag, ITagGetDTO } from "@/types/tags.types";
import { IGetDTO, IPostDTO } from "@/types/dto.types";
import { IRole, IRolePersisted } from "@/types/roles.types";

/**
 * Role DTO for POST and UPDATE requests
 */
export type IScenarioPostDTO = IPostDTO & {
  name: string;
  description: string;
  roles: IScenarioRolePostDTO[];
  items: IScenarioItemPostDTO[];
  actions: IScenarioActionPostDTO[];
};

/**
 * Role DTO for GET requests
 */
export type IScenarioGetDTO = IGetDTO & {
  name: string;
  description: string;
  roles: IScenarioRoleGetDTO[];
  items: IScenarioItemGetDTO[];
  actions: IScenarioActionGetDTO[];
};

export type IScenario = {
  id?: string;
  name: string;
  description: string;
  roles: IScenarioRole[];
  items: IScenarioItem[];
  actions: IScenarioAction[];
};

export type IScenarioPersisted = {
  id: string;
  name: string;
  description: string;
  roles: IScenarioRolePersisted[];
  items: IScenarioItemPersisted[];
  actions: IScenarioActionPersisted[];
};

export type IScenarioRole = {
  id?: string;
  roleId?: IRole["id"];
  scenarioId?: IScenario["id"];
  descriptionForGM: string;
  descriptionForOwner: string;
  descriptionForOthers: string;
};

export type IScenarioRolePersisted = {
  id: string;
  roleId: IRolePersisted["id"];
  scenarioId: IScenarioPersisted["id"];
  descriptionForGM: string;
  descriptionForOwner: string;
  descriptionForOthers: string;
};

export type IScenarioRolePostDTO = IPostDTO & {
  roleId: IRole["id"];
  scenarioId?: IScenario["id"];
  descriptionForGM: string;
  descriptionForOwner: string;
  descriptionForOthers: string;
};

export type IScenarioRoleGetDTO = IGetDTO & {
  id: string;
  roleId: IRole["id"];
  scenarioId: IScenario["id"];
  descriptionForGM: string;
  descriptionForOwner: string;
  descriptionForOthers: string;
};

export type IScenarioItem = {
  id?: string;
  scenarioId?: IScenario["id"];
  name: string;
  description: string;
  actions: IScenarioItemAction[];
};
export type IScenarioItemPersisted = {
  id: string;
  scenarioId: IScenarioPersisted["id"];
  name: string;
  description: string;
  actions: IScenarioItemActionPersisted[];
};

export type IScenarioItemPostDTO = IPostDTO & {
  name: string;
  scenarioId?: IScenario["id"];
  description: string;
  actions: IScenarioItemActionPostDTO[];
};

export type IScenarioItemGetDTO = IGetDTO & {
  id: string;
  scenarioId: IScenario["id"];
  name: string;
  description: string;
  actions: IScenarioItemActionGetDTO[];
};

export type IAction = {
  id?: string;
  name: string;
  description: string;
  messageOnSuccess: string;
  messageOnFailure: string;
  requiredTagsToDisplay: ITag[];
  requiredTagsToSucceed: ITag[];
  forbiddenTagsToDisplay: ITag[];
  forbiddenTagsToSucceed: ITag[];
  tagsToApplyOnSuccess: ITag[];
  tagsToApplyOnFailure: ITag[];
  tagsToRemoveOnSuccess: ITag[];
  tagsToRemoveOnFailure: ITag[];
};

export type IActionPersisted = {
  id: string;
  name: string;
  description: string;
  messageOnSuccess: string;
  messageOnFailure: string;
  requiredTagsToDisplay: ITag[];
  requiredTagsToSucceed: ITag[];
  forbiddenTagsToDisplay: ITag[];
  forbiddenTagsToSucceed: ITag[];
  tagsToApplyOnSuccess: ITag[];
  tagsToApplyOnFailure: ITag[];
  tagsToRemoveOnSuccess: ITag[];
  tagsToRemoveOnFailure: ITag[];
};

export type IActionPostDTO = {
  name: string;
  description: string;
  messageOnSuccess: string;
  messageOnFailure: string;
  requiredTagsToDisplay: ITag["id"][];
  requiredTagsToSucceed: ITag["id"][];
  forbiddenTagsToDisplay: ITag["id"][];
  forbiddenTagsToSucceed: ITag["id"][];
  tagsToApplyOnSuccess: ITag["id"][];
  tagsToApplyOnFailure: ITag["id"][];
  tagsToRemoveOnSuccess: ITag["id"][];
  tagsToRemoveOnFailure: ITag["id"][];
};

export type IActionGetDTO = {
  id?: string;
  name: string;
  description: string;
  messageOnSuccess: string;
  messageOnFailure: string;
  requiredTagsToDisplay: ITagGetDTO[];
  requiredTagsToSucceed: ITagGetDTO[];
  forbiddenTagsToDisplay: ITagGetDTO[];
  forbiddenTagsToSucceed: ITagGetDTO[];
  tagsToApplyOnSuccess: ITagGetDTO[];
  tagsToApplyOnFailure: ITagGetDTO[];
  tagsToRemoveOnSuccess: ITagGetDTO[];
  tagsToRemoveOnFailure: ITagGetDTO[];
};

export type IScenarioAction = IAction & {
  scenarioId?: IScenario["id"];
};

export type IScenarioActionPersisted = IActionPersisted & {
  scenarioId: IScenarioPersisted["id"];
};

export type IScenarioActionGetDTO = IActionGetDTO & {
  scenarioId: IScenario["id"];
};

export type IScenarioActionPostDTO = IActionPostDTO & {
  scenarioId?: IScenario["id"];
};

export type IScenarioItemAction = IAction & {
  id?: string;
  itemId?: string;
};

export type IScenarioItemActionPersisted = IActionPersisted & {
  id: string;
  itemId: string;
};

export type IScenarioItemActionGetDTO = IActionGetDTO & {
  id: string;
  itemId: string;
};

export type IScenarioItemActionPostDTO = IActionPostDTO & {
  itemId?: string;
};
