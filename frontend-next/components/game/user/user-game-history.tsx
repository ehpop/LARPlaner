import {
  Button,
  Card,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { FormattedMessage } from "react-intl";
import { useEffect, useState } from "react";
import { CardBody, CardHeader } from "@heroui/card";

import { IGameActionLog, IGameSession } from "@/types/game.types";
import gameService from "@/services/game.service";
import { useAuth } from "@/providers/firebase-provider";

const UserGameHistory = ({ game }: { game: IGameSession }) => {
  const auth = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gameHistory, setGameHistory] = useState<IGameActionLog[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isModalOpen || !auth.user?.email) return;

    gameService
      .getGameHistoryByGameIdAndUserId(auth.user?.email, game.id)
      .then((response) => {
        if (response.success) {
          setGameHistory(response.data);
        } else {
          setError(response.data);
        }
      });
  }, [isModalOpen]);

  const UserGameHistoryModalElement = (
    <Modal
      isOpen={isModalOpen}
      placement="center"
      scrollBehavior="inside"
      size="2xl"
      onOpenChange={(isOpen) => {
        setIsModalOpen(isOpen);
      }}
    >
      <ModalContent>
        <ModalHeader>
          <FormattedMessage
            defaultMessage="Your game history"
            id="userGameHistory.modal.header"
          />
        </ModalHeader>
        <ModalBody>
          <div>
            {error ? (
              <p>{error}</p>
            ) : (
              <>
                <FormattedMessage
                  defaultMessage="Your history for game ID: {gameId}"
                  id="userGameHistory.modal.gameId"
                  values={{ gameId: game.id }}
                />
                <div className="flex flex-col space-y-2 mt-2">
                  {gameHistory.map((historyItem) => (
                    <GameHistoryLogElement
                      key={historyItem.id}
                      historyItem={historyItem}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="bordered"
            onPress={() => {
              setIsModalOpen(false);
            }}
          >
            <FormattedMessage defaultMessage="Close" id="common.close" />
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  return (
    <>
      <Button
        variant="bordered"
        onPress={() => {
          setIsModalOpen(true);
        }}
      >
        <FormattedMessage
          defaultMessage="Display your game history"
          id="userGameHistory.button.displayHistory"
        />
      </Button>
      {UserGameHistoryModalElement}
    </>
  );
};

export default UserGameHistory;

const GameHistoryLogElement = ({
  historyItem,
}: {
  historyItem: IGameActionLog;
}) => {
  return (
    <Card>
      <CardHeader>
        <p className="text-sm font-semibold">
          <FormattedMessage
            defaultMessage="Action performed at {timestamp}"
            id="userGameHistory.modal.timestamp"
            values={{
              timestamp: new Date(historyItem.timestamp).toLocaleString(),
            }}
          />
        </p>
      </CardHeader>
      <CardBody>
        <p>{historyItem.message}</p>
        <p
          className={`text-xs ${historyItem.success ? "text-green-500" : "text-red-500"}`}
        >
          {historyItem.success ? "Success" : "Failed"}
        </p>
        {historyItem.appliedTags.length > 0 && (
          <div className="mt-2">
            <p className="text-xs font-semibold">
              <FormattedMessage
                defaultMessage="Applied Tags:"
                id="userGameHistory.modal.appliedTags"
              />
            </p>
            <ul className="text-xs">
              {historyItem.appliedTags.map((tag) => (
                <li key={tag.id}>- {tag.value}</li>
              ))}
            </ul>
          </div>
        )}
        {historyItem.removedTags.length > 0 && (
          <div className="mt-2">
            <p className="text-xs font-semibold">
              <FormattedMessage
                defaultMessage="Removed Tags:"
                id="userGameHistory.modal.removedTags"
              />
            </p>
            <ul className="text-xs">
              {historyItem.removedTags.map((tag) => (
                <li key={tag.id}>- {tag.value}</li>
              ))}
            </ul>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export { GameHistoryLogElement };
