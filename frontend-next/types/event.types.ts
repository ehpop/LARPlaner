import { ZonedDateTime } from "@internationalized/date";

import { IScenarioRole } from "@/types/scenario.types";

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
export type IEventList = IEvent[];

export type ISkill = {
  key: string;
  name: string;
};
