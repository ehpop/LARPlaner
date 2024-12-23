import { ZonedDateTime } from "@internationalized/date";

import { IScenarioRole } from "@/types/scenario.types";
import { IGetDTO, IPostDTO } from "@/types/dto.types";

/**
 * Event DTO for POST and UPDATE requests
 */
export type IEventPostDTO = IPostDTO & {
  name: string;
  img: string;
  date: string;
  description: string;
  scenarioId: number | null;
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
  scenarioId: number | null;
  assignedRoles: {
    scenarioRoleId: IScenarioRole["roleId"];
    assignedEmail: string;
  }[];
};

export type IEvent = {
  id: number | null;
  name: string;
  img: string;
  date: ZonedDateTime;
  description: string;
  scenarioId: number | null;
  assignedRoles: {
    scenarioRoleId: IScenarioRole["roleId"];
    assignedEmail: string;
  }[];
};
