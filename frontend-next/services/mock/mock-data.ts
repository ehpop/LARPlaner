import { getLocalTimeZone, now, ZonedDateTime } from "@internationalized/date";
import { uuidv4 } from "@firebase/util";

import { IEvent, IEventList, ISkill } from "@/types/event.types";
import { IRole, IRoleList, ITag } from "@/types/roles.types";
import {
  IScenario,
  IScenarioItem,
  IScenarioItemList,
  IScenarioList,
  IScenarioRole,
  IScenarioRoleList,
} from "@/types/scenario.types";

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

export const possibleTags: ITag[] = [
  { key: "brave", name: "Brave" },
  { key: "impulsive", name: "Impulsive" },
  { key: "clever", name: "Clever" },
  { key: "wise", name: "Wise" },
  { key: "strong", name: "Strong" },
  { key: "agile", name: "Agile" },
];

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
  tags: [
    { key: "brave", name: "Brave" },
    { key: "strong", name: "Strong" },
  ] as ITag[],
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
    requiredTags: [
      { key: "agile", name: "Agile" },
      { key: "wise", name: "Wise" },
      { key: "brave", name: "Brave" },
    ] as ITag[],
  },
  {
    id: uuidv4(),
    scenarioId: 1,
    name: "Healing Potion",
    description: "A potion that heals the user's wounds.",
    requiredTags: [{ key: "strong", name: "Strong" }] as ITag[],
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
  imageUrl:
    "https://media.mythopedia.com/6cugv2Onrb7n1IDYjJBTmD/e309806f7646daef4b8abb7b0fc19dcc/wizard-name-generator.jpg?w=1280&h=720&fit=crop&crop=top2",
  requiredTags: [
    { key: "agile", name: "Agile" },
    { key: "wise", name: "Wise" },
    { key: "brave", name: "Brave" },
  ] as ITag[],
};

export const emptyScenarioItem: IScenarioItem = {
  id: null,
  scenarioId: null,
  name: "",
  description: "",
  imageUrl: "",
  requiredTags: [] as ITag[],
};

export const emptyScenario: IScenario = {
  id: null,
  name: "",
  description: "",
  roles: [] as IScenarioRoleList,
  items: [] as IScenarioItemList,
};

export const exampleScenario: IScenario = {
  id: 1,
  name: "Przykładowy Scenariusz",
  description:
    "Opis przykładowego scenariusza, który zawiera szczegóły dotyczące fabuły, tła, oraz celu.",
  roles: possibleScenarioRoles.slice(0, 2),
  items: possibleScenarioItems,
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
