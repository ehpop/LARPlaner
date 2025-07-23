"use client";

import { useIntl } from "react-intl";

import EventsDisplay from "@/components/events/events-display";
import { useAuth } from "@/providers/firebase-provider";
import useAllEvents from "@/hooks/event/use-all-events";
import LoadingOverlay from "@/components/common/loading-overlay";

const EventsPage = () => {
  const intl = useIntl();
  const auth = useAuth();

  const { events: userEvents, loading } = useAllEvents(
    auth.user?.email || undefined,
  );

  return (
    <LoadingOverlay
      isLoading={loading}
      label={intl.formatMessage({
        id: "user.events.page.loading",
        defaultMessage: "Loading user events...",
      })}
    >
      <div className="space-y-5">
        <EventsDisplay
          eventStatus="active"
          title={intl.formatMessage({
            id: "events.page.display.title.active",
            defaultMessage: "Active events",
          })}
          userEvents={userEvents}
        />
        <EventsDisplay
          eventStatus="upcoming"
          title={intl.formatMessage({
            id: "events.page.display.title.upcoming",
            defaultMessage: "Upcoming events",
          })}
          userEvents={userEvents}
        />
        <EventsDisplay
          eventStatus="historic"
          title={intl.formatMessage({
            id: "events.page.display.title.historic",
            defaultMessage: "Historic events",
          })}
          userEvents={userEvents}
        />
      </div>
    </LoadingOverlay>
  );
};

export default EventsPage;
