import { getLocalTimeZone, now } from "@internationalized/date";

import { IRole } from "@/types/roles.types";
import {
  IScenario,
  IScenarioAction,
  IScenarioItem,
  IScenarioItemAction,
  IScenarioRole,
} from "@/types/scenario.types";
import { IEvent } from "@/types/event.types";

export const emptyRole: IRole = {
  name: "",
  description: "",
  tags: [],
};

export const emptyScenarioRole: IScenarioRole = {
  descriptionForGM: "",
  descriptionForOwner: "",
  descriptionForOthers: "",
};

export const emptyScenarioItem: IScenarioItem = {
  name: "",
  description: "",
  actions: [] as IScenarioItemAction[],
};

export const emptyScenario: IScenario = {
  name: "",
  description: "",
  roles: [] as IScenarioRole[],
  items: [] as IScenarioItem[],
  actions: [] as IScenarioAction[],
};

export const emptyEvent: IEvent = {
  name: "",
  img: "",
  status: "upcoming",
  date: now(getLocalTimeZone()).add({ days: 1 }),
  description: "",
  gameSessionId: null,
  assignedRoles: [],
};
