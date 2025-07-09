import { useEffect, useState } from "react";

import { IEvent } from "@/types/event.types";
import eventsService from "@/services/events.service";
import { showErrorMessage } from "@/hooks/utils";

const useAllEvents = (assignedEmail?: string, eventStatus?: string) => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEventData = async () => {
      const eventResponse = await eventsService.getAll();

      if (!eventResponse.success) {
        return showErrorMessage(eventResponse.data);
      }

      let events = eventResponse.data;

      if (assignedEmail) {
        events = events.filter(
          (e) =>
            e.assignedRoles.findIndex(
              (assignedRole) => assignedRole.assignedEmail === assignedEmail,
            ) !== -1,
        );
      }

      if (eventStatus) {
        events = events.filter((e) => e.status === eventStatus);
      }

      setEvents(events);
    };

    loadEventData().finally(() => setLoading(false));

    return () => {
      setLoading(true);
    };
  }, []);

  return { events, loading };
};

export default useAllEvents;
