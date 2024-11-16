import { ITag } from "@/types/roles.types";

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
  imageUrl?: string;
  requiredTags: ITag[];
};
export type IScenarioItemList = IScenarioItem[];
