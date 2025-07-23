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
import { FormattedMessage } from "react-intl";
import { useState } from "react";

import { IScenarioAction, IScenarioItemAction } from "@/types/scenario.types";
import { IGameSession } from "@/types/game.types";
import { useAuth } from "@/providers/firebase-provider";
import gameService from "@/services/game.service";
import LoadingOverlay from "@/components/common/loading-overlay";
import { showErrorToastWithTimeout } from "@/utils/toast";

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
  const [isActionResultModalOpen, setIsActionResultModalOpen] = useState(false);
  const [actionResultMessage, setActionResultMessage] = useState("");
  const [isLoading, setIsLoading] = useState(auth.loading);

  const userRole = game.assignedRoles.find(
    (ar) => ar.assignedUserID === auth.user?.uid,
  );

  const performAction = (action: IScenarioAction | IScenarioItemAction) => {
    setIsLoading(true);
    if (!userRole) {
      setIsActionResultModalOpen(true);
      setActionResultMessage("Something went wrong");
      setIsLoading(false);

      return;
    }

    gameService
      .performAction(game.id, {
        actionId: action.id,
        performerRoleId: userRole?.scenarioRoleId,
        targetItemId: "itemId" in action ? action?.itemId : undefined,
      })
      .then((res) => {
        if (res.success) {
          setIsActionResultModalOpen(true);
          setActionResultMessage(res.data.message);
        } else {
          showErrorToastWithTimeout(res.data);
        }
      })
      .catch((error) => showErrorToastWithTimeout(error))
      .finally(() => {
        setIsLoading(false);
      });
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
    <LoadingOverlay isLoading={isLoading}>
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
            onPress={() => {
              performAction(action);
            }}
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
