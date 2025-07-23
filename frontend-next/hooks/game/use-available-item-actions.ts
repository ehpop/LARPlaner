import { useCallback, useEffect, useState } from "react";

import { IGameRoleState } from "@/types/game.types";
import { IAction, IScenarioItem } from "@/types/scenario.types";
import gameService from "@/services/game.service";

export const useAvailableItemActions = (
  userId: IGameRoleState["id"],
  itemId: IScenarioItem["id"],
) => {
  const [actions, setActions] = useState<IAction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItemActions = useCallback(async () => {
    if (!userId || !itemId) {
      setActions([]);

      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await gameService.getAvailableItemActionsForUser(
        userId,
        itemId,
      );

      if (res.success) {
        setActions(res.data);
      } else {
        setError(res.data || "Failed to fetch item actions.");
      }
    } catch (err) {
      setError(err as string);
      setActions([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId, itemId]);

  useEffect(() => {
    fetchItemActions();
  }, [fetchItemActions]);

  return {
    actions,
    isLoading,
    error,
    refetch: fetchItemActions,
  };
};
