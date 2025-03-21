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

import { IAction } from "@/types/scenario.types";
import { IGameSession } from "@/types/game.types";
import { useAuth } from "@/providers/firebase-provider";

const Action = ({ game, action }: { game: IGameSession; action: IAction }) => {
  const auth = useAuth();
  const [isActionResultModalOpen, setIsActionResultModalOpen] = useState(false);
  const [actionResultMessage, setActionResultMessage] = useState("");

  //TODO: this sequence should be performed at the backend
  const performAction = (action: IAction) => {
    const userRole = game?.assignedRoles.find(
      (role) => role.assignedEmail === auth.user?.email,
    );

    if (!userRole) {
      setIsActionResultModalOpen(true);
      setActionResultMessage("User is not assigned to this game.");

      return;
    }

    const doesUserHaveEveryRequiredTag = () => {
      return action.requiredTagsToSucceed.every((requiredTag) => {
        return userRole.activeTags.some(
          (userTag) => userTag.id === requiredTag.id,
        );
      });
    };

    let didActionSucceeded = doesUserHaveEveryRequiredTag();

    const messageToDisplay = didActionSucceeded
      ? action.messageOnSuccess
      : action.messageOnFailure;
    const tagsToRemove = didActionSucceeded
      ? action.tagsToRemoveOnSuccess
      : action.tagsToRemoveOnFailure;
    const tagsToApply = didActionSucceeded
      ? action.tagsToApplyOnSuccess
      : action.tagsToApplyOnFailure;

    setIsActionResultModalOpen(true);
    setActionResultMessage(messageToDisplay);

    let newUserTags = userRole.activeTags.filter((userTag) => {
      return tagsToRemove.some((tagToRemove) => tagToRemove.id === userTag.id);
    });

    newUserTags.push(...tagsToApply);

    userRole.activeTags = newUserTags;
  };

  return (
    <>
      <Card key={action.id} className="w-full flex flex-col space-y-1 border-1">
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
              id="scanner.performAction"
            />
          </Button>
        </CardFooter>
      </Card>
      <Modal
        isOpen={isActionResultModalOpen}
        onOpenChange={(isOpen) => setIsActionResultModalOpen(isOpen)}
      >
        <ModalContent>
          <ModalHeader>
            <FormattedMessage
              defaultMessage="Action result"
              id="scanner.actionResult"
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
              }}
            >
              <FormattedMessage defaultMessage="Close" id="common.close" />
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Action;
