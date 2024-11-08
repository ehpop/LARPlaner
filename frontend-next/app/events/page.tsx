"use client";

import { useIntl } from "react-intl";

import { eventsList as list } from "@/services/mock/mock-data";
import EventsDisplay from "@/components/events/events-display";

const EventsPage = () => {
  const intl = useIntl();

  return (
    <div className="space-y-5">
      <EventsDisplay
        list={[]}
        title={intl.formatMessage({
          id: "events.page.display.title.now",
          defaultMessage: "Now events",
        })}
      />
      <EventsDisplay
        list={list}
        title={intl.formatMessage({
          id: "events.page.display.title.future",
          defaultMessage: "Future events",
        })}
      />
      <EventsDisplay
        list={list.slice(4, 7)}
        title={intl.formatMessage({
          id: "events.page.display.title.previous",
          defaultMessage: "Previous events",
        })}
      />
    </div>
  );
};

export default EventsPage;
