import { ITag } from "@/types/tags.types";

export type IScenario = {
  id: number | null;
  name: string;
  description: string;
  roles: IScenarioRoleList;
  items: IScenarioItemList;
  actions: IScenarioAction[];
  tags: ITag[];
};
export type IScenarioList = IScenario[];

export type IScenarioRole = {
  id: string | null;
  roleId: number | null;
  scenarioId: number | null;
  descriptionForGM: string;
  descriptionForOwner: string;
  descriptionForOthers: string;
};
export type IScenarioRoleList = IScenarioRole[];

export type IScenarioItem = {
  id: string | null;
  scenarioId: number | null;
  name: string;
  description: string;
  actions: IScenarioItemAction[];
};
export type IScenarioItemList = IScenarioItem[];

export type IAction = {
  id: string | null;
  name: string;
  description: string;
  messageOnSuccess: string;
  messageOnFailure: string;
  requiredTagsToDisplay: ITag[];
  requiredTagsToSucceed: ITag[];
  tagsToApplyOnSuccess: ITag[];
  tagsToApplyOnFailure: ITag[];
  tagsToRemoveOnSuccess: ITag[];
  tagsToRemoveOnFailure: ITag[];
};

export type IScenarioAction = IAction & {
  scenarioId: number | null;
  expiresAfterMinutes: number | null;
};

export type IScenarioItemAction = IAction & {
  itemId: string | null;
};
