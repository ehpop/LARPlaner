"use client";

import { useIntl } from "react-intl";

import LoadingOverlay from "@/components/common/loading-overlay";
import EventsDisplayAdmin from "@/components/events/events-display-admin";
import { useEvents } from "@/services/events/useEvents";

function EventsPage() {
  const intl = useIntl();

  const { data: events, isLoading, isError, error } = useEvents();

  if (isError) {
    return (
      <div className="w-full flex justify-center">
        <p>{error?.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <LoadingOverlay
        isLoading={isLoading}
        label={intl.formatMessage({
          defaultMessage: "Loading events...",
          id: "admin.events.loading",
        })}
      >
        <EventsDisplayAdmin eventsList={events || []} />
      </LoadingOverlay>
    </div>
  );
}

export default EventsPage;
