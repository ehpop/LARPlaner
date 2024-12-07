import { getLocalTimeZone, now, ZonedDateTime } from "@internationalized/date";
import { uuidv4 } from "@firebase/util";

import { IEvent, IEventList, ISkill } from "@/types/event.types";
import { IRole, IRoleList } from "@/types/roles.types";
import {
  IScenario,
  IScenarioAction,
  IScenarioItem,
  IScenarioItemAction,
  IScenarioItemList,
  IScenarioList,
  IScenarioRole,
  IScenarioRoleList,
} from "@/types/scenario.types";
import { ITag } from "@/types/tags.types";

export const possibleSkills: ISkill[] = [
  { key: "strength", name: "Strength" },
  { key: "agility", name: "Agility" },
  { key: "intelligence", name: "Intelligence" },
  { key: "magic", name: "Magic" },
  { key: "wisdom", name: "Wisdom" },
  { key: "charisma", name: "Charisma" },
  { key: "dexterity", name: "Dexterity" },
  { key: "constitution", name: "Constitution" },
];

export const possibleTags: ITag[] = [];

export const userEmails = [
  { label: "example.email@email.co", value: "example.email@email.co" },
  { label: "example.email1@email.co", value: "example.email1@email.co" },
  { label: "example.email2@email.co", value: "example.email2@email.co" },
  { label: "example.email3@email.co", value: "example.email3@email.co" },
  { label: "example.email4@email.co", value: "example.email4@email.co" },
];

export const exampleRole: IRole = {
  id: 1,
  name: "Warrior",
  description: "A strong and brave warrior.",
  tags: [] as ITag[],
};

export const emptyRole: IRole = {
  id: null,
  name: "",
  description: "",
  tags: [],
};

export const exampleScenarioRole: IScenarioRole = {
  id: uuidv4(),
  scenarioId: 1,
  roleId: 1,
  descriptionForGM: "Notatki dla mistrza gry.",
  descriptionForOwner: "Notatki dla właściciela postaci.",
  descriptionForOthers: "Notatki dla innych graczy.",
};

export const emptyScenarioRole: IScenarioRole = {
  id: null,
  scenarioId: null,
  roleId: null,
  descriptionForGM: "",
  descriptionForOwner: "",
  descriptionForOthers: "",
};

export const possibleScenarioRoles: IScenarioRoleList = [
  {
    id: uuidv4(),
    scenarioId: 1,
    roleId: 1,
    descriptionForGM: "Notatki dla mistrza gry.",
    descriptionForOwner: "Notatki dla właściciela postaci.",
    descriptionForOthers: "Notatki dla innych graczy.",
  },
  {
    id: uuidv4(),
    scenarioId: 1,
    roleId: 2,
    descriptionForGM: "Notatki dla mistrza gry.",
    descriptionForOwner: "Notatki dla właściciela postaci.",
    descriptionForOthers: "Notatki dla innych graczy.",
  },
  { ...exampleScenarioRole, id: uuidv4(), scenarioId: 1, roleId: 3 },
  { ...exampleScenarioRole, id: uuidv4(), scenarioId: 1, roleId: 4 },
  { ...exampleScenarioRole, id: uuidv4(), scenarioId: 1, roleId: 5 },
  { ...exampleScenarioRole, id: uuidv4(), scenarioId: 1, roleId: 6 },
  {
    ...exampleScenarioRole,
    id: uuidv4(),
    scenarioId: 1,
    roleId: 7,
  },
  { ...exampleScenarioRole, id: uuidv4(), scenarioId: 1, roleId: 8 },
  { ...exampleScenarioRole, id: uuidv4(), scenarioId: 1, roleId: 9 },
  { ...exampleScenarioRole, id: uuidv4(), scenarioId: 1, roleId: 10 },
];

