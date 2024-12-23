"use client";

import { useIntl } from "react-intl";
import { useEffect, useState } from "react";

import { EventsDisplay } from "@/components/events/events-display";
import EventsService from "@/services/events.service";
import LoadingOverlay from "@/components/general/loading-overlay";
import { IEvent } from "@/types/event.types";

function EventsPage() {
  const intl = useIntl();

  const [eventsData, setEventsData] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await EventsService.getAll();

        if (response.success) {
          setEventsData(response.data);
        } else {
          setError("Failed to fetch events");
        }
      } catch (err) {
        setError("An error occurred while fetching events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents().then(() => {});
  }, []);

  if (error) {
    return (
      <div className="w-full flex justify-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <LoadingOverlay isLoading={loading} label={"Loading current events..."}>
        <EventsDisplay
          isAdmin={true}
          list={[]}
          title={intl.formatMessage({
            id: "events.page.display.title.now",
            defaultMessage: "Current events",
          })}
        />
      </LoadingOverlay>
      <LoadingOverlay isLoading={loading} label={"Loading upcoming events..."}>
        <EventsDisplay
          canAddNewEvent={true}
          isAdmin={true}
          list={eventsData}
          title={intl.formatMessage({
            id: "events.page.display.title.future",
            defaultMessage: "Future events",
          })}
        />
      </LoadingOverlay>
      <LoadingOverlay isLoading={loading} label={"Loading past events..."}>
        <EventsDisplay
          isAdmin={true}
          list={eventsData.slice(0, 10)}
          title={intl.formatMessage({
            id: "events.page.display.title.previous",
            defaultMessage: "Previous events",
          })}
        />
      </LoadingOverlay>
    </div>
  );
}

export default EventsPage;
