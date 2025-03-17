import { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { useAuth } from "@/providers/firebase-provider";
import { IEvent } from "@/types/event.types";
import { IScenario, IScenarioRole } from "@/types/scenario.types";
import { IRole } from "@/types/roles.types";
import eventsService from "@/services/events.service";
import scenariosService from "@/services/scenarios.service";
import rolesService from "@/services/roles.service";
import { showErrorMessage } from "@/hooks/utils";

const useUserEventData = ({ id }: { id: string }) => {
  const intl = useIntl();
  const auth = useAuth();

  const [event, setEvent] = useState<IEvent | null>(null);
  const [scenario, setScenario] = useState<IScenario | null>(null);
  const [userScenarioRole, setUserScenarioRole] =
    useState<IScenarioRole | null>(null);
  const [userRole, setUserRole] = useState<IRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEventData = async () => {
      if (auth.loading) {
        return;
      }

      const eventResponse = await eventsService.getById(id);

      if (!eventResponse.success) {
        return showErrorMessage(eventResponse.data);
      }

      setEvent(eventResponse.data);
      const { scenarioId } = eventResponse.data;

      if (!scenarioId) {
        return showErrorMessage(
          intl.formatMessage({
            id: "events.page.display.error.noScenario",
            defaultMessage: "Event has no scenario assigned.",
          }),
        );
      }

      const scenarioResponse = await scenariosService.getById(scenarioId);

      if (!scenarioResponse.success) {
        return showErrorMessage(scenarioResponse.data);
      }
      setScenario(scenarioResponse.data);

      const userEmail = auth.user?.email;
      const assignedRole = eventResponse.data.assignedRoles.find(
        (role) => role.assignedEmail === userEmail,
      );

      if (assignedRole === undefined) {
        return showErrorMessage(
          intl.formatMessage({
            id: "events.page.display.error.noRole",
            defaultMessage: "User has no role assigned to this event.",
          }),
        );
      }

      const userScenarioRole = scenarioResponse.data.roles.find(
        (role) => role.id === assignedRole.scenarioRoleId,
      );

      if (!userScenarioRole) {
        return showErrorMessage("User's role not found in scenario.");
      }

      setUserScenarioRole(userScenarioRole);

      const roleResponse = await rolesService.getById(
        userScenarioRole.roleId as string,
      );

      if (!roleResponse.success) {
        return showErrorMessage(roleResponse.data);
      }

      setUserRole(roleResponse.data);
    };

    loadEventData().finally(() => {
      if (!auth.loading) {
        setLoading(false);
      }
    });
  }, [id, auth.user]);

  return { event, scenario, userScenarioRole, userRole, loading };
};

export default useUserEventData;
