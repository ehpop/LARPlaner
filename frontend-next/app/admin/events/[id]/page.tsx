"use client";

import React from "react";
import { useIntl } from "react-intl";

import EventForm from "@/components/events/event-form";
import LoadingOverlay from "@/components/common/loading-overlay";
import { useEvent } from "@/services/events/useEvents";

export default function EventPage({ params }: any) {
  const resolvedParams = React.use(params) as { id: string };
  const eventId = resolvedParams.id;
  const intl = useIntl();

  const { data: event, isLoading, isError, error } = useEvent(eventId);

  if (isError) {
    return (
      <div className="w-full flex justify-center">
        <p>{error?.message}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex justify-center">
      <LoadingOverlay
        isLoading={isLoading}
        label={intl.formatMessage({
          id: "loading.event",
          defaultMessage: "Loading event...",
        })}
      >
        {event && <EventForm initialEvent={event} />}
      </LoadingOverlay>
    </div>
  );
}
