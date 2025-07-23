import { useCallback, useEffect, useState } from "react";

import gameService from "@/services/game.service";
import { IAction } from "@/types/scenario.types";

export const useAvailableActions = (params: any) => {
  const {
    isModalOpen = false,
    event,
    scenario,
    userRole,
    userScenarioRole,
    userRoleState,
  } = params || {};

  const [actions, setActions] = useState<IAction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!userRoleState?.id) {
      setActions([]);

      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await gameService.getAvailableActionsForUser(
        userRoleState.id,
      );

      if (res.success) {
        setActions(res.data);
      } else {
        setError(res.data || "Failed to fetch available actions.");
      }
    } catch (err) {
      setError(err as string);
      setActions([]);
    } finally {
      setIsLoading(false);
    }
  }, [userRoleState?.id]);

  useEffect(() => {
    const shouldFetch =
      isModalOpen && event && scenario && userRole && userScenarioRole;

    if (shouldFetch) {
      fetchData();
    } else {
      setActions([]);
    }
  }, [isModalOpen, event, scenario, userRole, userScenarioRole, fetchData]);

  return {
    actions,
    isLoading,
    error,
    refetch: fetchData,
  };
};
