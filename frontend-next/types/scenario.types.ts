import { ITag } from "@/types/tags.types";
import { IGetDTO, IPostDTO } from "@/types/dto.types";
import { IRole } from "@/types/roles.types";

/**
 * Role DTO for POST and UPDATE requests
 */
export type IScenarioPostDTO = IPostDTO & {
  name: string;
  description: string;
  roles: IScenarioRole["id"][];
  items: IScenarioItem["id"][];
  actions: IScenarioAction["id"][];
  tags: ITag["id"][];
};

/**
 * Role DTO for GET requests
 */
export type IScenarioGetDTO = IGetDTO & {
  name: string;
  description: string;
  roles: IScenarioRole[];
  items: IScenarioItem[];
  actions: IScenarioAction[];
  tags: ITag[];
};

export type IScenario = {
  id: string | null;
  name: string;
  description: string;
  roles: IScenarioRole[];
  items: IScenarioItem[];
  actions: IScenarioAction[];
  tags: ITag[];
};

export type IScenarioRole = {
  id: string | null;
  roleId: IRole["id"] | null;
  scenarioId: IScenario["id"] | null;
  descriptionForGM: string;
  descriptionForOwner: string;
  descriptionForOthers: string;
};

export type IScenarioItem = {
  id: string | null;
  scenarioId: IScenario["id"] | null;
  name: string;
  description: string;
  actions: IScenarioItemAction[];
};

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
  scenarioId: IScenario["id"] | null;
  expiresAfterMinutes: number | null;
};

export type IScenarioItemAction = IAction & {
  itemId: string | null;
};
