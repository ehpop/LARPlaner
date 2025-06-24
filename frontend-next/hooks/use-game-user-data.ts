import { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { showErrorMessage } from "@/hooks/utils";
import { useAuth } from "@/providers/firebase-provider";
import eventsService from "@/services/events.service";
import rolesService from "@/services/roles.service";
import scenariosService from "@/services/scenarios.service";
import { IEvent } from "@/types/event.types";
import { IRole } from "@/types/roles.types";
import { IScenario, IScenarioRole } from "@/types/scenario.types";

/**
 * Hook for getting all necessary data for a game session including event, scenario, and user role data
 */
const useGameUserData = ({ gameId }: { gameId: string }) => {
  const intl = useIntl();
  const auth = useAuth();

  const [event, setEvent] = useState<IEvent | null>(null);
  const [scenario, setScenario] = useState<IScenario | null>(null);
  const [userScenarioRole, setUserScenarioRole] =
    useState<IScenarioRole | null>(null);
  const [userRole, setUserRole] = useState<IRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGameData = async () => {
      if (auth.loading) {
        return;
      }

      if (!gameId) {
        setError(
          intl.formatMessage({
            id: "hooks.useGameUserData.error.noGameId",
            defaultMessage: "No game ID provided.",
          }),
        );
        setLoading(false);

        return;
      }

      try {
        const eventResponse = await eventsService.getByGameId(gameId);

        if (!eventResponse.success) {
          setError("Failed to load event data");
          showErrorMessage("Failed to load event data");

          return;
        }
        setEvent(eventResponse.data);

        const scenarioId = eventResponse.data.scenarioId;

        if (!scenarioId) {
          setError("Failed to load scenario data");
          showErrorMessage("Failed to load scenario data");

          return;
        }

        const scenarioResponse = await scenariosService.getById(scenarioId);

        if (!scenarioResponse.success) {
          setError("Failed to load scenario data");
          showErrorMessage("Failed to load scenario data");

          return;
        }
        setScenario(scenarioResponse.data);

        const userEmail = auth.user?.email;
        const assignedRole = eventResponse.data.assignedRoles.find(
          (role) => role.assignedEmail === userEmail,
        );

        if (!assignedRole) {
          setError("User is not assigned to this event");
          showErrorMessage("User is not assigned to this event");

          return;
        }

        const foundScenarioRole = scenarioResponse.data.roles.find(
          (role) => role.id === assignedRole.scenarioRoleId,
        );

        if (!foundScenarioRole) {
          setError("User's role not found in scenario");
          showErrorMessage("User's role not found in scenario");

          return;
        }
        setUserScenarioRole(foundScenarioRole);

        if (!foundScenarioRole.roleId) {
          setError("Scenario Role doesn't have role id assigned");
          showErrorMessage("Scenario Role doesn't have role id assigned");

          return;
        }

        const roleResponse = await rolesService.getById(
          foundScenarioRole.roleId,
        );

        if (!roleResponse.success) {
          setError(roleResponse.data);
          showErrorMessage(roleResponse.data);

          return;
        }
        setUserRole(roleResponse.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load game data",
        );
        showErrorMessage(
          err instanceof Error ? err.message : "Failed to load game data",
        );
      } finally {
        setLoading(false);
      }
    };

    loadGameData();
  }, [gameId, auth.user]);

  return { event, scenario, userScenarioRole, userRole, loading, error };
};

export default useGameUserData;
