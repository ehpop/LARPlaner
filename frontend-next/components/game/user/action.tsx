import { CardBody, CardHeader } from "@heroui/card";
import {
  Button,
  Card,
  CardFooter,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { FormattedMessage, useIntl } from "react-intl";
import { useState } from "react";

import { IScenarioAction, IScenarioItemAction } from "@/types/scenario.types";
import { IGameSession } from "@/types/game.types";
import { useAuth } from "@/providers/firebase-provider";
import LoadingOverlay from "@/components/common/loading-overlay";
import { showErrorToastWithTimeout } from "@/utils/toast";
import { usePerformAction } from "@/services/game/useGames";
import { getErrorMessage } from "@/utils/error";

const Action = ({
  game,
  action,
  afterActionPerformed,
}: {
  game: IGameSession;
  action: IScenarioAction | IScenarioItemAction;
  afterActionPerformed?: () => void;
}) => {
  const auth = useAuth();
  const intl = useIntl();
  const [isActionResultModalOpen, setIsActionResultModalOpen] = useState(false);
  const [actionResultMessage, setActionResultMessage] = useState("");

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
          setIsActionResultModalOpen(true);
          setActionResultMessage(data.message);
        },
        onError: (error) => {
          showErrorToastWithTimeout(getErrorMessage(error));
        },
      },
    );
  };

  const ActionResultModalElement = (
    <Modal
      isOpen={isActionResultModalOpen}
      placement="center"
      onOpenChange={(isOpen) => {
        setIsActionResultModalOpen(isOpen);
        if (afterActionPerformed) {
          afterActionPerformed();
        }
      }}
    >
      <ModalContent>
        <ModalHeader>
          <FormattedMessage
            defaultMessage="Action result"
            id="action.actionResult"
          />
        </ModalHeader>
        <ModalBody>
          <p>{actionResultMessage}</p>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="bordered"
            onPress={() => {
              setIsActionResultModalOpen(false);
              if (afterActionPerformed) {
                afterActionPerformed();
              }
            }}
          >
            <FormattedMessage defaultMessage="Close" id="common.close" />
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

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
      {ActionResultModalElement}
    </LoadingOverlay>
  );
};

export default Action;
