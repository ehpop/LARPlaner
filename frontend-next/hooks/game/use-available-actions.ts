import { useAvailableActionsForUser } from "@/services/game/useGames";

export const useAvailableActions = (params: any) => {
  const {
    isModalOpen = false,
    event,
    scenario,
    userRole,
    userScenarioRole,
    userRoleState,
  } = params || {};

  const shouldFetch =
    isModalOpen && event && scenario && userRole && userScenarioRole;

  const {
    data: actions,
    isLoading,
    error,
    refetch,
  } = useAvailableActionsForUser(shouldFetch ? userRoleState : undefined);

  return {
    actions: actions || [],
    isLoading,
    error,
    refetch,
  };
};
