"use client";

import { useEffect, useState } from "react";
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
import { Html5QrcodeScanner } from "html5-qrcode";
import { useQueryClient } from "@tanstack/react-query";

import {
  IGameActionLogSummary,
  IGameRoleStateSummary,
  IGameSession,
} from "@/types/game.types";
import { IScenario } from "@/types/scenario.types";
import { useAuth } from "@/providers/firebase-provider";
import Action from "@/components/game/user/action";
import { useAvailableItemActions } from "@/hooks/game/use-available-item-actions";
import ActionResultDisplay from "@/components/game/user/actions/action-result-display";

const QrItemScanner = ({
  game,
  scenario,
}: {
  game: IGameSession;
  scenario: IScenario;
}) => {
  const auth = useAuth();
  const userRoleState = game.assignedRoles.find(
    (role) => role.assignedUserID === auth.user?.uid,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [actionResult, setActionResult] =
    useState<IGameActionLogSummary | null>(null);

  useEffect(() => {
    if (!isModalOpen || scanResult !== null || actionResult !== null) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false,
    );
    const onScanSuccess = (decodedText: string) => {
      scanner.clear();
      setScanResult(decodedText);
    };

    scanner.render(onScanSuccess, undefined);

    return () => {
      scanner
        .clear()
        .catch((err) => console.error("Scanner clear failed", err));
    };
  }, [isModalOpen, scanResult, actionResult]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setScanResult(null);
    setActionResult(null);
  };

  const handleScanAgain = () => {
    setScanResult(null);
    setActionResult(null);
  };

  const handleAcknowledgeResult = () => {
    setActionResult(null);
  };

  return (
    <>
      <Button w-full variant="bordered" onPress={() => setIsModalOpen(true)}>
        <FormattedMessage
          defaultMessage="Scan Item QR Code"
          id="scanner.button.label"
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
              ) : scanResult ? (
                <FormattedMessage
                  defaultMessage="Item Details"
                  id="scanner.itemDetails.title"
                />
              ) : (
                <FormattedMessage
                  defaultMessage="Scan Item"
                  id="scanner.modal.header"
                />
              )}
            </h2>
          </ModalHeader>
          <ModalBody className="p-6 min-h-[24rem] flex flex-col">
            {actionResult ? (
              <ActionResultDisplay actionResult={actionResult} />
            ) : scanResult ? (
              userRoleState && (
                <ItemDisplay
                  game={game}
                  scanResult={scanResult}
                  scenario={scenario}
                  userRoleState={userRoleState}
                  onActionPerformed={setActionResult}
                  onScanAgain={handleScanAgain}
                />
              )
            ) : (
              <div className="w-full" id="reader" />
            )}
          </ModalBody>
          <ModalFooter className="border-t border-zinc-200 dark:border-zinc-800">
            {actionResult ? (
              <Button color="primary" onPress={handleAcknowledgeResult}>
                <FormattedMessage defaultMessage="OK" id="common.ok" />
              </Button>
            ) : (
              <Button variant="light" onPress={handleModalClose}>
                <FormattedMessage defaultMessage="Close" id="common.close" />
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const ItemDisplay = ({
  scanResult,
  game,
  scenario,
  userRoleState,
  onActionPerformed,
  onScanAgain,
}: {
  scanResult: string;
  game: IGameSession;
  scenario: IScenario;
  userRoleState: IGameRoleStateSummary;
  onActionPerformed: (result: IGameActionLogSummary) => void;
  onScanAgain: () => void;
}) => {
  const queryClient = useQueryClient();
  const scenarioItem = scenario.items.find((item) => item.id === scanResult);

  const {
    actions: itemActions,
    isLoading,
    error,
  } = useAvailableItemActions(userRoleState, scenarioItem?.id);

  const handleActionSuccess = (result: IGameActionLogSummary) => {
    queryClient.invalidateQueries({ queryKey: ["game", "detail", game.id] });
    onActionPerformed(result);
  };

  if (!scenarioItem) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4">
        <p className="text-lg font-medium text-zinc-800 dark:text-zinc-200">
          <FormattedMessage
            defaultMessage="Item Not Found"
            id="scanner.itemNotFound"
          />
        </p>
        <p className="text-zinc-500 dark:text-zinc-400">
          <FormattedMessage
            defaultMessage="The scanned QR code does not correspond to a known item in this scenario."
            id="scanner.itemNotFoundDescription"
          />
        </p>
        <Button variant="bordered" onPress={onScanAgain}>
          <FormattedMessage
            defaultMessage="Scan Again"
            id="scanner.scanAgain"
          />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {scenarioItem.name}
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400">
          {scenarioItem.description}
        </p>
      </div>

      <hr className="border-zinc-200 dark:border-zinc-800" />

      <div className="space-y-4">
        <h4 className="font-medium text-zinc-800 dark:text-zinc-200">
          <FormattedMessage
            defaultMessage="Available Actions:"
            id="scanner.actionsAvailable"
          />
        </h4>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Spinner />
          </div>
        ) : error ? (
          <p className="text-red-600 dark:text-red-400">{error}</p>
        ) : itemActions.length > 0 ? (
          <div className="space-y-3">
            {itemActions.map((action) => (
              <Action
                key={action.id}
                action={action}
                game={game}
                onActionPerformed={handleActionSuccess}
              />
            ))}
          </div>
        ) : (
          <p className="text-zinc-500 dark:text-zinc-400 italic">
            <FormattedMessage
              defaultMessage="You have no available actions for this item."
              id="scanner.noActionsAvailable"
            />
          </p>
        )}
      </div>

      <div className="pt-2 flex justify-center">
        <Button variant="bordered" onPress={onScanAgain}>
          <FormattedMessage
            defaultMessage="Scan Another Item"
            id="scanner.scanAgain"
          />
        </Button>
      </div>
    </div>
  );
};

export default QrItemScanner;
