"use client";

import { useIntl } from "react-intl";
import { useEffect, useState } from "react";

import EventsService from "@/services/events.service";
import LoadingOverlay from "@/components/general/loading-overlay";
import { IEvent } from "@/types/event.types";
import EventsAdminDisplay from "@/components/events/events-admin-display";

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
      <LoadingOverlay isLoading={loading} label={"Loading active events..."}>
        <EventsAdminDisplay
          list={eventsData}
          title={intl.formatMessage({
            id: "events.page.display.title.events",
            defaultMessage: "Events",
          })}
        />
      </LoadingOverlay>
    </div>
  );
}

export default EventsPage;
