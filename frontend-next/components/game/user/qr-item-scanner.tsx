"use client";

import { useEffect, useState } from "react";
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
import { Html5QrcodeScanner } from "html5-qrcode";
import { CardBody, CardHeader } from "@heroui/card";

import { IGameSession } from "@/types/game.types";
import { IScenario, IScenarioItemAction } from "@/types/scenario.types";
import { useAuth } from "@/providers/firebase-provider";
import Action from "@/components/game/user/action";

const QrItemScanner = ({
  game,
  scenario,
}: {
  game: IGameSession;
  scenario: IScenario;
}) => {
  const auth = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
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
          <Action key={action.id} action={action} game={game} />
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
    <div className="p-3 rounded-md">
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
      placement="center"
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
    </>
  );
};

export default QrItemScanner;
