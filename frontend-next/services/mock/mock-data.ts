import { getLocalTimeZone, now, ZonedDateTime } from "@internationalized/date";
import { uuidv4 } from "@firebase/util";

import { IEvent } from "@/types/event.types";
import { IRole } from "@/types/roles.types";
import {
  IScenario,
  IScenarioAction,
  IScenarioItem,
  IScenarioItemAction,
  IScenarioRole,
} from "@/types/scenario.types";
import { ITag } from "@/types/tags.types";

export const possibleTags: ITag[] = [];

export const userEmails = [
  { label: "example.email@email.co", value: "ehpoprostutomek@gmail.com" },
  { label: "example.email1@email.co", value: "example.email1@email.co" },
  { label: "example.email2@email.co", value: "example.email2@email.co" },
  { label: "example.email3@email.co", value: "example.email3@email.co" },
  { label: "example.email4@email.co", value: "example.email4@email.co" },
];

export const possibleRoles: IRole[] = Array.from({ length: 10 }, (_, i) => ({
  id: uuidv4(),
  name: `Role #${i + 1}`,
  description: `Description for Role #${i + 1}`,
  tags: [],
}));

export const possibleScenarios: IScenario[] = Array.from(
  { length: 5 },
  (_, i) => ({
    id: uuidv4(),
    name: `Scenario #${i + 1}`,
    description: `Description for Scenario #${i + 1}`,
    roles: [], // Placeholder
    items: [],
    actions: [],
    tags: [],
  }),
);

export const possibleScenarioRoles: IScenarioRole[] = possibleScenarios.flatMap(
  (scenario, i) => {
    const rolesForScenario = possibleRoles.slice(i * 2, i * 2 + 2); // 2 roles per scenario

    return rolesForScenario.map((role) => ({
      id: uuidv4(),
      scenarioId: scenario.id,
      roleId: role.id,
      descriptionForGM: "Notes for the game master.",
      descriptionForOwner: "Notes for the owner.",
      descriptionForOthers: "Notes for other players.",
    }));
  },
);

possibleScenarios.forEach((scenario, _) => {
  scenario.roles = possibleScenarioRoles.filter(
    (role) => role.scenarioId === scenario.id,
  );
});

export const possibleScenarioItems: IScenarioItem[] = possibleScenarios.flatMap(
  (scenario, i) => [
    {
      id: uuidv4(),
      scenarioId: scenario.id,
      name: `Item #${i + 1}`,
      description: `Description for Item #${i + 1}`,
      actions: [],
    },
    {
      id: uuidv4(),
      scenarioId: scenario.id,
      name: `Item #${i + 2}`,
      description: `Description for Item #${i + 2}`,
      actions: [],
    },
  ],
);

possibleScenarios.forEach((scenario) => {
  scenario.items = possibleScenarioItems.filter(
    (item) => item.scenarioId === scenario.id,
  );
});

export const eventsList: IEvent[] = Array.from({ length: 20 }, (_, i) => ({
  id: uuidv4(),
  name: `Event #${i + 1}`,
  date: now(getLocalTimeZone()).add({ days: i + 1 }) as ZonedDateTime,
  img: `/images/event-${i + 1}.jpg`,
  description: `Description for Event #${i + 1}`,
  scenarioId: possibleScenarios[i % possibleScenarios.length].id,
  assignedRoles: [
    {
      scenarioRoleId:
        possibleScenarioRoles[(i * 2) % possibleScenarioRoles.length].id,
      assignedEmail: userEmails[(i * 2) % userEmails.length].value,
    },
    {
      scenarioRoleId:
        possibleScenarioRoles[(i * 2 + 1) % possibleScenarioRoles.length].id,
      assignedEmail: userEmails[(i * 2 + 1) % userEmails.length].value,
    },
  ],
}));

export const emptyRole: IRole = {
  id: null,
  name: "",
  description: "",
  tags: [],
};

export const emptyScenarioRole: IScenarioRole = {
  id: null,
  scenarioId: null,
  roleId: null,
  descriptionForGM: "",
  descriptionForOwner: "",
  descriptionForOthers: "",
};

export const emptyScenarioItem: IScenarioItem = {
  id: null,
  scenarioId: null,
  name: "",
  description: "",
  actions: [] as IScenarioItemAction[],
};

export const emptyScenario: IScenario = {
  id: null,
  name: "",
  description: "",
  roles: [] as IScenarioRole[],
  items: [] as IScenarioItem[],
  actions: [] as IScenarioAction[],
  tags: [] as ITag[],
};

export const emptyEvent: IEvent = {
  id: null,
  name: "",
  img: "",
  date: now(getLocalTimeZone()).add({ days: 1 }),
  description: "",
  scenarioId: null,
  assignedRoles: [],
};

export const getEvent = (id: number): IEvent => {
  return eventsList[id % eventsList.length];
};

export const getScenario = (id: number): IScenario => {
  return possibleScenarios[id % possibleScenarios.length];
};

export const getRole = (id: number): IRole => {
  return possibleRoles[id % possibleRoles.length];
};

export const getEventByEventId = (id: IEvent["id"]): IEvent => {
  return eventsList.find((event) => event.id === id) as IEvent;
};

export const getScenarioById = (id: IScenario["id"]): IScenario => {
  return possibleScenarios.find((scenario) => scenario.id === id) as IScenario;
};

export const getRoleById = (id: IRole["id"]): IRole => {
  return possibleRoles.find((role) => role.id === id) as IRole;
};
