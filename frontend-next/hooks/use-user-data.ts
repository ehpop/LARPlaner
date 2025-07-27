import { useEffect, useMemo } from "react";
import { useIntl } from "react-intl";

import { useAuth } from "@/providers/firebase-provider";
import useEventAndScenario from "@/hooks/event/use-event";
import { useRole } from "@/services/roles/useRoles";
import { showErrorMessage } from "@/hooks/utils";
import { IEvent } from "@/types/event.types";

const useUserEventData = (id: IEvent["id"]) => {
  const intl = useIntl();
  const { user, loading: authLoading } = useAuth();

  const {
    event,
    scenario,
    loading: eventAndScenarioLoading,
  } = useEventAndScenario(id);

  const assignedRole = useMemo(() => {
    if (!event || !user?.email) return null;

    return event.assignedRoles.find(
      (role) => role.assignedEmail === user.email,
    );
  }, [event, user?.email]);

  const userScenarioRole = useMemo(() => {
    if (!scenario || !assignedRole) return null;

    return scenario.roles.find(
      (role) => role.id === assignedRole.scenarioRoleId,
    );
  }, [scenario, assignedRole]);

  const {
    data: userRole,
    isLoading: roleLoading,
    error: roleError,
  } = useRole(userScenarioRole?.roleId);

  const loading = authLoading || eventAndScenarioLoading || roleLoading;

  useEffect(() => {
    if (loading) {
      return;
    }

    if (roleError) {
      showErrorMessage(roleError.message);

      return;
    }

    if (event && scenario) {
      if (!assignedRole) {
        showErrorMessage(
          intl.formatMessage({
            id: "events.page.display.error.noRole",
            defaultMessage: "User has no role assigned to this event.",
          }),
        );
      } else if (!userScenarioRole) {
        showErrorMessage(
          intl.formatMessage({
            id: "events.page.display.error.noRole",
            defaultMessage: "User's role not found in scenario.",
          }),
        );
      }
    }
  }, [
    loading,
    event,
    scenario,
    assignedRole,
    userScenarioRole,
    roleError,
    intl,
  ]);

  return {
    event,
    scenario,
    userScenarioRole,
    userRole,
    loading,
    error: roleError,
  };
};

export default useUserEventData;
