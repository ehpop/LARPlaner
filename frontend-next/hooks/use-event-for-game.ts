import { useEventForGameId } from "@/services/events/useEvents";
import useEventAndScenario from "@/hooks/event/use-event";

/**
 * Hook for getting event and scenario data for a specific game session
 */
const useEventForGame = ({ gameId }: { gameId: string }) => {
  const {
    data: eventData,
    isLoading: isEventLoading,
    error: eventError,
  } = useEventForGameId(gameId);

  const {
    event,
    scenario,
    loading: isEventAndScenarioLoading,
  } = useEventAndScenario(eventData?.id);

  const loading = isEventLoading || isEventAndScenarioLoading;

  const error = eventError ? eventError.message : null;

  return { event, scenario, loading, error };
};

export default useEventForGame;
