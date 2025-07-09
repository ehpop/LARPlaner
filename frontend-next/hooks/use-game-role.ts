import { useIntl } from "react-intl";
import { useEffect, useState } from "react";

import { useAuth } from "@/providers/firebase-provider";
import { IGameRoleState, IGameSession } from "@/types/game.types";
import { IRole } from "@/types/roles.types";
import { IScenarioRole } from "@/types/scenario.types";
import useGame from "@/hooks/use-game";
import useEvent from "@/hooks/event/use-event";
import { showErrorMessage } from "@/hooks/utils";
import rolesService from "@/services/roles.service";

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
  const intl = useIntl();
  const auth = useAuth();

  const { game } = useGame(gameId);
  const { event, scenario, loading } = useEvent(eventId || "");

  const [role, setRole] = useState<IRole | null>(null);
  const [scenarioRole, setScenarioRole] = useState<IScenarioRole | null>(null);
  const [gameRoleState, setGameRoleState] = useState<IGameRoleState | null>(
    null,
  );
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const loadRole = async () => {
      if (auth.loading || loading) {
        return;
      }

      if (!game || !event || !scenario) {
        return showErrorMessage(
          intl.formatMessage({
            id: "hooks.useGameRole.error.noData",
            defaultMessage: "No game, event or scenario data found.",
          }),
        );
      }

      const userRole = game.assignedRoles.find(
        (role) => role.assignedEmail === auth.user?.email,
      );

      if (!userRole) {
        return showErrorMessage(
          intl.formatMessage({
            id: "hooks.useGameRole.error.noRole",
            defaultMessage: "User is not assigned to this game.",
          }),
        );
      }
      setGameRoleState(userRole);

      const scenarioRoleId = event.assignedRoles.find(
        (role) => role.assignedEmail === auth.user?.email,
      )?.scenarioRoleId;

      if (!scenarioRoleId) {
        return showErrorMessage(
          intl.formatMessage({
            id: "hooks.useGameRole.error.noScenarioRole",
            defaultMessage: "User is not assigned to this scenario.",
          }),
        );
      }

      const foundScenarioRole = scenario.roles.find(
        (role) => role.id === scenarioRoleId,
      );

      if (!foundScenarioRole) {
        return showErrorMessage(
          intl.formatMessage({
            id: "hooks.useGameRole.error.noRole",
            defaultMessage: "User is not assigned to this scenario.",
          }),
        );
      }

      setScenarioRole(foundScenarioRole);

      if (!foundScenarioRole.roleId) {
        return showErrorMessage(
          intl.formatMessage({
            id: "hooks.useGameRole.error.noRoleIdInScenarioRole",
            defaultMessage:
              "Scenario Role doesnt have role id assigned. Please contact with administrator.",
          }),
        );
      }
      const roleResponse = await rolesService.getById(foundScenarioRole.roleId);

      if (!roleResponse.success) {
        return showErrorMessage(roleResponse.data);
      }

      setRole(roleResponse.data);
    };

    loadRole().finally(() => {
      if (!auth.loading) {
        setRoleLoading(false);
      }
    });
  }, [auth.user, gameId, loading]);

  return { role, scenarioRole, gameRoleState, loading: roleLoading };
};

export default useGameRole;
