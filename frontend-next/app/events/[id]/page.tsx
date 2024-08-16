"use client";

import Event from "@/components/events/event";

export default function EventPage({params}: any) {
    const event = {
        id: params.id,
        title: `Wydarzenie #${params.id}`,
        img: `/images/event-${params.id}.jpg`,
        date: "31.08.2024 12:00",
    }

    return <div className="w-full items-center">
        <div
            className="border-small px-5 py-5 my-5 rounded-small border-default-200 dark:border-default-100">
            <p>
                {`Event ${event.id} page`}
            </p>
            <Event event={event}/>
        </div>
    </div>
}
