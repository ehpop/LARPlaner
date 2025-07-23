import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useRouter } from "next/navigation";

import { TagsProvider } from "@/providers/tags-provider";
import { IGameRoleState, IGameSession } from "@/types/game.types";
import { EditRoleTagsModal } from "@/components/game/admin/manage-characters/edit-role-tags-modal";
import { IEvent } from "@/types/event.types";

interface RolesTableProps {
  game: IGameSession;
  event: IEvent;
  onGameUpdate: (updatedGame: IGameSession) => void;
}

export const RolesTable = ({ game, event, onGameUpdate }: RolesTableProps) => {
  const intl = useIntl();
  const router = useRouter();

  const [roleToEdit, setRoleToEdit] = useState<IGameRoleState | null>(null);

  const handleEdit = (role: IGameRoleState) => setRoleToEdit(role);
  const handleCloseModal = () => setRoleToEdit(null);

  const handleSaveSuccess = (updatedGame: IGameSession) => {
    onGameUpdate(updatedGame);
    handleCloseModal();
  };

  return (
    <TagsProvider>
      <Table
        aria-label={intl.formatMessage({
          id: "admin.manage-characters.roles.table",
          defaultMessage: "Characters to manage",
        })}
      >
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
          emptyContent={intl.formatMessage({
            id: "game.manageCharacters.tags.noContent",
            defaultMessage: "No roles in this game",
          })}
          items={game.assignedRoles ?? []}
        >
          {(role) => (
            <TableRow key={role.scenarioRoleId}>
              <TableCell>{role.scenarioRoleId}</TableCell>
              <TableCell>{role.appliedTags.length}</TableCell>
              <TableCell>{role.assignedEmail ?? "N/A"}</TableCell>
              <TableCell>
                <Dropdown>
                  <DropdownTrigger>
                    <Button size="sm" variant="bordered">
                      Actions
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    disabledKeys={
                      !role.assignedUserID ? ["message-player"] : []
                    }
                    variant="bordered"
                    onAction={(key) => {
                      if (key === "role-tags") handleEdit(role);
                      else if (key === "message-player")
                        router.push(
                          `/admin/events/${event.id}/active/chats/${event.id}-${role.assignedUserID}`,
                        );
                    }}
                  >
                    <DropdownSection title="Role Actions">
                      <DropdownItem key="role-tags">
                        Edit Role Tags
                      </DropdownItem>
                      <DropdownItem key="message-player">
                        Message Player
                      </DropdownItem>
                    </DropdownSection>
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {roleToEdit && (
        <EditRoleTagsModal
          isOpen={!!roleToEdit}
          role={roleToEdit}
          onClose={handleCloseModal}
          onSaveSuccess={handleSaveSuccess}
        />
      )}
    </TagsProvider>
  );
};
