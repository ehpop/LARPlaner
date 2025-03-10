import { ZonedDateTime } from "@internationalized/date";

import { IScenario, IScenarioRole } from "@/types/scenario.types";
import { IGetDTO, IPostDTO } from "@/types/dto.types";
import { IGameSession } from "@/types/game.types";

/**
 * Event DTO for POST and UPDATE requests
 */
export type IEventPostDTO = IPostDTO & {
  name: string;
  img: string;
  date: string;
  description: string;
  scenarioId: IScenario["id"] | null;
  gameSessionId: IGameSession["id"] | null;
  assignedRoles: {
    scenarioRoleId: IScenarioRole["roleId"];
    assignedEmail: string;
  }[];
};

/**
 * Event DTO for GET requests
 */
export type IEventGetDTO = IGetDTO & {
  name: string;
  img: string;
  date: string;
  description: string;
  scenarioId: IScenario["id"];
  gameSessionId: IGameSession["id"] | null;
  assignedRoles: {
    scenarioRoleId: IScenarioRole["roleId"];
    assignedEmail: string;
  }[];
};

export type IEvent = {
  id: string | null;
  name: string;
  img: string;
  status: IEventStatus;
  date: ZonedDateTime;
  description: string;
  scenarioId: IScenario["id"] | null;
  gameSessionId: IGameSession["id"] | null;
  assignedRoles: {
    scenarioRoleId: IScenarioRole["roleId"];
    assignedEmail: string;
  }[];
};

export type IEventStatus = "historic" | "active" | "upcoming";
