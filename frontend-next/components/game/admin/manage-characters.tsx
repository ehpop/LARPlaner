import { FormattedMessage, useIntl } from "react-intl";
import { useCallback, useEffect, useState } from "react";
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
  Spinner,
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
import { ITag } from "@/types/tags.types";

const ManageCharacters = ({
  gameId,
  event,
}: {
  gameId: IGameSession["id"];
  event: IEvent;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [error, setError] = useState<string | null>(null);
  const [game, setGame] = useState<IGameSession | null>(null);

  useEffect(() => {
    if (!isModalOpen || !gameId) {
      setGame(null);
      setError(null);

      return;
    }

    setIsLoading(true);
    setError(null);
    gameService
      .getById(gameId)
      .then((response) => {
        if (response.success) {
          setGame(response.data);
        } else {
          setError(response.data ?? "Failed to load game data.");
          toast(response.data ?? "Failed to load game data.", {
            type: "error",
          });
          setGame(null);
        }
      })
      .catch((err) => {
        setError(err);
        toast(err, { type: "error" });
        setGame(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isModalOpen, gameId]); // Dependency array

  const handleGameUpdate = useCallback((updatedGame: IGameSession) => {
    setGame(updatedGame);
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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

      <Modal
        isOpen={isModalOpen}
        placement="center"
        scrollBehavior="inside"
        size="full"
        onClose={handleCloseModal}
        onOpenChange={setIsModalOpen}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <FormattedMessage
                  defaultMessage="Manage characters"
                  id="game.manageCharacters.modal.header"
                />
              </ModalHeader>
              <ModalBody>
                {isLoading && <Spinner label="Loading game data..." />}
                {error && !isLoading && (
                  <p className="text-danger">
                    <FormattedMessage
                      defaultMessage="Error loading game data: {error}"
                      id="game.manageCharacters.error"
                      values={{ error }}
                    />
                  </p>
                )}
                {!isLoading && !error && game && (
                  <ManageCharactersForm
                    event={event}
                    game={game}
                    onGameUpdate={handleGameUpdate}
                  />
                )}
                {!isLoading && !error && !game && (
                  <FormattedMessage
                    defaultMessage="No game data loaded."
                    id="game.manageCharacters.noGameData"
                  />
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="bordered" onPress={onClose}>
                  <FormattedMessage defaultMessage="Close" id="common.close" />
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ManageCharacters;

const ManageCharactersForm = ({
  event,
  game,
  onGameUpdate,
}: {
  event: IEvent;
  game: IGameSession;
  onGameUpdate: (updatedGame: IGameSession) => void;
}) => {
  const intl = useIntl();
  const router = useRouter();

  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<IGameRoleState | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [editingTags, setEditingTags] = useState<ITag[]>([]);

  const openEditModal = (role: IGameRoleState) => {
    setEditingTags(role.activeTags);
    setSelectedRole(role);
    setIsEditingModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditingModalOpen(false);
    setSelectedRole(null);
    setEditingTags([]);
    setIsSaving(false);
  };

  const handleSaveRoleTags = () => {
    if (!selectedRole) return;

    setIsSaving(true);

    const updatedRole = {
      ...selectedRole,
      activeTags: editingTags,
    };

    const updatedGameData = {
      ...game,
      assignedRoles: game.assignedRoles.map((role) =>
        role.scenarioRoleId === updatedRole.scenarioRoleId ? updatedRole : role,
      ),
    } as IGameSession;

    gameService
      .update(game.id, updatedGameData)
      .then((response) => {
        if (response.success) {
          toast("Role tags updated successfully", { type: "success" });
          onGameUpdate(response.data);
          closeEditModal();
        } else {
          toast(response.data ?? "Failed to update role tags.", {
            type: "error",
          });
        }
      })
      .catch((err) => {
        toast(err, { type: "error" });
      })
      .finally(() => {
        setIsSaving(false);
      });
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
        <TableBody
          emptyContent={"No roles assigned."}
          items={game.assignedRoles}
        >
          {(role) => (
            <TableRow key={role.scenarioRoleId}>
              <TableCell>{role.scenarioRoleId}</TableCell>
              <TableCell>{role.activeTags.length}</TableCell>
              <TableCell>{role.assignedEmail ?? "N/A"}</TableCell>
              <TableCell>
                <Dropdown>
                  <DropdownTrigger>
                    <Button size="sm" variant="bordered">
                      <FormattedMessage
                        defaultMessage="Actions"
                        id="game.manageCharacters.actions.button"
                      />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label={`Actions for role ${role.scenarioRoleId}`}
                    disabledKeys={role.assignedUserID ? [] : ["message-player"]}
                    variant="bordered"
                  >
                    <DropdownSection title="Role Actions">
                      <DropdownItem
                        key="role-tags"
                        onPress={() => openEditModal(role)}
                      >
                        <FormattedMessage
                          defaultMessage="Edit Role Tags"
                          id="game.manageCharacters.editRoleTags"
                        />
                      </DropdownItem>
                      <DropdownItem
                        key="message-player"
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
          )}
        </TableBody>
      </Table>

      <Modal
        isOpen={isEditingModalOpen}
        scrollBehavior="inside"
        size="4xl"
        onClose={closeEditModal}
        onOpenChange={setIsEditingModalOpen}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <FormattedMessage
                  defaultMessage="Edit Tags for Role {roleId}"
                  id="game.manageCharacters.editTags.header"
                  values={{ roleId: selectedRole?.scenarioRoleId ?? "..." }}
                />
              </ModalHeader>
              <ModalBody>
                {selectedRole ? (
                  <InputTagsWithTable
                    addedTags={editingTags}
                    inputLabel={intl.formatMessage({
                      defaultMessage: "Add active tag",
                      id: "input-with-chips.addTag",
                    })}
                    setAddedTags={setEditingTags}
                  />
                ) : (
                  <FormattedMessage
                    defaultMessage="No role selected for editing."
                    id="game.manageCharacters.noRoleSelectedForEdit"
                  />
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  isDisabled={isSaving}
                  variant="bordered"
                  onPress={onClose}
                >
                  <FormattedMessage
                    defaultMessage="Cancel"
                    id="common.cancel"
                  />
                </Button>
                <Button
                  color="success"
                  isDisabled={isSaving || !selectedRole}
                  isLoading={isSaving}
                  variant="solid"
                  onPress={handleSaveRoleTags}
                >
                  <FormattedMessage
                    defaultMessage="Save Changes"
                    id="common.saveChanges"
                  />
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
