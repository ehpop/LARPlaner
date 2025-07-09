import { useState } from "react";
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

import { IGameSession } from "@/types/game.types";
import { IEvent } from "@/types/event.types";
import useGame from "@/hooks/use-game";
import { RolesTable } from "@/components/game/admin/manage-characters/roles-table";

const ManageCharacters = ({
  gameId,
  event,
}: {
  gameId: IGameSession["id"];
  event: IEvent;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { game, loading, error, setGame } = useGame(gameId);

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
                {loading && <Spinner label="Loading game data..." />}
                {error && !loading && (
                  <p className="text-danger">
                    <FormattedMessage
                      defaultMessage="Error: {error}"
                      id="game.manageCharacters.error"
                      values={{ error }}
                    />
                  </p>
                )}
                {!loading && !error && game && (
                  <RolesTable
                    event={event}
                    game={game}
                    onGameUpdate={setGame}
                  />
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
