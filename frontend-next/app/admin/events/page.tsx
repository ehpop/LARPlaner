"use client";

import { useIntl } from "react-intl";

import { EventsDisplay } from "@/components/events/events-display";

const list = [
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

function EventsPage() {
  const intl = useIntl();

  return (
    <div className="space-y-5">
      <EventsDisplay
        list={[]}
        title={intl.formatMessage({
          id: "events.page.display.title.now",
          defaultMessage: "Now events",
        })}
      />
      <EventsDisplay
        canAddNewEvent={true}
        list={list}
        title={intl.formatMessage({
          id: "events.page.display.title.future",
          defaultMessage: "Future events",
        })}
      />
      <EventsDisplay
        list={list.slice(0, 10)}
        title={intl.formatMessage({
          id: "events.page.display.title.previous",
          defaultMessage: "Previous events",
        })}
      />
    </div>
  );
}

export default EventsPage;
