"use client";

import Event from "@/components/events/event";
import { getEvent } from "@/data/mock-data";

const UserEventPage = ({ params }: any) => {
  const event = getEvent(params.id);
  const displayedEvent = {
    id: params.id,
    title: event.title,
    img: `/images/event-${params.id}.jpg`,
    date: event.date.toDate().toDateString(),
  };

  return (
    <div>
      <Event event={displayedEvent} />
    </div>
  );
};

export default UserEventPage;
