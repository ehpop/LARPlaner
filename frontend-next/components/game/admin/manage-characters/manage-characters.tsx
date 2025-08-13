import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";

import { IGameSession } from "@/types/game.types";
import { IEvent } from "@/types/event.types";
import { RolesTable } from "@/components/game/admin/manage-characters/roles-table";
import { useGameSession } from "@/services/game/useGames";
import { useStomp } from "@/providers/stomp-client-provider";

const ManageCharacters = ({
  gameId,
  event,
}: {
  gameId: IGameSession["id"];
  event: IEvent;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: game, isLoading, isError, error } = useGameSession(gameId);

  const { client: stompClient, isConnected } = useStomp();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!stompClient || !stompClient.active || !isConnected) {
      return;
    }

    const subscription = stompClient.subscribe(
      `/topic/game/${gameId}/action`,
      (_message) => {
        queryClient.refetchQueries({
          queryKey: ["game", "detail", gameId],
        });
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [stompClient, isConnected, queryClient, gameId]);

  return (
    <>
      <Button variant="bordered" onPress={() => setIsModalOpen(true)}>
        <FormattedMessage
          defaultMessage="Manage characters"
          id="game.manageCharacters.button"
        />
      </Button>

      <Modal
        isDismissable={false}
        isOpen={isModalOpen}
        placement="center"
        scrollBehavior="inside"
        size="full"
        onOpenChange={setIsModalOpen}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <FormattedMessage
                  defaultMessage="Manage characters"
                  id="game.manageCharacters.modal.header"
                />
              </ModalHeader>
              <ModalBody>
                {isLoading && <Spinner label="Loading game data..." />}
                {!isLoading && isError && (
                  <p className="text-danger">
                    <FormattedMessage
                      defaultMessage="Error: {error}"
                      id="game.manageCharacters.error"
                      values={{ error: error?.message }}
                    />
                  </p>
                )}
                {!isLoading && !error && game && (
                  <RolesTable event={event} game={game} />
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="bordered" onPress={onClose}>
                  <FormattedMessage defaultMessage="Close" id="common.close" />
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ManageCharacters;
