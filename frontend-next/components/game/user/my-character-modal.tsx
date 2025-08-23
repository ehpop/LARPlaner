"use client";

import { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import { FormattedDate, FormattedMessage, useIntl } from "react-intl";
import { ClockIcon, SparklesIcon } from "@heroicons/react/24/solid";

import { IGameRoleStateSummary, IGameSession } from "@/types/game.types";
import useGameRole from "@/hooks/use-game-role";
import { IRole } from "@/types/roles.types";
import { IScenarioRole } from "@/types/scenario.types";
import { IAppliedTag } from "@/types/tags.types";
import MobileTooltip from "@/components/common/mobile-tooltip";

const MyCharacterModal = ({ game }: { game: IGameSession }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { role, scenarioRole, gameRoleState, loading } = useGameRole({
    gameId: game.id,
    eventId: game.eventId,
  });

  return (
    <>
      <Button w-full variant="bordered" onPress={() => setIsModalOpen(true)}>
        <FormattedMessage
          defaultMessage="My character"
          id="game.myCharacterModal.button.label"
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
              {role ? (
                <FormattedMessage
                  defaultMessage="Character Details: {characterName}"
                  id="game.myCharacterModal.title"
                  values={{ characterName: role.name }}
                />
              ) : (
                <FormattedMessage
                  defaultMessage="Character Details"
                  id="game.myCharacterModal.title.generic"
                />
              )}
            </h2>
          </ModalHeader>
          <ModalBody className="p-6">
            <MyCharacterModalBody
              gameRoleState={gameRoleState}
              loading={loading}
              role={role}
              scenarioRole={scenarioRole}
            />
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

const MyCharacterModalBody = ({
  loading,
  role,
  scenarioRole,
  gameRoleState,
}: {
  loading: boolean;
  role: IRole | null;
  scenarioRole?: IScenarioRole | null;
  gameRoleState?: IGameRoleStateSummary | null;
}) => {
  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-48">
        <Spinner />
      </div>
    );
  }

  if (!role || !scenarioRole || !gameRoleState) {
    return (
      <div className="w-full flex justify-center items-center h-48">
        <p className="text-zinc-500 dark:text-zinc-400">
          <FormattedMessage
            defaultMessage="Cannot load character data."
            id="game.myCharacterModal.error.noData"
          />
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          <FormattedMessage
            defaultMessage="Your Description"
            id="game.myCharacterModal.descriptionTitle"
          />
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {scenarioRole.descriptionForOwner}
        </p>
      </div>

      <hr className="border-zinc-200 dark:border-zinc-800" />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          <FormattedMessage
            defaultMessage="Active Tags"
            id="game.myCharacterModal.activeTagsTitle"
          />
        </h3>
        {gameRoleState.appliedTags.length > 0 ? (
          <div className="space-y-3">
            {gameRoleState.appliedTags.map((appliedTag) => (
              <AppliedTagListItem key={appliedTag.id} appliedTag={appliedTag} />
            ))}
          </div>
        ) : (
          <p className="text-zinc-500 dark:text-zinc-400 italic">
            <FormattedMessage
              defaultMessage="You have no active tags."
              id="game.myCharacterModal.noActiveTags"
            />
          </p>
        )}
      </div>
    </div>
  );
};

const AppliedTagListItem = ({ appliedTag }: { appliedTag: IAppliedTag }) => {
  const intl = useIntl();
  const { tag, appliedToUserAt } = appliedTag;

  if (!tag) return null;

  const isExpiring =
    tag.expiresAfterMinutes !== undefined && tag.expiresAfterMinutes > 0;

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-start gap-4">
        <p className="font-medium text-zinc-800 dark:text-zinc-200">
          {tag.value}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 flex-shrink-0 pt-1">
          <FormattedDate
            hour="numeric"
            minute="numeric"
            value={appliedToUserAt.toDate()}
          />
        </p>
      </div>
      {(tag.isUnique || isExpiring) && (
        <div className="flex items-center gap-2">
          {tag.isUnique && (
            <MobileTooltip
              content={intl.formatMessage({
                id: "tag.unique.tooltip",
                defaultMessage: "This tag is unique.",
              })}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                <SparklesIcon className="h-4 w-4" />
                <FormattedMessage defaultMessage="Unique" id="tag.unique" />
              </span>
            </MobileTooltip>
          )}
          {isExpiring && (
            <MobileTooltip
              content={intl.formatMessage({
                id: "tag.expiring.tooltip",
                defaultMessage: "This tag expires over time.",
              })}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                <ClockIcon className="h-4 w-4" />
                <FormattedMessage defaultMessage="Expiring" id="tag.expiring" />
              </span>
            </MobileTooltip>
          )}
        </div>
      )}
    </div>
  );
};

export default MyCharacterModal;
