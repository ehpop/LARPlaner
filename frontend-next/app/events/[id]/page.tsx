"use client";

import Event from "@/components/events/event";
import { getEvent } from "@/data/mock-data";

const UserEventPage = ({ params }: any) => {
  const event = getEvent(params.id);

  return (
    <div>
      <Event event={event} />
    </div>
  );
};

export default UserEventPage;
