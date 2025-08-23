"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

import { useUserGameHistory } from "@/services/game/useGames";
import { IGameActionLogSummary, IGameSession } from "@/types/game.types";
import { ITag } from "@/types/tags.types";

const UserGameHistory = ({ game }: { game: IGameSession }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: gameHistory,
    error,
    isLoading,
  } = useUserGameHistory(isModalOpen ? game.id : undefined);

  return (
    <>
      <Button w-full variant="bordered" onPress={() => setIsModalOpen(true)}>
        <FormattedMessage
          defaultMessage="Display your game history"
          id="userGameHistory.button.displayHistory"
        />
      </Button>

      <Modal
        isOpen={isModalOpen}
        placement="center"
        scrollBehavior="inside"
        size="3xl"
        onOpenChange={setIsModalOpen}
      >
        <ModalContent className="bg-white dark:bg-zinc-900">
          <ModalHeader className="border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              <FormattedMessage
                defaultMessage="Your Game History"
                id="userGameHistory.modal.header"
              />
            </h2>
          </ModalHeader>
          <ModalBody className="p-6">
            {isLoading && (
              <p className="text-center text-zinc-500 dark:text-zinc-400">
                <FormattedMessage
                  defaultMessage="Loading history..."
                  id="userGameHistory.modal.loading"
                />
              </p>
            )}
            {error && (
              <p className="text-center text-red-600 dark:text-red-400">
                {error.message}
              </p>
            )}
            {gameHistory && (
              <div className="flex flex-col-reverse space-y-4 space-y-reverse">
                {gameHistory.map((historyItem) => (
                  <GameHistoryLogElement
                    key={historyItem.id}
                    historyItem={historyItem}
                  />
                ))}
              </div>
            )}
          </ModalBody>
          <ModalFooter className="border-t border-zinc-200 dark:border-zinc-800">
            <Button variant="light" onPress={() => setIsModalOpen(false)}>
              <FormattedMessage defaultMessage="Close" id="common.close" />
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const GameHistoryLogElement = ({
  historyItem,
}: {
  historyItem: IGameActionLogSummary;
}) => {
  const hasTags =
    historyItem.appliedTags.length > 0 || historyItem.removedTags.length > 0;

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-start gap-4">
        <p className="font-medium text-zinc-800 dark:text-zinc-200">
          {historyItem.message}
        </p>
        <span className="text-xs text-zinc-500 dark:text-zinc-400 flex-shrink-0 pt-1">
          {new Date(historyItem.timestamp).toLocaleTimeString()}
        </span>
      </div>
      <div className="flex items-center">
        {historyItem.success ? (
          <span className="inline-flex items-center rounded-md bg-green-100 dark:bg-green-900/50 px-2 py-1 text-xs font-medium text-green-800 dark:text-green-300">
            <FormattedMessage
              defaultMessage="Success"
              id="user.user-game-history.success"
            />
          </span>
        ) : (
          <span className="inline-flex items-center rounded-md bg-red-100 dark:bg-red-900/50 px-2 py-1 text-xs font-medium text-red-800 dark:text-red-300">
            <FormattedMessage
              defaultMessage="Failure"
              id="user.user-game-history.failure"
            />
          </span>
        )}
      </div>
      {hasTags && (
        <>
          <hr className="border-zinc-200 dark:border-zinc-800" />
          <div className="flex flex-wrap gap-2">
            <TagList tags={historyItem.appliedTags} type="applied" />
            <TagList tags={historyItem.removedTags} type="removed" />
          </div>
        </>
      )}
    </div>
  );
};

const TagList = ({
  tags,
  type,
}: {
  tags: ITag[];
  type: "applied" | "removed";
}) => {
  const isApplied = type === "applied";
  const bgColor = isApplied
    ? "bg-green-100/60 dark:bg-green-900/40"
    : "bg-red-100/60 dark:bg-red-900/40";
  const textColor = isApplied
    ? "text-green-800 dark:text-green-300"
    : "text-red-800 dark:text-red-300";

  return (
    <>
      {tags.map((tag) => (
        <span
          key={tag.id}
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${bgColor} ${textColor}`}
        >
          {isApplied ? "+" : "-"} {tag.value}
        </span>
      ))}
    </>
  );
};

export default UserGameHistory;
