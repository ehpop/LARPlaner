import { useState } from "react";
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
import Action from "@/components/game/user/action";
import { useAuth } from "@/providers/firebase-provider";
import { useAvailableActions } from "@/hooks/game/use-available-actions";
import LoadingOverlay from "@/components/common/loading-overlay";

const ActionsModal = ({ game }: { game: IGameSession }) => {
  const auth = useAuth();
  const userRoleState = game.assignedRoles.find(
    (userRole) => userRole.assignedUserID === auth.user?.uid,
  );
  const {
    event,
    scenario,
    userRole,
    userScenarioRole,
    loading: isLoadingUserData,
  } = useUserEventData({ id: game.eventId || "" });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    actions,
    isLoading: isLoadingActions,
    error,
    refetch,
  } = useAvailableActions({
    isModalOpen,
    event,
    scenario,
    userRole,
    userScenarioRole,
    userRoleState,
  });

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
          <LoadingOverlay isLoading={isLoadingActions}>
            {error && <p>error</p>}
            {!error && actions.length === 0 ? (
              <FormattedMessage
                defaultMessage="No actions available."
                id="game.actionsModal.noActions"
              />
            ) : (
              actions.map((action) => (
                <Action
                  key={action.id}
                  action={action}
                  afterActionPerformed={() => refetch()}
                  game={game}
                />
              ))
            )}
          </LoadingOverlay>
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
        disabled={isLoadingUserData}
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
