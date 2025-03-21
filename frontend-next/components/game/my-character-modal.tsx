import { useState } from "react";
import {
  Button,
  Card,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import { FormattedMessage } from "react-intl";
import { CardBody } from "@heroui/card";

import { IGameSession } from "@/types/game.types";
import useRole from "@/hooks/use-role";

const MyCharacterModal = ({ game }: { game: IGameSession }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { role, scenarioRole, gameRoleState, loading } = useRole({
    gameId: game.id,
    eventId: game.eventId,
  });

  const allDataLoaded = role && scenarioRole && gameRoleState;

  const getModalHeader = () => {
    if (!allDataLoaded) {
      return (
        <p>
          <FormattedMessage
            defaultMessage="An error occured"
            id="game.myCharacterModal.title.error"
          />
        </p>
      );
    }

    return (
      <FormattedMessage
        defaultMessage="Details for character: {characterName}"
        id="game.myCharacterModal.title"
        values={{ characterName: role.name }}
      />
    );
  };

  const getModalBody = () => {
    if (loading) {
      return (
        <div className="w-full flex justify-center">
          <Spinner />
        </div>
      );
    }

    if (!allDataLoaded) {
      return (
        <div className="w-full flex justify-center">
          <p>
            <FormattedMessage
              defaultMessage="Cannot load role data."
              id="game.myCharacterModal.error.noData"
            />
          </p>
        </div>
      );
    }

    return (
      <Card>
        <CardBody>
          <p>
            <FormattedMessage
              defaultMessage="Role: {roleName}"
              id="game.myCharacterModal.role"
              values={{ roleName: role.name }}
            />
          </p>
          <p>
            <FormattedMessage
              defaultMessage="Description: {scenarioRoleName}"
              id="game.myCharacterModal.scenarioRole"
              values={{
                scenarioRoleName: scenarioRole?.descriptionForOwner,
              }}
            />
          </p>
          <p className="text-xs text-gray-200 mt-2">
            <FormattedMessage
              defaultMessage="Active tags for your character:"
              id="game.myCharacterModal.actionsAvailable"
            />
          </p>
          <div className="mt-1 p-2">
            {gameRoleState?.activeTags.map((tag) => (
              <p key={tag.id}>
                <FormattedMessage
                  defaultMessage="Tag: {tagName}"
                  id="game.myCharacterModal.tag"
                  values={{ tagName: tag.value }}
                />
              </p>
            ))}
          </div>
        </CardBody>
      </Card>
    );
  };

  const MyCharacterModalElement = (
    <Modal
      isOpen={isModalOpen}
      placement="center"
      onOpenChange={(isOpen) => {
        setIsModalOpen(isOpen);
      }}
    >
      <ModalContent>
        <ModalHeader>{getModalHeader()}</ModalHeader>
        <ModalBody>{getModalBody()}</ModalBody>
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
          defaultMessage="My character"
          id="game.myCharacterModal.button.label"
        />
      </Button>
      {MyCharacterModalElement}
    </>
  );
};

export default MyCharacterModal;
