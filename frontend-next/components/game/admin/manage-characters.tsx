import { FormattedMessage, useIntl } from "react-intl";
import { useEffect, useState } from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { IGameRoleState, IGameSession } from "@/types/game.types";
import { IEvent } from "@/types/event.types";
import InputTagsWithTable from "@/components/input-tags-with-table";
import gameService from "@/services/game.service";

const ManageCharacters = ({
  gameId,
  event,
}: {
  gameId: IGameSession["id"];
  event: IEvent;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [game, setGame] = useState<IGameSession | null>(null);

  useEffect(() => {
    if (!isModalOpen) return;

    gameService.getById(gameId).then((response) => {
      if (response.success) {
        setGame(response.data);
      } else {
        setError(response.data);
      }
    });
  }, [isModalOpen]);

  const ManageCharactersModalElement = (
    <Modal
      isOpen={isModalOpen}
      placement="center"
      scrollBehavior="inside"
      size="full"
      onOpenChange={(isOpen) => setIsModalOpen(isOpen)}
    >
      <ModalContent>
        <ModalHeader>
          <FormattedMessage
            defaultMessage="Manage characters"
            id="game.manageCharacters.modal.header"
          />
        </ModalHeader>
        <ModalBody>
          <div>
            {game === null || error ? (
              <p>{error}</p>
            ) : (
              <ManageCharactersForm event={event} initialGame={game} />
            )}
          </div>
        </ModalBody>
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
          defaultMessage="Manage characters"
          id="game.manageCharacters.button"
        />
      </Button>
      {ManageCharactersModalElement}
    </>
  );
};

export default ManageCharacters;

const ManageCharactersForm = ({
  event,
  initialGame,
}: {
  event: IEvent;
  initialGame: IGameSession;
}) => {
  const intl = useIntl();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<IGameRoleState | null>(null);
  const [game, setGame] = useState<IGameSession>(initialGame);

  const openModal = (role: IGameRoleState) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRole(null);
  };

  const onSaveActiveRole = () => {
    gameService
      .update(game.id, {
        ...game,
        assignedRoles: game.assignedRoles.map((role) => {
          if (
            selectedRole &&
            role.scenarioRoleId === selectedRole.scenarioRoleId
          ) {
            return selectedRole;
          }

          return role;
        }),
      } as IGameSession)
      .then((response) => {
        if (response.success) {
          toast("Role tags updated successfully", {
            type: "success",
          });

          setGame(response.data);
        } else {
          toast(response.data, {
            type: "error",
          });
        }
      });

    setIsModalOpen(false);
    setSelectedRole(null);
  };

  return (
    <>
      <Table aria-label="Roles Table">
        <TableHeader>
          <TableColumn>
            <FormattedMessage
              defaultMessage="Role ID"
              id="game.manageCharacters.roleId"
            />
          </TableColumn>
          <TableColumn>
            <FormattedMessage
              defaultMessage="Tags count"
              id="game.manageCharacters.tagsCount"
            />
          </TableColumn>
          <TableColumn>
            <FormattedMessage
              defaultMessage="Assigned email"
              id="game.manageCharacters.assignedEmail"
            />
          </TableColumn>
          <TableColumn>
            <FormattedMessage
              defaultMessage="Actions"
              id="game.manageCharacters.actions"
            />
          </TableColumn>
        </TableHeader>
        <TableBody>
          {game.assignedRoles.map((role) => (
            <TableRow key={role.scenarioRoleId}>
              <TableCell>{role.scenarioRoleId}</TableCell>
              <TableCell>{role.activeTags.length}</TableCell>
              <TableCell>{role.assignedEmail}</TableCell>
              <TableCell>
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="bordered" onPress={() => openModal(role)}>
                      <FormattedMessage
                        defaultMessage="Actions"
                        id="game.manageCharacters.actions"
                      />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownSection>
                      <DropdownItem
                        key="role tags"
                        onPress={() => openModal(role)}
                      >
                        <FormattedMessage
                          defaultMessage="Role Tags"
                          id="game.manageCharacters.roleTags"
                        />
                      </DropdownItem>
                      <DropdownItem
                        key="message player"
                        onPress={() =>
                          router.push(
                            `/admin/events/${event.id}/active/chats/${event.id}-${role.assignedUserID}`,
                          )
                        }
                      >
                        <FormattedMessage
                          defaultMessage="Message player"
                          id="game.manageCharacters.messagePlayer"
                        />
                      </DropdownItem>
                    </DropdownSection>
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal
        isOpen={isModalOpen}
        scrollBehavior="inside"
        size="4xl"
        onOpenChange={(isOpen) => {
          setIsModalOpen(isOpen);
        }}
      >
        <ModalContent>
          <ModalHeader>Role Tags</ModalHeader>
          <ModalBody>
            {!selectedRole && (
              <FormattedMessage
                defaultMessage="No role selected"
                id="game.manageCharacters.noRoleSelected"
              />
            )}
            {selectedRole && (
              <InputTagsWithTable
                addedTags={selectedRole.activeTags}
                inputLabel={intl.formatMessage({
                  defaultMessage: "Add active tag",
                  id: "input-with-chips.addTag",
                })}
                setAddedTags={(tags) => {
                  setSelectedRole({
                    ...selectedRole,
                    activeTags: tags,
                  });
                }}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <div className="flex flex-row space-x-3">
              <Button color="danger" variant="bordered" onPress={closeModal}>
                <FormattedMessage defaultMessage="Close" id="common.close" />
              </Button>
              <Button
                color="success"
                variant="solid"
                onPress={() => {
                  onSaveActiveRole();
                }}
              >
                <FormattedMessage defaultMessage="Save" id="common.save" />
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
