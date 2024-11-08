"use client";

import { useIntl } from "react-intl";

import { EventsDisplay } from "@/components/events/events-display";
import { eventsList as list } from "@/services/mock/mock-data";

function EventsPage() {
  const intl = useIntl();

  return (
    <div className="space-y-5">
      <EventsDisplay
        isAdmin={true}
        list={[]}
        title={intl.formatMessage({
          id: "events.page.display.title.now",
          defaultMessage: "Now events",
        })}
      />
      <EventsDisplay
        canAddNewEvent={true}
        isAdmin={true}
        list={list}
        title={intl.formatMessage({
          id: "events.page.display.title.future",
          defaultMessage: "Future events",
        })}
      />
      <EventsDisplay
        isAdmin={true}
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
