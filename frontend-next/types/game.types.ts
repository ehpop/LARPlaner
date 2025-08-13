import { ZonedDateTime } from "@internationalized/date";

import { IEvent } from "@/types/event.types";
import {
  IAction,
  IScenarioItem,
  IScenarioItemPersisted,
  IScenarioRole,
} from "@/types/scenario.types";
import {
  IAppliedTag,
  IAppliedTagApiResponseDTO,
  ITag,
} from "@/types/tags.types";

/**
 * A summary of a role, without its tags.
 * Corresponds to RoleSummaryResponseDTO
 */
export type IRoleSummary = {
  id: string;
  name: string;
  description: string;
};

/**
 * A detailed representation of a role within a scenario, including the base role's summary.
 * Corresponds to ScenarioRoleDetailedResponseDTO
 */
export type IScenarioRoleDetailed = {
  id: string;
  role: IRoleSummary;
  scenarioId: string;
  descriptionForGM: string;
  descriptionForOwner: string;
  descriptionForOthers: string;
};

// --- API Response DTOs (Raw data from the server with string dates) ---

export type IGameRoleStateSummaryApiResponseDTO = {
  id: string;
  gameSessionId: string;
  scenarioRole: IScenarioRoleDetailed;
  assignedEmail: string;
  assignedUserID: string;
  appliedTags: IAppliedTagApiResponseDTO[];
};

export type IGameSessionApiResponseDTO = {
  id: string;
  eventId: IEvent["id"];
  startTime: string;
  endTime: string | null;
  assignedRoles: IGameRoleStateSummaryApiResponseDTO[];
  items: IGameItemStateSummary[];
};

// --- Application Domain Models (Transformed, ready-to-use data with ZonedDateTime) ---

/**
 * Represents the state of a specific role assigned to a user within a game session.
 * Corresponds to GameRoleStateSummaryResponseDTO
 */
export type IGameRoleStateSummary = {
  id: string;
  gameSessionId: string;
  scenarioRole: IScenarioRoleDetailed;
  assignedEmail: string;
  assignedUserID: string;
  appliedTags: IAppliedTag[];
};

/**
 * Represents the state of a specific item within a game session.
 * Corresponds to GameItemStateSummaryResponseDTO
 */
export type IGameItemStateSummary = {
  id: string;
  gameSessionId: string;
  scenarioItem: IScenarioItemPersisted;
  currentHolderRoleId: IScenarioRole["id"] | null;
  activeTags: ITag[];
};

/**
 * Represents a detailed view of a game session, including the states of all roles and items.
 * Corresponds to GameSessionDetailedResponseDTO
 */
export type IGameSession = {
  id: string;
  eventId: IEvent["id"];
  startTime: ZonedDateTime;
  endTime: ZonedDateTime | null;
  assignedRoles: IGameRoleStateSummary[];
  items: IGameItemStateSummary[];
};

// --- Game Action & History Types ---

/**
 * A summary log of an action performed during a game session.
 * Corresponds to GameActionLogSummaryResponseDTO
 */
export type IGameActionLogSummary = {
  id: string;
  gameSessionId: string;
  actionId: IAction["id"];
  timestamp: string;
  performerRoleId: IScenarioRole["id"];
  targetItemId?: IScenarioItem["id"];
  success: boolean;
  message: string;
  appliedTags: ITag[];
  removedTags: ITag[];
};

/**
 * A detailed log of an action, expanding on related objects.
 * Corresponds to GameActionLogDetailedResponseDTO
 */
export type IGameActionLogDetailed = {
  id: string;
  action: IAction;
  gameSession: {
    id: string;
    eventId: string;
    startTime: string;
    endTime: string | null;
  };
  performerRole: IGameRoleStateSummary;
  targetItem?: IGameItemStateSummary;
  timestamp: string;
  message: string;
  success: boolean;
  appliedTags: ITag[];
  removedTags: ITag[];
};

// --- API Request Payloads (Outgoing data) ---

/**
 * The payload for performing an action in a game session.
 * POST /api/game/{gameSessionId}/perform-action
 * Corresponds to GameActionRequestDTO
 */
export type IGameActionRequest = {
  performerRoleId: IScenarioRole["id"];
  actionId: IAction["id"];
  targetItemId?: IScenarioItem["id"];
};

/**
 * The payload for updating the state of a role in a game session.
 * PUT /api/game/roles/{gameSessionRoleId}/state
 * Corresponds to UpdateGameRoleStateRequestDTO
 */
export type IUpdateGameRoleStateRequest = {
  activeTags: string[];
};
