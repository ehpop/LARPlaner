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

import { IGameRoleState, IGameSession } from "@/types/game.types";
import { IScenario } from "@/types/scenario.types";
import { useAuth } from "@/providers/firebase-provider";
import Action from "@/components/game/user/action";
import { useAvailableItemActions } from "@/hooks/game/use-available-item-actions";
import LoadingOverlay from "@/components/common/loading-overlay";

const QrItemScanner = ({
  game,
  scenario,
}: {
  game: IGameSession;
  scenario: IScenario;
}) => {
  const auth = useAuth();

  const userRoleState = game.assignedRoles.find(
    (userRole) => userRole.assignedUserID === auth.user?.uid,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [scannedData, setScannedData] = useState<string>("");

  useEffect(() => {
    if (!userRoleState || !isModalOpen || !isScanning) return;

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

  const ScannedDataElement = (
    <div className="p-3 rounded-md">
      <p className="mb-2">
        <FormattedMessage
          defaultMessage="Scanned data: {scannedData}"
          id="scanner.scannedData"
          values={{ scannedData }}
        />
      </p>
      {!userRoleState ? (
        <FormattedMessage
          defaultMessage="User role was not found"
          id="scanner.userRoleState.error"
        />
      ) : (
        scannedData && (
          <ScannedItemCard
            game={game}
            scannedData={scannedData}
            scenario={scenario}
            userRoleState={userRoleState}
          />
        )
      )}
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

export const ScannedItemCard = ({
  scannedData,
  game,
  scenario,
  userRoleState,
}: {
  scannedData: string;
  game: IGameSession;
  scenario: IScenario;
  userRoleState: IGameRoleState;
}) => {
  const scenarioItem = scenario?.items.find((item) => item.id === scannedData);

  const {
    actions: itemActions,
    isLoading,
    error,
    refetch,
  } = useAvailableItemActions(userRoleState, scenarioItem?.id);

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

  const renderItemActions = () => {
    if (isLoading) {
      return null;
    }

    if (itemActions.length > 0) {
      return itemActions.map((action) => (
        <Action
          key={action.id}
          action={action}
          afterActionPerformed={refetch}
          game={game}
        />
      ));
    }

    return (
      <p className="text-center">
        <FormattedMessage
          defaultMessage="No actions available for you."
          id="scanner.noActionsAvailable"
        />
      </p>
    );
  };

  return (
    <Card key={scenarioItem.id}>
      <CardHeader>
        <p>{scenarioItem.name}</p>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col space-y-2">
          <p>{scenarioItem.description}</p>
          <p className="text-small">
            <FormattedMessage
              defaultMessage="Actions available for this item:"
              id="scanner.actionsAvailable"
            />
          </p>
          {error && <p style={{ color: "red" }}>Error: {error}</p>}

          <LoadingOverlay isLoading={isLoading}>
            <div className="flex flex-col space-y-1">{renderItemActions()}</div>
          </LoadingOverlay>
        </div>
      </CardBody>
    </Card>
  );
};
