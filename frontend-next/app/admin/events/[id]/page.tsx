"use client";

import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import EventForm from "@/components/events/event-form";
import eventsService from "@/services/events.service";
import { IEvent } from "@/types/event.types";
import LoadingOverlay from "@/components/general/loading-overlay";
import { showErrorToastWithTimeout } from "@/utils/toast";

export default function EventPage({ params }: any) {
  const resolvedParams = React.use(params) as { id: string };
  const eventId = resolvedParams.id;
  const intl = useIntl();

  const [eventData, setEventData] = useState<IEvent>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        setError(
          intl.formatMessage({
            id: "events.id.missing",
            defaultMessage: "Event ID is missing",
          }),
        );
        setLoading(false);

        return;
      }
      try {
        const response = await eventsService.getById(eventId);

        if (response.success) {
          setEventData(response.data);
        } else {
          setError(
            response.data ||
              intl.formatMessage({
                id: "events.id.error.default",
                defaultMessage: "An error occurred while fetching event",
              }),
          );
          showErrorToastWithTimeout(
            intl.formatMessage({
              id: "events.id.error.default",
              defaultMessage: "An error occurred while fetching event",
            }),
          );
        }
      } catch (err) {
        setError(
          intl.formatMessage({
            id: "events.id.error.default",
            defaultMessage: "An error occurred while fetching event",
          }),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvent().then(() => {});
  }, [eventId]);

  if (error) {
    return (
      <div className="w-full flex justify-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex justify-center">
      <LoadingOverlay
        isLoading={loading}
        label={intl.formatMessage({
          id: "loading.event",
          defaultMessage: "Loading event...",
        })}
      >
        {eventData && <EventForm initialEvent={eventData} />}
      </LoadingOverlay>
    </div>
  );
}
