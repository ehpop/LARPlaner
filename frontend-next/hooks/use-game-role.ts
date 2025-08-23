import { useMemo } from "react";

import { useAuth } from "@/providers/firebase-provider";
import { IGameSession } from "@/types/game.types";
import useEventAndScenario from "@/hooks/event/use-event";
import { useGameSession } from "@/services/game/useGames";

/**
 * Hook for getting the current user's role in the game.
 */
const useGameRole = ({
  gameId,
  eventId,
}: {
  gameId: IGameSession["id"];
  eventId: IGameSession["eventId"];
}) => {
  const { user, loading: authLoading } = useAuth();
  const {
    data: game,
    isLoading: isGameLoading,
    isError: isGameError,
  } = useGameSession(gameId);
  const {
    event,
    scenario,
    loading: isEventAndScenarioLoading,
  } = useEventAndScenario(eventId);

  const { gameRoleState, scenarioRole } = useMemo(() => {
    if (!game || !event || !scenario || !user || isGameError) {
      return { gameRoleState: null, scenarioRole: null };
    }

    const foundGameRoleState =
      game.assignedRoles.find((role) => role.assignedEmail === user.email) ??
      null;

    const assignedEventRole = event.assignedRoles.find(
      (role) => role.assignedEmail === user.email,
    );

    const foundScenarioRole = assignedEventRole
      ? (scenario.roles.find(
          (role) => role.id === assignedEventRole.scenarioRoleId,
        ) ?? null)
      : null;

    return {
      gameRoleState: foundGameRoleState,
      scenarioRole: foundScenarioRole,
    };
  }, [game, event, scenario, user]);

  const role = useMemo(() => {
    if (!scenarioRole) return null;

    return scenarioRole.role;
  }, [scenarioRole]);

  const loading = authLoading || isGameLoading || isEventAndScenarioLoading;

  return { role: role ?? null, scenarioRole, gameRoleState, loading };
};

export default useGameRole;
