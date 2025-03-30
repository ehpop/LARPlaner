"use client";

import React, { useEffect, useState } from "react";

import EventForm from "@/components/events/event-form";
import eventsService from "@/services/events.service";
import { IEvent } from "@/types/event.types";
import LoadingOverlay from "@/components/general/loading-overlay";
import { showErrorToastWithTimeout } from "@/utils/toast";

export default function EventPage({ params }: any) {
  const [eventData, setEventData] = useState<IEvent>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventsService.getById(params.id);

        if (response.success) {
          setEventData(response.data);
        } else {
          setError("Failed to fetch event");
          showErrorToastWithTimeout("Failed to fetch event");
        }
      } catch (err) {
        setError("An error occurred while fetching event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent().then(() => {});
  }, []);

  if (error) {
    return (
      <div className="w-full flex justify-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex justify-center">
      <LoadingOverlay isLoading={loading} label={"Loading event..."}>
        {eventData && <EventForm initialEvent={eventData} />}
      </LoadingOverlay>
    </div>
  );
}
