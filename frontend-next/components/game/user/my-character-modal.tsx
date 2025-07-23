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
import { FormattedDate, FormattedMessage, useIntl } from "react-intl";
import { CardBody } from "@heroui/card";

import { IGameSession } from "@/types/game.types";
import useGameRole from "@/hooks/use-game-role";

const ShieldCheckIcon = () => (
  <svg
    className="h-4 w-4"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      clipRule="evenodd"
      d="M10 1a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 1zM5.05 3.55a.75.75 0 00-1.06 1.06l1.06-1.06zM16.06 4.61a.75.75 0 00-1.06-1.06l1.06 1.06zM3.55 14.95a.75.75 0 101.06 1.06l-1.06-1.06zM14.95 16.06a.75.75 0 101.06-1.06l-1.06 1.06zM18.25 10a.75.75 0 01-1.5 0h1.5zM1.75 10a.75.75 0 01-1.5 0h1.5zM10 18.25a.75.75 0 010-1.5v1.5zM10 3.25a.75.75 0 010 1.5v-1.5z"
      fillRule="evenodd"
    />
    <path d="M10 3.5c.74 0 1.45.11 2.13.32a.75.75 0 00.55-1.42A8.99 8.99 0 0010 2a8.99 8.99 0 00-2.68.55.75.75 0 00.55 1.42c.68-.21 1.39-.32 2.13-.32zM4.61 4.61A8.963 8.963 0 002.55 7.32.75.75 0 004 7.87c.53-.78 1.17-1.48 1.9-2.1l-1.3-1.16zM15.39 4.61l-1.3 1.16a6.96 6.96 0 011.9 2.1.75.75 0 001.45-.55 8.963 8.963 0 00-2.05-2.71zM4.61 15.39l1.3-1.16a6.96 6.96 0 01-1.9-2.1.75.75 0 00-1.45.55 8.963 8.963 0 002.05 2.71zM15.39 15.39a8.963 8.963 0 002.05-2.71.75.75 0 00-1.45-.55 6.96 6.96 0 01-1.9 2.1l1.3 1.16z" />
  </svg>
);
const ClockIcon = () => (
  <svg
    className="h-4 w-4"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      clipRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
      fillRule="evenodd"
    />
  </svg>
);

const MyCharacterModal = ({ game }: { game: IGameSession }) => {
  const intl = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { role, scenarioRole, gameRoleState, loading } = useGameRole({
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
          <p className="text-large text-gray-200 mt-2 mb-2">
            <FormattedMessage
              defaultMessage="Active tags for your character:"
              id="game.myCharacterModal.actionsAvailable"
            />
          </p>
          {/*TODO: Remove this trash code*/}
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-gray-100">
              {gameRoleState?.appliedTags.map((appliedTag) => {
                const { tag, userEmail, appliedToUserAt, id } = appliedTag;

                const isExpiring =
                  tag && tag.expiresAfterMinutes && tag.expiresAfterMinutes > 0;

                return (
                  <li key={id} className="py-5">
                    <div className="flex items-center space-x-4">
                      <div className="min-w-0 flex-1">
                        {/* Main Tag Value */}
                        <p className="truncate text-base font-semibold text-stone-300">
                          {tag.value}
                        </p>
                        {/* Secondary Details: Who and When */}
                        <p className="truncate text-sm text-gray-500">
                          <FormattedMessage
                            defaultMessage="By {userEmail} on {appliedDate}"
                            id="game.myCharacterModal.appliedByOn"
                            values={{
                              userEmail: (
                                <span className="font-medium">{userEmail}</span>
                              ),
                              appliedDate: (
                                <FormattedDate
                                  day="numeric"
                                  month="long"
                                  value={appliedToUserAt.toString()}
                                  year="numeric"
                                />
                              ),
                            }}
                          />
                        </p>
                      </div>
                      {/* Badges on the right side */}
                      <div className="inline-flex items-center space-x-2">
                        {tag.isUnique && (
                          <span
                            className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600"
                            title={intl.formatMessage({
                              id: "tag.unique.tooltip",
                              defaultMessage: "This tag is unique",
                            })}
                          >
                            <ShieldCheckIcon /> Unique
                          </span>
                        )}
                        {isExpiring && (
                          <span
                            className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-600"
                            title={intl.formatMessage({
                              id: "tag.expiring.tooltip",
                              defaultMessage: "This tag expires",
                            })}
                          >
                            <ClockIcon /> Expires
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </CardBody>
      </Card>
    );
  };

  const MyCharacterModalElement = (
    <Modal
      isOpen={isModalOpen}
      placement="center"
      size="4xl"
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
