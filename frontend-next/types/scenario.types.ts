import { ITag } from "@/types/tags.types";

export type IScenario = {
  id: number | null;
  name: string;
  description: string;
  roles: IScenarioRoleList;
  items: IScenarioItemList;
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
  actions: IScenarioAction[];
};
export type IScenarioItemList = IScenarioItem[];

export type IScenarioAction = {
  id: string | null;
  itemId: string | null;
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
  cooldownTimeInSeconds: number;
};
