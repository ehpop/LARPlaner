"use client";

import React from "react";

import EventForm from "@/components/events/event-form";

export default function EventPage({ params }: any) {
  return (
    <div className="w-full flex justify-center">
      <EventForm eventId={params.id} />
    </div>
  );
}
