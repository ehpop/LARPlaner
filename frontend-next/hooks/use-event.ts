import { useIntl } from "react-intl";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { IEvent } from "@/types/event.types";
import { IScenario } from "@/types/scenario.types";
import eventsService from "@/services/events.service";
import scenariosService from "@/services/scenarios.service";

const useEvent = (id: string) => {
  const intl = useIntl();
  const [event, setEvent] = useState<IEvent | null>(null);
  const [scenario, setScenario] = useState<IScenario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEventData = async () => {
      const eventResponse = await eventsService.getById(id);

      if (!eventResponse.success) {
        return showErrorMessage(eventResponse.data);
      }
      setEvent(eventResponse.data);
      const { scenarioId } = eventResponse.data;

      if (!scenarioId) {
        return showErrorMessage(
          intl.formatMessage({
            id: "events.page.display.error.noScenario",
            defaultMessage: "Event has no scenario assigned.",
          }),
        );
      }

      const scenarioResponse = await scenariosService.getById(scenarioId);

      if (!scenarioResponse.success) {
        return showErrorMessage(scenarioResponse.data);
      }

      setScenario(scenarioResponse.data);
    };

    loadEventData().finally(() => setLoading(false));

    return () => {
      setLoading(true);
    };
  }, [id]);

  const showErrorMessage = (message: string | undefined) => {
    toast(
      message ||
        intl.formatMessage({
          id: "events.page.display.error",
          defaultMessage: "An error occurred while fetching event data.",
        }),
      { type: "error" },
    );
  };

  return { event, scenario, loading };
};

export default useEvent;