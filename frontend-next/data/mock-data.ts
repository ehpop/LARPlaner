import { getLocalTimeZone, now } from "@internationalized/date";

import {
  IEvent,
  IEventList,
  IRole,
  IRoleList,
  IScenario,
  IScenarioItem,
  IScenarioItemList,
  IScenarioList,
  IScenarioRole,
  IScenarioRoleList,
  ISkill,
  ITag,
} from "@/types";

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
  imageUrl:
    "https://media.mythopedia.com/6cugv2Onrb7n1IDYjJBTmD/e309806f7646daef4b8abb7b0fc19dcc/wizard-name-generator.jpg?w=1280&h=720&fit=crop&crop=top2",
  tags: ["Brave", "Impulsive"],
};

export const emptyRole: IRole = {
  id: null,
  name: "",
  description: "",
  imageUrl: "",
  tags: [],
};

export const exampleScenarioRole: IScenarioRole = {
  id: 1,
  scenarioId: 1,
  roleId: 1,
  name: "Warrior",
  description: "A strong and brave warrior.",
  gmNotes: "Notes for the game master.",
};

export const emptyScenarioRole: IScenarioRole = {
  id: null,
  scenarioId: null,
  roleId: null,
  name: "",
  description: "",
  gmNotes: "",
};

export const possibleScenarioRoles: IScenarioRoleList = [
  { ...exampleScenarioRole, id: 1, scenarioId: 1, roleId: 1, name: "Warrior" },
  { ...exampleScenarioRole, id: 2, scenarioId: 1, roleId: 2, name: "Mage" },
  { ...exampleScenarioRole, id: 3, scenarioId: 1, roleId: 3, name: "Rogue" },
  { ...exampleScenarioRole, id: 4, scenarioId: 1, roleId: 4, name: "Cleric" },
  { ...exampleScenarioRole, id: 5, scenarioId: 1, roleId: 5, name: "Bard" },
  { ...exampleScenarioRole, id: 6, scenarioId: 1, roleId: 6, name: "Druid" },
  {
    ...exampleScenarioRole,
    id: 7,
    scenarioId: 1,
    roleId: 7,
    name: "Barbarian",
  },
  { ...exampleScenarioRole, id: 8, scenarioId: 1, roleId: 8, name: "Monk" },
  { ...exampleScenarioRole, id: 9, scenarioId: 1, roleId: 9, name: "Paladin" },
  { ...exampleScenarioRole, id: 10, scenarioId: 1, roleId: 10, name: "Ranger" },
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
  id: 1,
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
  roles: [
    {
      id: 1,
      scenarioId: 1,
      roleId: 1,
      name: "Mag",
      description: "Potężny czarodziej, który włada magią.",
      gmNotes: "Notatki dla mistrza gry.",
    },
    {
      id: 2,
      scenarioId: 1,
      roleId: 2,
      name: "Wojownik",
      description: "Silny i odważny wojownik.",
      gmNotes: "Notatki dla mistrza gry.",
    },
  ] as IScenarioRoleList,
  items: [
    {
      name: "Magic Sword",
      description: "A powerful sword imbued with magical properties.",
      requiredTags: [
        { key: "agile", name: "Agile" },
        { key: "wise", name: "Wise" },
        { key: "brave", name: "Brave" },
      ] as ITag[],
    },
    {
      name: "Healing Potion",
      description: "A potion that heals the user's wounds.",
      requiredTags: [{ key: "strong", name: "Strong" }] as ITag[],
    },
  ] as IScenarioItemList,
};

export const possibleScenarioItems: IScenarioItemList = [
  { ...exampleScenarioItem, id: 1, name: "Magic Sword" },
  { ...exampleScenarioItem, id: 2, name: "Healing Potion" },
];

export const emptyEvent: IEvent = {
  id: null,
  title: "",
  img: "",
  date: now(getLocalTimeZone()),
  location: {
    name: "",
    address: "",
    latitude: 0,
    longitude: 0,
  },
  description: "",
  scenarioId: null,
  assignedRoles: [],
};

export const exampleEvent: IEvent = {
  id: 1,
  title: `Wydarzenie #1`,
  date: now(getLocalTimeZone()),
  img: "/images/event-1.jpg",
  location: {
    name: "Gmach Główny Politechniki Warszawskiej",
    address: "plac Politechniki 1, 00-661 Warszawa",
    latitude: 52.220738829777886,
    longitude: 21.009989954884936,
  },
  description: "Przykładowy opis wydarzenia.",
  scenarioId: 1,
  assignedRoles: [
    {
      scenarioRoleId: 1,
      assignedEmail: userEmails[0].value,
    },
    {
      scenarioRoleId: 2,
      assignedEmail: userEmails[1].value,
    },
  ],
};

export const getEvent = (id: number): IEvent => {
  return {
    ...exampleEvent,
    id: id,
    title: `Wydarzenie #${id}`,
    img: `/images/event-${id}.jpg`,
  };
};

export const getScenario = (id: number): IScenario => {
  return {
    ...exampleScenario,
    id: id,
    name: `Scenario ${id}`,
  };
};

export const getRole = (id: number): IRole => {
  return {
    ...exampleRole,
    id: id,
    name: `Role ${id}`,
  };
};

export const eventsList: IEventList = Array.from({ length: 20 }, (_, i) =>
  getEvent(i + 1),
);

export const possibleScenarios: IScenarioList = Array.from(
  { length: 5 },
  (_, i) => getScenario(i + 1),
);
