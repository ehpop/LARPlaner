import { CardBody, CardHeader } from "@heroui/card";
import { Button, Card, CardFooter } from "@heroui/react";
import { FormattedMessage, useIntl } from "react-intl";

import { IScenarioAction, IScenarioItemAction } from "@/types/scenario.types";
import { IGameActionLogSummary, IGameSession } from "@/types/game.types";
import { useAuth } from "@/providers/firebase-provider";
import LoadingOverlay from "@/components/common/loading-overlay";
import { showErrorToastWithTimeout } from "@/utils/toast";
import { usePerformAction } from "@/services/game/useGames";
import { getErrorMessage } from "@/utils/error";

const Action = ({
  game,
  action,
  onActionPerformed,
}: {
  game: IGameSession;
  action: IScenarioAction | IScenarioItemAction;
  onActionPerformed: (actionResult: IGameActionLogSummary) => void;
}) => {
  const auth = useAuth();
  const intl = useIntl();

  const userRole = game.assignedRoles.find(
    (ar) => ar.assignedUserID === auth.user?.uid,
  );

  const { mutate: performAction, isPending } = usePerformAction();

  const handlePerformAction = () => {
    if (!userRole) {
      showErrorToastWithTimeout(
        intl.formatMessage({
          id: "action.userRoleNotFound",
          defaultMessage: "Something went wrong: user role not found.",
        }),
      );

      return;
    }

    performAction(
      {
        id: game.id,
        actionRequest: {
          actionId: action.id,
          performerRoleId: userRole.scenarioRole.id,
          targetItemId: "itemId" in action ? action.itemId : undefined,
        },
      },
      {
        onSuccess: (data) => {
          onActionPerformed(data);
        },
        onError: (error) => {
          showErrorToastWithTimeout(getErrorMessage(error));
        },
      },
    );
  };

  return (
    <LoadingOverlay isLoading={isPending || auth.loading}>
      <Card key={action.id} className="w-full flex flex-col space-y-1">
        <CardHeader>
          <p>{action.name}</p>
        </CardHeader>
        <CardBody>
          <p>{action.description}</p>
        </CardBody>
        <CardFooter className="flex justify-end">
          <Button
            color="primary"
            variant="bordered"
            onPress={handlePerformAction}
          >
            <FormattedMessage
              defaultMessage="Perform action"
              id="action.performAction"
            />
          </Button>
        </CardFooter>
      </Card>
    </LoadingOverlay>
  );
};

export default Action;
