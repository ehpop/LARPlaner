import { IEvent } from "@/types/event.types";
import { IAction, IScenarioItem, IScenarioRole } from "@/types/scenario.types";
import { ITag } from "@/types/tags.types";

export type IGameSession = {
  id: string; // Unique session ID
  eventId: IEvent["id"]; // Reference to the planned event
  status: "active" | "paused" | "completed"; // Current session status
  startTime: string; // ISO timestamp when the session started
  endTime: string | null; // ISO timestamp when the session ended (null if ongoing)
  assignedRoles: IGameRoleState[]; // Current role states
  items: IGameItemState[]; // State of items in the session
  actions: IGameActionLog[]; // Log of actions taken
};

export type IGameSessionGetDTO = IGameSession;
export type IGameSessionPostDTO = IGameSession;

export type IGameRoleState = {
  scenarioRoleId: IScenarioRole["id"]; // The role in the scenario
  assignedEmail: string; // Player assigned to this role
  assignedUserID: string; // User ID of the player
  activeTags: ITag[]; // Tags representing buffs, conditions, or status
  actionHistory: IGameActionLog[]; // Actions performed by this role
};

export type IGameItemState = {
  scenarioItemId: IScenarioItem["id"]; // The item from the scenario
  currentHolderRoleId: IScenarioRole["id"] | null; // Who holds this item, if any
  activeTags: ITag[]; // Conditions/statuses applied to the item
  actionHistory: IGameActionLog[]; // Log of actions taken on the item
};

export type IGameActionLog = {
  id: string; // Unique ID for the action log entry
  sessionId: IGameSession["id"];
  actionId: IAction["id"]; // Reference to the action
  timestamp: string; // ISO timestamp of when the action occurred
  performerRoleId: IScenarioRole["id"]; // Who performed the action
  targetItemId?: IScenarioItem["id"]; // If the action was on an item
  success: boolean; // Whether the action was successful
  appliedTags: ITag[]; // Tags applied due to this action
  removedTags: ITag[]; // Tags removed due to this action
  message: string; // Description of the outcome
};

export type IGameActionRequest = {
  sessionId: IGameSession["id"];
  performerRoleId: IScenarioRole["id"];
  actionId: IAction["id"];
  targetItemId?: IScenarioItem["id"];
};
