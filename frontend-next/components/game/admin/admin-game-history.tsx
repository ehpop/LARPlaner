import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import { FormattedMessage, useIntl } from "react-intl";
import { useQueryClient } from "@tanstack/react-query";
import { SortDescriptor } from "@react-types/shared";

import { IGameActionLogDetailed, IGameSession } from "@/types/game.types";
import { useGameHistory } from "@/services/game/useGames";
import { useStomp } from "@/providers/stomp-client-provider";
import { AdminTableDisplay } from "@/components/table/admin-table-display";
import { usePagination } from "@/hooks/use-pagination";
import PaginationControl from "@/components/table/pagination-control";

interface GameHistoryElementProps {
  gameHistory: IGameActionLogDetailed[];
}

const GameHistoryElement = ({ gameHistory }: GameHistoryElementProps) => {
  const intl = useIntl();
  const itemsPerPage = 20;

  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "timestamp",
    direction: "descending",
  });

  const sortedHistory = useMemo(() => {
    if (!sortDescriptor || !sortDescriptor.column) {
      return gameHistory;
    }

    return [...gameHistory].sort((a, b) => {
      const first = a[
        sortDescriptor.column as keyof IGameActionLogDetailed
      ] as any;
      const second = b[
        sortDescriptor.column as keyof IGameActionLogDetailed
      ] as any;

      let cmp = 0;

      if (first < second) {
        cmp = -1;
      } else if (first > second) {
        cmp = 1;
      }

      if (sortDescriptor.direction === "descending") {
        cmp *= -1;
      }

      return cmp;
    });
  }, [gameHistory, sortDescriptor]);

  const { currentList, currentPage, totalPages, setCurrentPage } =
    usePagination(sortedHistory, itemsPerPage);

  const historyTableColumns = [
    {
      key: "actionName",
      label: intl.formatMessage({
        id: "admin.admin-game-history.performer.action.name",
        defaultMessage: "Action Name",
      }),
      allowsSorting: true,
    },
    {
      key: "timestamp",
      label: intl.formatMessage({
        id: "admin.admin-game-history.timestamp",
        defaultMessage: "Timestamp",
      }),
      allowsSorting: true,
    },
    {
      key: "roleName",
      label: intl.formatMessage({
        id: "admin.admin-game-history.performer.role",
        defaultMessage: "Performer Role",
      }),
      allowsSorting: true,
    },
    {
      key: "targetItemName",
      label: intl.formatMessage({
        id: "admin.admin-game-history.target.item.name",
        defaultMessage: "Target Item Name",
      }),
      allowsSorting: true,
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
    return currentList.map((historyItem) => ({
      actionName: historyItem.action.name,
      timestamp: new Date(historyItem.timestamp).toLocaleString(intl.locale),
      roleName: historyItem.performerRole.scenarioRole.role.name,
      targetItemName: historyItem.targetItem?.scenarioItem.name,
      success: historyItem.success ? (
        <p className="text-center text-large">✅</p>
      ) : (
        <p className="text-center text-large">❌</p>
      ),
      message: historyItem.message,
      appliedTags: historyItem.appliedTags.map((tag) => tag.value).join(", "),
      removedTags: historyItem.removedTags.map((tag) => tag.value).join(", "),
    }));
  }, [currentList, intl]);

  const bottomContent = useMemo(() => {
    return (
      <PaginationControl
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    );
  }, [currentPage, totalPages, setCurrentPage]);

  return (
    <AdminTableDisplay
      isCompact
      bottomContent={bottomContent}
      classNames={{
        wrapper: "max-h-[75vh] min-h-[75vh]",
      }}
      columns={historyTableColumns}
      rows={rows}
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
    />
  );
};

interface AdminGameHistoryProps {
  game: IGameSession;
}

const AdminGameHistory = ({ game }: AdminGameHistoryProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { client: stompClient, isConnected } = useStomp();
  const queryClient = useQueryClient();

  const {
    data: gameHistory,
    isLoading,
    isError,
    error,
    refetch: refetchGameHistory,
  } = useGameHistory(game.id);

  const handleOpenChange = (isOpen: boolean) => {
    setIsModalOpen(isOpen);
  };

  useEffect(() => {
    if (!stompClient || !stompClient.active || !isConnected) {
      return;
    }

    const subscription = stompClient.subscribe(
      `/topic/game/${game.id}/action`,
      () => {
        refetchGameHistory();
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [stompClient, queryClient, isConnected, game.id, refetchGameHistory]);

  const renderModalContent = () => {
    if (isLoading) {
      return <Spinner label="Loading history..." />;
    }
    if (isError) {
      return (
        <p className="text-danger">
          <FormattedMessage
            defaultMessage="Error: {errorMessage}"
            id="adminGameHistory.error"
            values={{ errorMessage: error?.message }}
          />
        </p>
      );
    }

    return gameHistory && <GameHistoryElement gameHistory={gameHistory} />;
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
