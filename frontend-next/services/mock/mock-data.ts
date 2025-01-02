import { getLocalTimeZone, now, ZonedDateTime } from "@internationalized/date";

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

const preloadedUUIDs = {
  roles: [
    "4a3142fa-fac0-47b9-8d80-62c6f966ed6a",
    "40bca845-0e38-4477-81d9-df3bebb7069a",
    "599aa535-b240-42f3-ac09-d8f3401f9a8e",
    "a1c0226b-7939-4b42-9a4f-7ad059231e43",
    "ab5171ab-e558-441b-8d07-8478ecb97376",
    "9828ca5f-a238-40a7-b713-d7021ca8585c",
    "6053c12c-929c-4e8c-8b6b-bd66a8a06639",
    "399fba57-9021-4471-8c42-dda569b040ef",
    "0adb3eba-235a-464f-9574-ed089b9ac48d",
    "d39b2565-18cc-465c-8fbc-1802bcf8e04b",
  ],
  scenarios: [
    "d47c9d30-d131-4ce4-a1ac-1dab2c2f4407",
    "ad6e9d84-6eca-4590-a3d2-0096dcd2c2cf",
    "ada3df8a-ab19-4728-b134-f9d52d17d465",
    "2843ad0b-1692-4956-abcc-2f1165b2def8",
    "eaeb8298-cc6a-4930-91a2-a86cd9e5f6e1",
  ],
  scenarioRoles: [
    "26a66de1-3874-40c0-a844-e05c576c2f04",
    "a1419865-d403-4ce7-be39-4d8959ee9972",
    "8dbe9dfd-000e-478d-bc39-a99fbbee49ea",
    "f37dbdec-efe9-479e-b36b-eb1a0ada4e90",
    "0b08b0b6-17c4-4349-a937-936f8b55320a",
    "57315b81-8105-4e3e-becd-28f9381c818c",
    "80dd738e-064b-46e8-8f30-95d9db626c26",
    "b26cf4a9-7a6e-42a1-8306-7d7cd9ace382",
    "9ffd065b-0831-42fb-ac24-83702f38545c",
    "d485bd6d-75a1-415d-8f85-09b85ff60934",
  ],
  scenarioItems: [
    "ae9a0133-5eda-496d-89ae-7b9fdf106705",
    "7690c60c-c0b5-45ff-84e0-71a46f56cadb",
    "72edd296-35d9-4aff-b90c-1972936d9f1f",
    "4fe7aba5-6721-4e7b-9264-6e8741fc232a",
    "c879cea3-06ef-499e-9015-059dba5495cd",
    "3e6cde5e-77ff-484f-937a-9528c29ed89f",
    "3ad78160-7c60-45db-9f2e-1b6d75812fd4",
    "19250e70-9dcb-4544-bd07-24048c76cc7c",
    "6382e6e8-6e01-4dc9-8afa-b6ed357584a1",
    "6a548a25-7c99-46ed-b3f0-bb63c94871bd",
  ],
  events: [
    "8bd6fc03-4ba1-479a-be3d-0a4dbaef5375",
    "734f0424-54d4-48a2-88c4-01f16e74061e",
    "62284486-8619-44ea-bbbc-1a3f2108ec31",
    "e77e7a73-588c-4478-b717-6140304d64c5",
    "e9fd88f9-65e2-4fbd-9730-4f1bd79a644f",
    "4c47afae-46a9-4e74-8bc2-66c283188ad8",
    "eb86f18a-e5ff-4e99-80be-2b40b0849192",
    "cefc80bb-5ed3-42e0-98f4-f0e0415b75f1",
    "0f4b83d6-be8d-4903-a471-75b76dfc66c2",
    "5d3c2edf-a392-4145-937f-f2df9f3a4192",
    "22997160-137f-49f3-a77c-65c98c72ab3d",
    "5510cabe-b2bb-4900-9d15-b37dea7b71fb",
    "3084738e-fa5e-4a26-8e27-f72f78bd47d2",
    "bb4a7c36-7b82-4a8c-8fea-ef8df876379e",
    "ad054d3d-a5bd-41e6-9c6f-ac203a59da6b",
    "6c0ac1fa-b63c-4092-b55f-b68b7e541ee0",
    "9606c93c-c167-4fc9-b1d7-05df0cb65dd4",
    "1a8fb014-f67e-4f6e-a5cd-9c6d474098fc",
    "b00964f7-522f-4169-8534-e64ed6780f6e",
    "4942155a-2bd4-48cd-b9d6-c0f222891a18",
  ],
};

export const possibleTags: ITag[] = [];

export const userEmails = [
  { label: "justidthe@gmail.com", value: "justidthe@gmail.com" },
  { label: "tomeqtk@gmail.com", value: "tomeqtk@gmail.com" },
  { label: "drwal@example.pl", value: "drwal@example.pl" },
  { label: "example.email3@email.co", value: "example.email3@email.co" },
  { label: "example.email4@email.co", value: "example.email4@email.co" },
];

export const possibleRoles: IRole[] = Array.from({ length: 10 }, (_, i) => ({
  id: preloadedUUIDs.roles[i],
  name: `Role #${i + 1}`,
  description: `Description for Role #${i + 1}`,
  tags: [],
}));

export const possibleScenarios: IScenario[] = Array.from(
  { length: 5 },
  (_, i) => ({
    id: preloadedUUIDs.scenarios[i],
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

    return rolesForScenario.map((role, j) => ({
      id: preloadedUUIDs.scenarioRoles[i * 2 + j],
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
      id: preloadedUUIDs.scenarioItems[i * 2],
      scenarioId: scenario.id,
      name: `Item #${i + 1}`,
      description: `Description for Item #${i + 1}`,
      actions: [],
    },
    {
      id: preloadedUUIDs.scenarioItems[i * 2 + 1],
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
  id: preloadedUUIDs.events[i],
  name: `Event #${i + 1}`,
  date: now(getLocalTimeZone()).add({ days: i + 1 }) as ZonedDateTime,
  status: `${i < 2 ? "active" : i < 10 ? "upcoming" : "historic"}`,
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
  status: "upcoming",
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
