"use client";

import { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import { FormattedMessage } from "react-intl";

import { IGameActionLogSummary, IGameSession } from "@/types/game.types";
import useUserEventData from "@/hooks/use-user-data";
import Action from "@/components/game/user/action";
import { useAuth } from "@/providers/firebase-provider";
import { useAvailableActions } from "@/hooks/game/use-available-actions";
import ActionResultDisplay from "@/components/game/user/actions/action-result-display";

const ActionsModal = ({ game }: { game: IGameSession }) => {
  const auth = useAuth();
  const userRoleState = game.assignedRoles.find(
    (userRole) => userRole.assignedUserID === auth.user?.uid,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionResult, setActionResult] =
    useState<IGameActionLogSummary | null>(null);

  const {
    event,
    scenario,
    userRole,
    userScenarioRole,
    loading: isLoadingUserData,
  } = useUserEventData(game.eventId);

  const {
    actions,
    isLoading: isLoadingActions,
    error,
  } = useAvailableActions({
    isModalOpen: isModalOpen && !actionResult,
    event,
    scenario,
    userRole,
    userScenarioRole,
    userRoleState,
  });

  const handleModalClose = () => {
    setIsModalOpen(false);
    setActionResult(null);
  };

  return (
    <>
      <Button
        w-full
        isDisabled={isLoadingUserData}
        variant="bordered"
        onPress={() => setIsModalOpen(true)}
      >
        <FormattedMessage
          defaultMessage="Perform Action"
          id="game.actionsModal.button.label"
        />
      </Button>

      <Modal
        isOpen={isModalOpen}
        placement="center"
        scrollBehavior="inside"
        size="2xl"
        onOpenChange={(isOpen) => !isOpen && handleModalClose()}
      >
        <ModalContent className="bg-white dark:bg-zinc-900">
          <ModalHeader className="border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {actionResult ? (
                <FormattedMessage
                  defaultMessage="Action Result"
                  id="action.actionResult"
                />
              ) : (
                <FormattedMessage
                  defaultMessage="Available Actions"
                  id="game.actionsModal.actions"
                />
              )}
            </h2>
          </ModalHeader>
          <ModalBody className="p-6 min-h-[12rem] flex flex-col">
            {actionResult ? (
              <ActionResultDisplay actionResult={actionResult} />
            ) : isLoadingActions ? (
              <div className="flex-grow flex items-center justify-center">
                <Spinner />
              </div>
            ) : error ? (
              <div className="flex-grow flex items-center justify-center">
                <p className="text-red-600 dark:text-red-400">
                  {error.message}
                </p>
              </div>
            ) : actions.length === 0 ? (
              <div className="flex-grow flex items-center justify-center">
                <p className="text-zinc-500 dark:text-zinc-400 italic">
                  <FormattedMessage
                    defaultMessage="No actions available at this time."
                    id="game.actionsModal.noActions"
                  />
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {actions.map((action) => (
                  <Action
                    key={action.id}
                    action={action}
                    game={game}
                    onActionPerformed={setActionResult}
                  />
                ))}
              </div>
            )}
          </ModalBody>
          <ModalFooter className="border-t border-zinc-200 dark:border-zinc-800">
            <Button variant="light" onPress={handleModalClose}>
              {actionResult ? (
                <FormattedMessage defaultMessage="OK" id="common.ok" />
              ) : (
                <FormattedMessage defaultMessage="Close" id="common.close" />
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ActionsModal;
