import { IGameRoleState } from "@/types/game.types";
import { IScenarioItem } from "@/types/scenario.types";
import { useAvailableItemActionsForUser } from "@/services/game/useGames";

export const useAvailableItemActions = (
  userId: IGameRoleState["id"] | undefined,
  itemId: IScenarioItem["id"] | undefined,
) => {
  const {
    data: actions,
    isLoading,
    error,
    refetch,
  } = useAvailableItemActionsForUser(userId, itemId);

  return {
    actions: actions || [],
    isLoading,
    error: error ? error.message : null,
    refetch,
  };
};
