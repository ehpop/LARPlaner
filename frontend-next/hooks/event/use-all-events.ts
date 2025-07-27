import { useMemo } from "react";

import { useEvents } from "@/services/events/useEvents";

const useAllEvents = (assignedEmail?: string, eventStatus?: string) => {
  const { data: allEvents, isLoading, error } = useEvents();

  const filteredEvents = useMemo(() => {
    if (!allEvents) {
      return [];
    }

    let events = allEvents;

    if (assignedEmail) {
      events = events.filter((e) =>
        e.assignedRoles.some(
          (assignedRole) => assignedRole.assignedEmail === assignedEmail,
        ),
      );
    }

    if (eventStatus) {
      events = events.filter((e) => e.status === eventStatus);
    }

    return events;
  }, [allEvents, assignedEmail, eventStatus]);

  return { events: filteredEvents, loading: isLoading, error };
};

export default useAllEvents;
