import { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { showErrorMessage } from "@/hooks/utils";
import eventsService from "@/services/events.service";
import scenariosService from "@/services/scenarios.service";
import { IEvent } from "@/types/event.types";
import { IScenario } from "@/types/scenario.types";

/**
 * Hook for getting event and scenario data for a specific game session
 */
const useEventForGame = ({ gameId }: { gameId: string }) => {
  const intl = useIntl();
  const [event, setEvent] = useState<IEvent | null>(null);
  const [scenario, setScenario] = useState<IScenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEventData = async () => {
      if (!gameId) {
        setError(
          intl.formatMessage({
            id: "hooks.useEventForGame.error.noGameId",
            defaultMessage: "No game ID provided.",
          }),
        );
        setLoading(false);

        return;
      }

      try {
        const response = await eventsService.getByGameId(gameId);

        if (!response.success) {
          const errorMessage = intl.formatMessage({
            id: "hooks.useEventForGame.error.failedToLoadEventData",
            defaultMessage: "Failed to load event data",
          });

          setError(errorMessage);
          showErrorMessage(errorMessage);

          return;
        }

        setEvent(response.data);

        const scenarioId = response.data.scenarioId;

        if (!scenarioId) {
          const errorMessage = intl.formatMessage({
            id: "hooks.useEventForGame.error.failedToLoadScenarioData",
            defaultMessage: "Failed to load scenario data",
          });

          setError(errorMessage);
          showErrorMessage(errorMessage);

          return;
        }

        const scenarioResponse = await scenariosService.getById(
          scenarioId as string,
        );

        if (!scenarioResponse.success) {
          const errorMessage = intl.formatMessage({
            id: "hooks.useEventForGame.error.failedToLoadScenarioData",
            defaultMessage: "Failed to load scenario data",
          });

          setError(errorMessage);
          showErrorMessage(errorMessage);
        }

        setScenario(scenarioResponse.data as IScenario);
      } catch (err) {
        const errorMessage = intl.formatMessage({
          id: "hooks.useEventForGame.error.failedToLoadEventData",
          defaultMessage: "Failed to load event data",
        });

        setError(errorMessage);
        showErrorMessage(
          err instanceof Error ? err.message : "Failed to load event data",
        );
      } finally {
        setLoading(false);
      }
    };

    loadEventData().then(() => {});
  }, [gameId, intl]);

  return { event, scenario, loading, error };
};

export default useEventForGame;
