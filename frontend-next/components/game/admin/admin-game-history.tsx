import { useEffect, useMemo, useState } from "react";
import {
  Button,
  getKeyValue,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { FormattedMessage, useIntl } from "react-intl";

import { IGameActionLog, IGameSession } from "@/types/game.types";
import gameService from "@/services/game.service";

interface GameHistoryElementProps {
  gameHistory: IGameActionLog[];
}

const GameHistoryElement = ({ gameHistory }: GameHistoryElementProps) => {
  const intl = useIntl();

  const historyTableColumns = [
    { key: "id", label: "ID" },
    {
      key: "timestamp",
      label: intl.formatMessage({
        id: "admin.admin-game-history.timestamp",
        defaultMessage: "Timestamp",
      }),
    },
    {
      key: "performerRoleId",
      label: intl.formatMessage({
        id: "admin.admin-game-history.performer.role.id",
        defaultMessage: "Performer Role ID",
      }),
    },
    {
      key: "targetItemId",
      label: intl.formatMessage({
        id: "admin.admin-game-history.target.item.id",
        defaultMessage: "Target Item ID",
      }),
    },
    {
      key: "success",
      label: intl.formatMessage({
        id: "admin.admin-game-history.success",
        defaultMessage: "Success",
      }),
    },
    {
      key: "message",
      label: intl.formatMessage({
        id: "admin.admin-game-history.message",
        defaultMessage: "Message",
      }),
    },
    {
      key: "appliedTags",
      label: intl.formatMessage({
        id: "admin.admin-game-history.applied.tags",
        defaultMessage: "Applied Tags",
      }),
    },
    {
      key: "removedTags",
      label: intl.formatMessage({
        id: "admin.admin-game-history.removed.tags",
        defaultMessage: "Removed Tags",
      }),
    },
  ];

  const rows = useMemo(() => {
    return gameHistory.map((historyItem) => ({
      id: historyItem.id,
      timestamp: new Date(historyItem.timestamp).toLocaleString(intl.locale),
      performerRoleId: historyItem.performerRoleId,
      targetItemId: historyItem.targetItemId,
      success: historyItem.success
        ? intl.formatMessage({ defaultMessage: "Yes", id: "common.yes" })
        : intl.formatMessage({ defaultMessage: "No", id: "common.no" }),
      message: historyItem.message,
      appliedTags: historyItem.appliedTags.map((tag) => tag.value).join(", "),
      removedTags: historyItem.removedTags.map((tag) => tag.value).join(", "),
    }));
  }, [gameHistory, intl]);

  return (
    <Table
      aria-label={intl.formatMessage({
        id: "admin.admin-game-history.game.action.history.table",
        defaultMessage: "Game Action History Table",
      })}
    >
      <TableHeader columns={historyTableColumns}>
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
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell key={`${item.id}-${columnKey}`}>
                {getKeyValue(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

interface AdminGameHistoryProps {
  game: IGameSession;
}

const AdminGameHistory = ({ game }: AdminGameHistoryProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gameHistory, setGameHistory] = useState<IGameActionLog[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await gameService.getGameHistoryByGameId(game.id);

        if (response.success) {
          setGameHistory(response.data);
        } else {
          setError(response.data);
          setGameHistory([]);
        }
      } catch (err) {
        setError("Failed to load game history. Please try again.");
        setGameHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory().then(() => {});
  }, [isModalOpen, game.id]);

  const handleOpenChange = (isOpen: boolean) => {
    setIsModalOpen(isOpen);
  };

  const renderModalContent = () => {
    if (isLoading) {
      return <Spinner label="Loading history..." />;
    }
    if (error) {
      return (
        <p style={{ color: "red" }}>
          <FormattedMessage
            defaultMessage="Error: {errorMessage}"
            id="adminGameHistory.error"
            values={{ errorMessage: error }}
          />
        </p>
      );
    }

    return <GameHistoryElement gameHistory={gameHistory} />;
  };

  return (
    <>
      <Button variant="bordered" onPress={() => setIsModalOpen(true)}>
        <FormattedMessage
          defaultMessage="Game history"
          id="adminGameHistory.button.label"
        />
      </Button>

      <Modal
        isOpen={isModalOpen}
        placement="center"
        scrollBehavior="inside"
        size="full"
        onClose={() => {
          setIsModalOpen(false);
        }}
        onOpenChange={handleOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <FormattedMessage
                  defaultMessage="Game history for Game {gameId}"
                  id="adminGameHistory.modal.header"
                  values={{ gameId: game.id }}
                />
              </ModalHeader>
              <ModalBody>{renderModalContent()}</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="bordered" onPress={onClose}>
                  <FormattedMessage
                    defaultMessage="Close"
                    id="adminGameHistory.modal.close"
                  />
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AdminGameHistory;
