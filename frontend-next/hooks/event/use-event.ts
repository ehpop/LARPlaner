import { useIntl } from "react-intl";
import { useEffect, useState } from "react";

import { useEvent } from "@/services/events/useEvents";
import { useScenario } from "@/services/scenarios/useScenarios";
import { showErrorMessage } from "@/hooks/utils";
import { IEvent } from "@/types/event.types";

const useEventAndScenario = (id: IEvent["id"]) => {
  const intl = useIntl();
  const [refetch, setRefetch] = useState(() => () => {});
  const {
    data: event,
    isLoading: eventLoading,
    error: eventError,
    refetch: refetchEvent,
  } = useEvent(id);
  const {
    data: scenario,
    isLoading: scenarioLoading,
    error: scenarioError,
    refetch: refetchScenario,
  } = useScenario(event?.scenarioId);

  const loading = eventLoading || scenarioLoading;

  useEffect(() => {
    if (loading) {
      return;
    }

    if (eventError) {
      showErrorMessage(eventError.message);
    } else if (scenarioError) {
      showErrorMessage(scenarioError.message);
    } else if (event && !event.scenarioId) {
      showErrorMessage(
        intl.formatMessage({
          id: "events.page.display.error.noScenario",
          defaultMessage: "Event has no scenario assigned.",
        }),
      );
    }
  }, [event, eventError, scenarioError, loading]);

  return { event, scenario, loading };
};

export default useEventAndScenario;
