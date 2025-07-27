import { useEffect, useMemo } from "react";
import { useIntl } from "react-intl";

import { useAuth } from "@/providers/firebase-provider";
import useEventForGame from "@/hooks/use-event-for-game";
import { useRole } from "@/services/roles/useRoles";
import { showErrorMessage } from "@/hooks/utils";
import { IScenarioRole } from "@/types/scenario.types";
import { IRole } from "@/types/roles.types";

/**
 * Hook for getting all necessary data for a game session including event, scenario, and user role data,
 * refactored to use compositional hooks.
 */
const useGameUserData = ({ gameId }: { gameId: string }) => {
  const intl = useIntl();
  const { user, loading: authLoading } = useAuth();

  const {
    event,
    scenario,
    loading: eventAndScenarioLoading,
    error: eventAndScenarioError,
  } = useEventForGame({ gameId });

  const userScenarioRole = useMemo<IScenarioRole | null>(() => {
    if (!event || !scenario || !user?.email) {
      return null;
    }
    const assignedRole = event.assignedRoles.find(
      (role) => role.assignedEmail === user.email,
    );

    if (!assignedRole) {
      return null;
    }

    return (
      scenario.roles.find((role) => role.id === assignedRole.scenarioRoleId) ||
      null
    );
  }, [event, scenario, user?.email]);

  const {
    data: userRole,
    isLoading: roleLoading,
    error: roleError,
  } = useRole(userScenarioRole?.roleId);

  const loading = authLoading || eventAndScenarioLoading || roleLoading;

  const error = useMemo(() => {
    if (loading) return null;
    if (eventAndScenarioError) return eventAndScenarioError;
    if (roleError) return roleError.message;

    if (event && user?.email && !userScenarioRole) {
      const isAssigned = event.assignedRoles.some(
        (role) => role.assignedEmail === user.email,
      );

      if (isAssigned) {
        return intl.formatMessage({
          id: "hooks.use-game-user-data.user.usersRoleNotFoundInScenario",
          defaultMessage: "User's role not found in scenario",
        });
      }

      return intl.formatMessage({
        id: "hooks.use-game-user-data.user.is.not.assigned.to.this.event",
        defaultMessage: "User is not assigned to this event",
      });
    }

    if (userScenarioRole && !userScenarioRole.roleId) {
      return intl.formatMessage({
        id: "hooks.use-game-user-data.scenarioRoleDoesntHaveRoleIdAssigned",
        defaultMessage: "Scenario Role doesn't have role id assiged",
      });
    }

    return null;
  }, [
    loading,
    event,
    scenario,
    user?.email,
    userScenarioRole,
    eventAndScenarioError,
    roleError,
    intl,
  ]);

  useEffect(() => {
    if (error) {
      showErrorMessage(error);
    }
  }, [error]);

  return {
    event,
    scenario,
    userScenarioRole,
    userRole: userRole as IRole | null,
    loading,
    error,
  };
};

export default useGameUserData;
