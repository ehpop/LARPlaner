"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardFooter,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { FormattedMessage } from "react-intl";
import { Html5QrcodeScanner } from "html5-qrcode";
import { CardBody, CardHeader } from "@heroui/card";

import { IGameSession } from "@/types/game.types";
import { IScenario, IScenarioItemAction } from "@/types/scenario.types";
import { useAuth } from "@/providers/firebase-provider";

const QrItemScanner = ({
  game,
  scenario,
}: {
  game: IGameSession;
  scenario: IScenario;
}) => {
  const auth = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionResultModalOpen, setIsActionResultModalOpen] = useState(false);
  const [actionResultMessage, setActionResultMessage] = useState("");
  const [isScanning, setIsScanning] = useState(true);
  const [scannedData, setScannedData] = useState<string>("");

  useEffect(() => {
    if (!isModalOpen || !isScanning) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false,
    );

    scanner.render(
      (data: string) => {
        setScannedData(data);
        scanner.clear().then(() => {
          setIsScanning(false);
        });
      },
      (_) => {},
    );

    return () => {
      scanner.clear().then(() => {});
    };
  }, [isModalOpen, isScanning]);

  //TODO: this sequence should be performed at the backend
  const performAction = (action: IScenarioItemAction) => {
    const userRole = game?.assignedRoles.find(
      (role) => role.assignedEmail === auth.user?.email,
    );

    if (!userRole) {
      setIsActionResultModalOpen(true);
      setActionResultMessage("User is not assigned to this game.");

      return;
    }

    const doesUserHaveEveryRequiredTag = () => {
      return action.requiredTagsToSucceed.every((requiredTag) => {
        return userRole.activeTags.some(
          (userTag) => userTag.id === requiredTag.id,
        );
      });
    };

    let didActionSucceeded = doesUserHaveEveryRequiredTag();

    const messageToDisplay = didActionSucceeded
      ? action.messageOnSuccess
      : action.messageOnFailure;
    const tagsToRemove = didActionSucceeded
      ? action.tagsToRemoveOnSuccess
      : action.tagsToRemoveOnFailure;
    const tagsToApply = didActionSucceeded
      ? action.tagsToApplyOnSuccess
      : action.tagsToApplyOnFailure;

    setIsActionResultModalOpen(true);
    setActionResultMessage(messageToDisplay);

    let newUserTags = userRole.activeTags.filter((userTag) => {
      return tagsToRemove.some((tagToRemove) => tagToRemove.id === userTag.id);
    });

    newUserTags.push(...tagsToApply);

    userRole.activeTags = newUserTags;
  };

  const createScenarioItemFromScannedData = () => {
    const scenarioItem = scenario?.items.find(
      (item) => item.id === scannedData,
    );

    if (!scenarioItem) {
      return (
        <Card>
          <CardHeader>
            <FormattedMessage
              defaultMessage="Item not found"
              id="scanner.itemNotFound"
            />
          </CardHeader>
          <CardBody>
            <FormattedMessage
              defaultMessage="The scanned item was not found in the scenario."
              id="scanner.itemNotFoundDescription"
            />
          </CardBody>
        </Card>
      );
    }

    let itemActionsElement = null;

    if (scenarioItem.actions.length > 0) {
      const userTags = game?.assignedRoles.find(
        (role) => role.assignedEmail === auth.user?.email,
      )?.activeTags;

      const doesUserHaveEveryRequiredTag = (action: IScenarioItemAction) => {
        return action.requiredTagsToDisplay.every((tag) =>
          userTags?.some((userTag) => userTag.id === tag.id),
        );
      };

      const itemActions = scenarioItem.actions
        .filter((action) => doesUserHaveEveryRequiredTag(action))
        .map((action) => (
          <Card
            key={action.id}
            className="w-full flex flex-col space-y-1 border-1"
          >
            <CardHeader>
              <p>{action.name}</p>
            </CardHeader>
            <CardBody>
              <p>{action.description}</p>
            </CardBody>
            <CardFooter className="flex justify-end">
              <Button
                color="primary"
                variant="bordered"
                onPress={() => {
                  performAction(action);
                }}
              >
                <FormattedMessage
                  defaultMessage="Perform action"
                  id="scanner.performAction"
                />
              </Button>
            </CardFooter>
          </Card>
        ));

      itemActionsElement = (
        <div className="flex flex-col space-y-1">
          {itemActions.length === 0 ? (
            <FormattedMessage
              defaultMessage="No actions available"
              id="scanner.noActionsAvailable"
            />
          ) : (
            itemActions
          )}
        </div>
      );
    }

    return (
      <Card key={scenarioItem.id}>
        <CardHeader>
          <p>{scenarioItem.name}</p>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col space-y-2">
            <p>{scenarioItem.description}</p>
            <p className="text-xs">
              <FormattedMessage
                defaultMessage="Actions available for this item:"
                id="scanner.actionsAvailable"
              />
            </p>
            {itemActionsElement}
          </div>
        </CardBody>
      </Card>
    );
  };

  const ScannedDataElement = (
    <div className="p-3 border rounded-md">
      <p className="mb-2">
        <FormattedMessage
          defaultMessage="Scanned data: {scannedData}"
          id="scanner.scannedData"
          values={{ scannedData }}
        />
      </p>
      <div>{createScenarioItemFromScannedData()}</div>
    </div>
  );

  const ScannerMenuModal = (
    <Modal
      isOpen={isModalOpen}
      size="xl"
      onOpenChange={(isOpen) => {
        setIsModalOpen(isOpen);
      }}
    >
      <ModalContent>
        <ModalHeader>
          <FormattedMessage
            defaultMessage="Scan QR code"
            id="scanner.modal.header"
          />
        </ModalHeader>
        <ModalBody>
          <div className="w-full h-full" id="reader" />

          {scannedData && ScannedDataElement}

          {!isScanning && (
            <Button
              variant="bordered"
              onPress={() => {
                setIsScanning(true);
                setScannedData("");
              }}
            >
              <FormattedMessage
                defaultMessage="Scan again"
                id="scanner.scanAgain"
              />
            </Button>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="bordered"
            onPress={() => {
              setIsModalOpen(false);
              setIsScanning(true);
              setScannedData("");
            }}
          >
            <FormattedMessage defaultMessage="Close" id="common.close" />
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  const ActionResultModal = (
    <Modal
      isOpen={isActionResultModalOpen}
      onOpenChange={(isOpen) => {
        setIsActionResultModalOpen(isOpen);
      }}
    >
      <ModalContent>
        <ModalHeader>
          <FormattedMessage
            defaultMessage="Action result"
            id="scanner.actionResult"
          />
        </ModalHeader>
        <ModalBody>{actionResultMessage}</ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="bordered"
            onPress={() => {
              setIsActionResultModalOpen(false);
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
          setScannedData("");
        }}
      >
        <FormattedMessage
          defaultMessage="Scan QR code"
          id="scanner.button.writeToAdmins"
        />
      </Button>

      {ScannerMenuModal}
      {ActionResultModal}
    </>
  );
};

export default QrItemScanner;
