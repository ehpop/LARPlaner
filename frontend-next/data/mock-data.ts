import { getLocalTimeZone, now } from "@internationalized/date";

export const eventsList = [
  {
    id: 1,
    title: "The Enchanted Forest",
    img: "/images/event-1.jpg",
    date: "31.08.2024 12:00",
  },
  {
    id: 2,
    title: "Rise of the Fallen Kingdom",
    img: "/images/event-2.jpg",
    date: "01.09.2024 14:00",
  },
  {
    id: 3,
    title: "Mystery of the Lost Relic",
    img: "/images/event-3.jpg",
    date: "02.09.2024 10:00",
  },
  {
    id: 4,
    title: "Guardians of the Ancient Order",
    img: "/images/event-4.jpg",
    date: "03.09.2024 16:00",
  },
  {
    id: 5,
    title: "The Shadow Conspiracy",
    img: "/images/event-5.jpg",
    date: "04.09.2024 11:00",
  },
  {
    id: 6,
    title: "Battle for the Crimson Throne",
    img: "/images/event-6.jpg",
    date: "05.09.2024 09:00",
  },
  {
    id: 7,
    title: "Whispers in the Dark",
    img: "/images/event-7.jpg",
    date: "06.09.2024 15:00",
  },
  {
    id: 8,
    title: "The Final Prophecy",
    img: "/images/event-8.jpg",
    date: "07.09.2024 13:00",
  },
  {
    id: 9,
    title: "The Great Heist",
    img: "/images/event-9.jpg",
    date: "08.09.2024 18:00",
  },
  {
    id: 10,
    title: "Curse of the Forgotten City",
    img: "/images/event-10.jpg",
    date: "09.09.2024 17:00",
  },
  {
    id: 11,
    title: "Echoes of the Past",
    img: "/images/event-11.jpg",
    date: "10.09.2024 14:00",
  },
  {
    id: 12,
    title: "The Warlord's Return",
    img: "/images/event-12.jpg",
    date: "11.09.2024 10:00",
  },
  {
    id: 13,
    title: "Tales of the Dragon's Lair",
    img: "/images/event-13.jpg",
    date: "12.09.2024 12:00",
  },
  {
    id: 14,
    title: "The Siege of Darkhold",
    img: "/images/event-14.jpg",
    date: "13.09.2024 11:00",
  },
  {
    id: 15,
    title: "Realm of the Firelord",
    img: "/images/event-15.jpg",
    date: "14.09.2024 13:00",
  },
  {
    id: 16,
    title: "The Masquerade of Shadows",
    img: "/images/event-16.jpg",
    date: "15.09.2024 15:00",
  },
  {
    id: 17,
    title: "Journey to the Forgotten Isles",
    img: "/images/event-17.jpg",
    date: "16.09.2024 14:00",
  },
  {
    id: 18,
    title: "The Witching Hour",
    img: "/images/event-18.jpg",
    date: "17.09.2024 20:00",
  },
  {
    id: 19,
    title: "Legends of the Silver Blade",
    img: "/images/event-19.jpg",
    date: "18.09.2024 12:00",
  },
  {
    id: 20,
    title: "The King's Gambit",
    img: "/images/event-20.jpg",
    date: "19.09.2024 16:00",
  },
];

export const roles = [
  "mag",
  "wojownik",
  "złodziej",
  "czarodziej",
  "kapłan",
  "łucznik",
  "tancerz ostrzy",
  "druid",
  "bard",
  "szaman",
];

export const role = {
  name: "Warrior",
  description: "A strong and brave warrior.",
  gmNotes: "Notes for the game master.",
  imageUrl:
    "https://media.mythopedia.com/6cugv2Onrb7n1IDYjJBTmD/e309806f7646daef4b8abb7b0fc19dcc/wizard-name-generator.jpg?w=1280&h=720&fit=crop&crop=top2",
  attributes: [
    { name: "strength", value: 75 },
    { name: "agility", value: 60 },
  ],
  tags: ["Brave", "Impulsive"],
};

export const scenarios = [
  "Scenario 1",
  "Scenario 2",
  "Scenario 3",
  "Scenario 4",
  "Scenario 5",
  "Scenario 6",
  "Scenario 7",
  "Scenario 8",
  "Scenario 9",
  "Scenario 10",
];

export const scenario = {
  name: "Przykładowy Scenariusz",
  description:
    "Opis przykładowego scenariusza, który zawiera szczegóły dotyczące fabuły, tła, oraz celu.",
  roles: [
    { name: "mag", count: 1 },
    { name: "wojownik", count: 2 },
  ],
  items: [
    {
      name: "Magic Sword",
      description: "A powerful sword imbued with magical properties.",
      skills: [
        { name: "Siła", level: 20 },
        { name: "Magia", level: 10 },
      ],
      tags: ["Zwinny", "Mądry", "Odważny"],
    },
    {
      name: "Healing Potion",
      description: "A potion that heals the user's wounds.",
      skills: [
        { name: "Inteligencja", level: 10 },
        { name: "Magia", level: 5 },
      ],
      tags: ["Mądry"],
    },
  ],
};

const event = {
  id: 1,
  title: `Wydarzenie #1`,
  date: now(getLocalTimeZone()),
  location: {
    name: "Politechnika Warszawska",
    address: "plac Politechniki 1, 00-661 Warszawa",
    latitude: 52.22182660273351,
    longitude: 21.0080534251324,
  },
  time: "12:00",
  description: "Przykładowy opis wydarzenia.",
  scenario: "scenario1",
  scenarios: [
    { key: "scenario1", name: "Scenario 1" },
    { key: "scenario2", name: "Scenario 2" },
    { key: "scenario3", name: "Scenario 3" },
  ],
};

export const getEvent = (id: number) => {
  return { ...event, id: id, title: `Wydarzenie #${id}` };
};

export const possibleSkills = [
  "Strength",
  "Agility",
  "Intelligence",
  "Wisdom",
  "Charisma",
  "Dexterity",
  "Constitution",
  "Perception",
];

export const possibleTags = ["Brave", "Impulsive", "Strong", "Quick", "Clever"];

export const possibleRoles: string[] = [
  "Wizard",
  "Warrior",
  "Thief",
  "Sorcerer",
  "Priest",
  "Archer",
  "Blade Dancer",
];

export const possibleScenarios = [
  { key: "scenario1", name: "Scenario 1" },
  { key: "scenario2", name: "Scenario 2" },
  { key: "scenario3", name: "Scenario 3" },
  { key: "scenario4", name: "Scenario 4" },
  { key: "scenario5", name: "Scenario 5" },
  { key: "scenario6", name: "Scenario 6" },
  { key: "scenario7", name: "Scenario 7" },
  { key: "scenario8", name: "Scenario 8" },
  { key: "scenario9", name: "Scenario 9" },
  { key: "scenario10", name: "Scenario 10" },
];
