import { useEffect, useState } from "react";
import {
  Button,
  getKeyValue,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { FormattedMessage } from "react-intl";

import { IGameActionLog, IGameSession } from "@/types/game.types";
import gameService from "@/services/game.service";

const AdminGameHistory = ({ game }: { game: IGameSession }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gameHistory, setGameHistory] = useState<IGameActionLog[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isModalOpen) return;

    gameService.getGameHistoryByGameId(game.id).then((response) => {
      if (response.success) {
        setGameHistory(response.data);
      } else {
        setError(response.data);
      }
    });
  }, [isModalOpen]);

  const AdminGameHistoryModalElement = (
    <Modal
      isOpen={isModalOpen}
      placement="center"
      scrollBehavior="inside"
      size="full"
      onOpenChange={(isOpen) => {
        setIsModalOpen(isOpen);
      }}
    >
      <ModalContent>
        <ModalHeader>
          <FormattedMessage
            defaultMessage="Game history"
            id="adminGameHistory.modal.header"
          />
        </ModalHeader>
        <ModalBody>
          <div>
            {error ? (
              <p>{error}</p>
            ) : (
              <GameHistoryElement gameHistory={gameHistory} />
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
            <FormattedMessage
              defaultMessage="Close"
              id="adminGameHistory.modal.close"
            />
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
          defaultMessage="Game history"
          id="adminGameHistory.button.label"
        />
      </Button>
      {AdminGameHistoryModalElement}
    </>
  );
};

export default AdminGameHistory;

const GameHistoryElement = ({
  gameHistory,
}: {
  gameHistory: IGameActionLog[];
}) => {
  const columns = [
    { key: "id", label: "ID" },
    { key: "timestamp", label: "Timestamp" },
    { key: "performerRoleId", label: "Performer Role ID" },
    { key: "targetItemId", label: "Target Item ID" },
    { key: "success", label: "Success" },
    { key: "message", label: "Message" },
    { key: "appliedTags", label: "Applied Tags" },
    { key: "removedTags", label: "Removed Tags" },
  ];

  const rows = gameHistory.map((historyItem) => {
    return {
      id: historyItem.id,
      timestamp: new Date(historyItem.timestamp).toString(),
      performerRoleId: historyItem.performerRoleId,
      targetItemId: historyItem.targetItemId,
      success: `${historyItem.success}`,
      message: historyItem.message,
      appliedTags: historyItem.appliedTags
        .map((historyItem) => historyItem.value)
        .join(", "),
      removedTags: historyItem.removedTags
        .map((historyItem) => historyItem.value)
        .join(", "),
    };
  });

  return (
    <Table>
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody
        emptyContent={
          <FormattedMessage
            defaultMessage="No actions available."
            id="game.actionsModal.noActions"
          />
        }
        items={rows}
      >
        {(item) => (
          <TableRow>
            {(columnKey) => (
              <TableCell key={columnKey}>
                {getKeyValue(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
