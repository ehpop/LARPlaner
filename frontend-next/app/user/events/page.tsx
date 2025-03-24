"use client";

import { useIntl } from "react-intl";

import { eventsList as list } from "@/services/mock/mock-data";
import EventsDisplay from "@/components/events/events-display";
import { useAuth } from "@/providers/firebase-provider";

const EventsPage = () => {
  const intl = useIntl();
  const auth = useAuth();

  const userEvents = list.filter(
    (event) =>
      event.assignedRoles.findIndex(
        (assignedRole) => assignedRole.assignedEmail === auth.user?.email,
      ) !== -1,
  );

  return (
    <div className="space-y-5">
      <EventsDisplay
        eventStatus="active"
        list={userEvents.filter((event) => event.status === "active")}
        title={intl.formatMessage({
          id: "events.page.display.title.active",
          defaultMessage: "Active events",
        })}
      />
      <EventsDisplay
        eventStatus="upcoming"
        list={userEvents.filter((event) => event.status === "upcoming")}
        title={intl.formatMessage({
          id: "events.page.display.title.upcoming",
          defaultMessage: "Upcoming events",
        })}
      />
      <EventsDisplay
        eventStatus="historic"
        list={userEvents.filter((event) => event.status === "historic")}
        title={intl.formatMessage({
          id: "events.page.display.title.historic",
          defaultMessage: "Historic events",
        })}
      />
    </div>
  );
};

export default EventsPage;
