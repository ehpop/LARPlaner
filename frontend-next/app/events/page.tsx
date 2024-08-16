"use client";

import {EventsDisplay} from "@/components/events/events-display";

const list = [
    {
        id: 1,
        title: "Wydarzenie #1",
        img: "/images/event-1.jpg",
        date: "31.08.2024 12:00",
    },
    {
        id: 2,
        title: "Wydarzenie #2",
        img: "/images/event-2.jpg",
        date: "31.08.2024 12:00",
    },
    {
        id: 3,
        title: "Wydarzenie #3",
        img: "/images/event-3.jpg",
        date: "31.08.2024 12:00",
    },
    {
        id: 4,
        title: "Wydarzenie #4",
        img: "/images/event-4.jpg",
        date: "31.08.2024 12:00",
    },
];

function EventsPage() {
    const multiplyList = (list: any, multiplier: number) => {
        let newList: any = [];
        for (let i = 0; i < multiplier; i++) {
            newList = newList.concat(structuredClone(list));
        }

        for (let i = 4; i < newList.length; i++) {
            newList[i].id = Math.ceil(Math.random() * 1_000_000).toFixed(0);
        }

        return newList;
    }

    let newList = multiplyList(list, 3);

    return (
        <div>
            <EventsDisplay list={[]} title="Aktualne wydarzenia"/>
            <EventsDisplay list={newList} title="Nadchodzące wydarzenia"/>
            <EventsDisplay list={list} title="Wydarzenia historyczne"/>
        </div>
    );
}

export default EventsPage;
