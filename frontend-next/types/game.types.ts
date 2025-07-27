import { IEvent } from "@/types/event.types";
import { IAction, IScenarioItem, IScenarioRole } from "@/types/scenario.types";
import { IAppliedTag, ITag } from "@/types/tags.types";

export type IGameSession = {
  id: string;
  eventId: IEvent["id"];
  startTime: string;
  endTime: string | null;
  assignedRoles: IGameRoleState[];
  items: IGameItemState[];
  actions: IGameActionLog[];
};

export type IGameSessionGetDTO = IGameSession;
export type IGameSessionPostDTO = IGameSession;

export type IGameRoleState = {
  id: string;
  scenarioRoleId: IScenarioRole["id"];
  assignedEmail: string;
  assignedUserID: string;
  appliedTags: IAppliedTag[];
  actionHistory: IGameActionLog[];
};

export type IGameItemState = {
  scenarioItemId: IScenarioItem["id"];
  currentHolderRoleId: IScenarioRole["id"] | null;
  actionHistory: IGameActionLog[];
};

export type IGameActionLog = {
  id: string;
  sessionId: IGameSession["id"];
  actionId: IAction["id"];
  timestamp: string;
  performerRoleId: IScenarioRole["id"];
  targetItemId?: IScenarioItem["id"];
  success: boolean;
  appliedTags: ITag[];
  removedTags: ITag[];
  message: string;
};

export type IGameActionRequest = {
  performerRoleId: IScenarioRole["id"];
  actionId: IAction["id"];
  targetItemId?: IScenarioItem["id"];
};
