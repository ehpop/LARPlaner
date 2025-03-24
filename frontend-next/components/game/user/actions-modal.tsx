import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { FormattedMessage } from "react-intl";

import { IGameSession } from "@/types/game.types";
import useUserEventData from "@/hooks/use-user-data";
import { IScenarioAction } from "@/types/scenario.types";
import Action from "@/components/game/user/action";
import { useAuth } from "@/providers/firebase-provider";

const ActionsModal = ({ game }: { game: IGameSession }) => {
  const auth = useAuth();
  const { event, scenario, userRole, userScenarioRole, loading } =
    useUserEventData({ id: game.eventId || "" });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actions, setActions] = useState<IScenarioAction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isModalOpen || !event || !scenario || !userRole || !userScenarioRole)
      return;

    const loadActions = async () => {
      const userTags = game?.assignedRoles.find(
        (role) => role.assignedEmail === auth.user?.email,
      )?.activeTags;

      const doesUserHaveEveryRequiredTag = (action: IScenarioAction) => {
        return action.requiredTagsToDisplay.every((tag) =>
          userTags?.some((userTag) => userTag.id === tag.id),
        );
      };

      const actionsToDisplay = scenario.actions.filter((action) =>
        doesUserHaveEveryRequiredTag(action),
      );

      setActions(actionsToDisplay);
    };

    loadActions().finally(() => setIsLoading(false));
  }, [isModalOpen, loading]);

  const ActionsModalElement = (
    <Modal
      isOpen={isModalOpen}
      placement="center"
      scrollBehavior="inside"
      size="lg"
      onOpenChange={(isOpen) => setIsModalOpen(isOpen)}
    >
      <ModalContent>
        <ModalHeader>
          <FormattedMessage
            defaultMessage="Actions"
            id="game.actionsModal.actions"
          />
        </ModalHeader>
        <ModalBody>
          {actions.length === 0 ? (
            <FormattedMessage
              defaultMessage="No actions available."
              id="game.actionsModal.noActions"
            />
          ) : (
            actions.map((action) => (
              <Action
                key={action.id}
                action={action}
                afterActionPerformed={() => {
                  setIsModalOpen(false);
                }}
                game={game}
              />
            ))
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="bordered"
            onPress={() => setIsModalOpen(false)}
          >
            <FormattedMessage
              defaultMessage="Close"
              id="game.actionsModal.close"
            />
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  return (
    <>
      <Button
        disabled={isLoading}
        variant="bordered"
        onPress={() => setIsModalOpen(true)}
      >
        <FormattedMessage
          defaultMessage="Actions"
          id="game.actionsModal.actions"
        />
      </Button>
      {ActionsModalElement}
    </>
  );
};

export default ActionsModal;