export const possibleScenarioItems: IScenarioItemList = [
  {
    id: uuidv4(),
    scenarioId: 1,
    name: "Magic Sword",
    description: "A powerful sword imbued with magical properties.",
    actions: [
      {
        id: uuidv4(),
        name: "Akcja #1",
        description: "Opis akcji #1",
        tagsToRemoveOnSuccess: [
          {
            id: uuidv4(),
            value: "tag do usunięcia",
          },
        ] as ITag[],
        tagsToApplyOnSuccess: [
          {
            id: uuidv4(),
            value: "tag do dodania",
          },
        ] as ITag[],
        tagsToApplyOnFailure: [
          {
            id: uuidv4(),
            value: "tag do dodania",
          },
        ] as ITag[],
        requiredTagsToDisplay: [
          {
            id: uuidv4(),
            value: "tag wymagany do wyświetlenia",
          },
        ] as ITag[],
        requiredTagsToSucceed: [
          {
            id: uuidv4(),
            value: "tag wymagany do sukcesu",
          },
        ] as ITag[],
      } as IScenarioItemAction,
      {
        id: uuidv4(),
        name: "Akcja #2",
        description: "Opis akcji #2",
        tagsToRemoveOnSuccess: [
          {
            id: uuidv4(),
            value: "tag do usunięcia",
          },
        ] as ITag[],
        tagsToApplyOnSuccess: [
          {
            id: uuidv4(),
            value: "tag do dodania",
          },
        ] as ITag[],
        tagsToApplyOnFailure: [
          {
            id: uuidv4(),
            value: "tag do dodania",
          },
        ] as ITag[],
        requiredTagsToDisplay: [
          {
            id: uuidv4(),
            value: "tag wymagany do wyświetlenia",
          },
        ] as ITag[],
        requiredTagsToSucceed: [
          {
            id: uuidv4(),
            value: "tag wymagany do sukcesu",
          },
        ] as ITag[],
      } as IScenarioItemAction,
    ] as IScenarioItemAction[],
  },
  {
    id: uuidv4(),
    scenarioId: 1,
    name: "Healing Potion",
    description: "A potion that heals the user's wounds.",
    actions: [] as IScenarioItemAction[],
  },
];

export const possibleRoles: IRoleList = [
  { ...exampleRole, id: 1, name: "Warrior" },
  { ...exampleRole, id: 2, name: "Mage" },
  { ...exampleRole, id: 3, name: "Rogue" },
  { ...exampleRole, id: 4, name: "Cleric" },
  { ...exampleRole, id: 5, name: "Bard" },
  { ...exampleRole, id: 6, name: "Druid" },
  { ...exampleRole, id: 7, name: "Barbarian" },
  { ...exampleRole, id: 8, name: "Monk" },
  { ...exampleRole, id: 9, name: "Paladin" },
  { ...exampleRole, id: 10, name: "Ranger" },
];

export const exampleScenarioItem: IScenarioItem = {
  id: uuidv4(),
  scenarioId: 1,
  name: "Magic Sword",
  description: "A powerful sword imbued with magical properties.",
  actions: [] as IScenarioItemAction[],
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
  roles: [] as IScenarioRoleList,
  items: [] as IScenarioItemList,
  actions: [] as IScenarioAction[],
  tags: [] as ITag[],
};

export const exampleScenario: IScenario = {
  id: 1,
  name: "Przykładowy Scenariusz",
  description:
    "Opis przykładowego scenariusza, który zawiera szczegóły dotyczące fabuły, tła, oraz celu.",
  roles: possibleScenarioRoles.slice(0, 2),
  items: possibleScenarioItems,
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

export const exampleEvent: IEvent = {
  id: 1,
  name: `Wydarzenie #1`,
  date: now(getLocalTimeZone()).add({ days: 1 }),
  img: "/images/event-1.jpg",
  description: "Przykładowy opis wydarzenia.",
  scenarioId: 1,
  assignedRoles: [
    {
      scenarioRoleId: possibleScenarioRoles[0].roleId,
      assignedEmail: userEmails[0].value,
    },
    {
      scenarioRoleId: possibleScenarioRoles[1].roleId,
      assignedEmail: userEmails[1].value,
    },
  ],
};

export const eventsList: IEventList = Array.from({ length: 20 }, (_, i) => ({
  ...exampleEvent,
  id: i + 1,
  name: `Wydarzenie #${i + 1}`,
  img: `/images/event-${i + 1}.jpg`,
  date: now(getLocalTimeZone()).add({ days: i + 1 }) as ZonedDateTime,
}));

export const possibleScenarios: IScenarioList = Array.from(
  { length: 5 },
  (_, i) => ({
    ...exampleScenario,
    id: i + 1,
    name: `Scenario #${i + 1}`,
    description: `Description of scenario #${i + 1}`,
    roles: possibleScenarioRoles
      .slice((i - 1) * 2, (i - 1) * 2 + 2)
      .map((role) => ({
        ...role,
        scenarioId: i + 1,
      })),
  }),
);

export const getEvent = (id: number): IEvent => {
  return eventsList[id % eventsList.length];
};

export const getScenario = (id: number): IScenario => {
  return possibleScenarios[id % possibleScenarios.length];
};

export const getRole = (id: number): IRole => {
  return possibleRoles[id % possibleRoles.length];
};
