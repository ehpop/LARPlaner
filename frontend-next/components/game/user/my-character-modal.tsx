import { ReactNode, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import { FormattedDate, FormattedMessage, useIntl } from "react-intl";

import { IGameRoleState, IGameSession } from "@/types/game.types";
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

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  return (
    <>
      <Button variant="bordered" onPress={handleOpen}>
        <FormattedMessage
          defaultMessage="My character"
          id="game.myCharacterModal.button.label"
        />
      </Button>
      <Modal
        isOpen={isModalOpen}
        placement="center"
        size="4xl"
        onOpenChange={setIsModalOpen}
      >
        <ModalContent>
          <ModalHeader>
            {role ? (
              <FormattedMessage
                defaultMessage="Details for character: {characterName}"
                id="game.myCharacterModal.title"
                values={{ characterName: role.name }}
              />
            ) : (
              <FormattedMessage
                defaultMessage="An error occured"
                id="game.myCharacterModal.title.error"
              />
            )}
          </ModalHeader>
          <ModalBody>
            <MyCharacterModalBody
              gameRoleState={gameRoleState}
              loading={loading}
              role={role}
              scenarioRole={scenarioRole}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="bordered" onPress={handleClose}>
              <FormattedMessage defaultMessage="Close" id="common.close" />
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MyCharacterModal;

interface AppliedTagListItemProps {
  appliedTag: IAppliedTag;
}

const AppliedTagListItem = ({ appliedTag }: AppliedTagListItemProps) => {
  const intl = useIntl();
  const { tag, appliedToUserAt } = appliedTag;

  if (!tag) {
    return null;
  }

  const isExpiring =
    tag.expiresAfterMinutes !== undefined && tag.expiresAfterMinutes > 0;

  return (
    <li className="py-5">
      <div className="flex items-center space-x-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-stone-300">
            {tag.value}
          </p>
          <p className="truncate text-sm text-gray-500">
            <FormattedMessage
              defaultMessage="Applied on {appliedDate}"
              id="game.myCharacterModal.appliedByOn"
              values={{
                appliedDate: (
                  <FormattedDate
                    day="numeric"
                    hour="numeric"
                    minute="numeric"
                    month="long"
                    second="numeric"
                    value={appliedToUserAt.toString()}
                    year="numeric"
                  />
                ),
              }}
            />
          </p>
        </div>
        <div className="inline-flex items-center space-x-2">
          {tag.isUnique && (
            <MobileTooltip
              content={intl.formatMessage({
                id: "tag.unique.tooltip",
                defaultMessage: "This tag is unique",
              })}
            >
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                ✅ <FormattedMessage defaultMessage="Unique" id="tag.unique" />
              </span>
            </MobileTooltip>
          )}
          {isExpiring && (
            <MobileTooltip
              content={intl.formatMessage({
                id: "tag.expiring.tooltip",
                defaultMessage: "This tag expires",
              })}
            >
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-600">
                ⌛{" "}
                <FormattedMessage defaultMessage="Expiring" id="tag.expiring" />
              </span>
            </MobileTooltip>
          )}
        </div>
      </div>
    </li>
  );
};

interface MyCharacterModalBodyProps {
  loading: boolean;
  role: IRole | null;
  scenarioRole?: IScenarioRole | null;
  gameRoleState?: IGameRoleState | null;
}

const CenteredContent = ({ children }: { children: ReactNode }) => (
  <div className="w-full flex justify-center">{children}</div>
);

const MyCharacterModalBody = ({
  loading,
  role,
  scenarioRole,
  gameRoleState,
}: MyCharacterModalBodyProps) => {
  if (loading) {
    return (
      <CenteredContent>
        <Spinner />
      </CenteredContent>
    );
  }

  if (!role || !scenarioRole || !gameRoleState) {
    return (
      <CenteredContent>
        <p>
          <FormattedMessage
            defaultMessage="Cannot load role data."
            id="game.myCharacterModal.error.noData"
          />
        </p>
      </CenteredContent>
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
              scenarioRoleName: scenarioRole.descriptionForOwner,
            }}
          />
        </p>
        <p className="text-large text-gray-200 mt-2 mb-2">
          <FormattedMessage
            defaultMessage="Active tags for your character:"
            id="game.myCharacterModal.actionsAvailable"
          />
        </p>
        <div className="flow-root">
          <ul className="divide-y divide-gray-100">
            {gameRoleState.appliedTags.map((appliedTag) => (
              <AppliedTagListItem key={appliedTag.id} appliedTag={appliedTag} />
            ))}
          </ul>
        </div>
      </CardBody>
    </Card>
  );
};
