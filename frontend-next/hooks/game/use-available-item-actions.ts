import { IGameRoleStateSummary } from "@/types/game.types";
import { IScenarioItem } from "@/types/scenario.types";
import { useAvailableItemActionsForUser } from "@/services/game/useGames";

export const useAvailableItemActions = (
  gameRoleState: IGameRoleStateSummary | undefined,
  itemId: IScenarioItem["id"] | undefined,
) => {
  const {
    data: actions,
    isLoading,
    error,
    refetch,
  } = useAvailableItemActionsForUser(gameRoleState, itemId);

  return {
    actions: actions || [],
    isLoading,
    error: error ? error.message : null,
    refetch,
  };
};
