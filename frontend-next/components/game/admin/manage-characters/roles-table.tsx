import { useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { SortDescriptor } from "@react-types/shared";

import { TagsProvider } from "@/providers/tags-provider";
import { IGameRoleStateSummary, IGameSession } from "@/types/game.types";
import { EditRoleTagsModal } from "@/components/game/admin/manage-characters/edit-role-tags-modal";
import { IEvent } from "@/types/event.types";
import { AdminTableDisplay } from "@/components/table/admin-table-display";

interface RolesTableProps {
  game: IGameSession;
  event: IEvent;
}

export const RolesTable = ({ game, event }: RolesTableProps) => {
  const intl = useIntl();
  const router = useRouter();

  const [roleToEdit, setRoleToEdit] = useState<IGameRoleStateSummary | null>(
    null,
  );

  const handleEdit = (role: IGameRoleStateSummary) => setRoleToEdit(role);
  const handleCloseModal = () => setRoleToEdit(null);

  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "timestamp",
    direction: "descending",
  });

  const sortedRoles = useMemo(() => {
    if (!sortDescriptor || !sortDescriptor.column) {
      return game.assignedRoles;
    }

    return [...game.assignedRoles].sort((a, b) => {
      const first = a[
        sortDescriptor.column as keyof IGameRoleStateSummary
      ] as any;
      const second = b[
        sortDescriptor.column as keyof IGameRoleStateSummary
      ] as any;

      let cmp = 0;

      if (first < second) {
        cmp = -1;
      } else if (first > second) {
        cmp = 1;
      }

      if (sortDescriptor.direction === "descending") {
        cmp *= -1;
      }

      return cmp;
    });
  }, [game.assignedRoles, sortDescriptor]);

  const roleTableColumns = [
    {
      key: "roleName",
      label: intl.formatMessage({
        defaultMessage: "Role Name",
        id: "game.manageCharacters.roleName",
      }),
      allowsSorting: true,
    },
    {
      key: "roleDescription",
      label: intl.formatMessage({
        defaultMessage: "Role Description (GM version)",
        id: "game.manageCharacters.roleNameForGM",
      }),
      allowsSorting: true,
    },
    {
      key: "tagsCount",
      label: intl.formatMessage({
        defaultMessage: "Tags count",
        id: "game.manageCharacters.tagsCount",
      }),
    },
    {
      key: "assignedEmail",
      label: intl.formatMessage({
        defaultMessage: "Assigned email",
        id: "game.manageCharacters.assignedEmail",
      }),
    },
    {
      key: "actions",
      label: intl.formatMessage({
        defaultMessage: "Actions",
        id: "game.manageCharacters.actions",
      }),
    },
  ];

  const dropdownElement = (role: IGameRoleStateSummary) => {
    return (
      <Dropdown>
        <DropdownTrigger>
          <Button size="sm" variant="bordered">
            <FormattedMessage
              defaultMessage="Actions"
              id="rolesTable.actions.button"
            />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          disabledKeys={!role.assignedUserID ? ["message-player"] : []}
          variant="bordered"
          onAction={(key) => {
            if (key === "role-tags") handleEdit(role);
            else if (key === "message-player")
              router.push(
                `/admin/events/${event.id}/active/chats/${event.id}-${role.assignedUserID}`,
              );
          }}
        >
          <DropdownSection
            title={intl.formatMessage({
              id: "rolesTable.actions.title",
              defaultMessage: "Role Actions",
            })}
          >
            <DropdownItem key="role-tags">
              <FormattedMessage
                defaultMessage="Edit Role Tags"
                id="rolesTable.actions.editTags"
              />
            </DropdownItem>
            <DropdownItem key="message-player">
              <FormattedMessage
                defaultMessage="Message Player"
                id="rolesTable.actions.messagePlayer"
              />
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    );
  };

  const rows = useMemo(() => {
    return sortedRoles?.map((role) => ({
      // This is now always fresh data
      roleName: role.scenarioRole.role.name,
      roleDescription: role.scenarioRole.descriptionForGM,
      tagsCount: role.appliedTags.length, // This will be up-to-date!
      assignedEmail: role.assignedEmail || "N/A",
      actions: dropdownElement(role),
    }));
    // Depend on sortedRoles, which depends on the `game` prop
  }, [sortedRoles, intl]);

  return (
    <TagsProvider>
      <AdminTableDisplay
        columns={roleTableColumns}
        rows={rows}
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      />

      {roleToEdit && (
        <EditRoleTagsModal
          gameId={game.id}
          isOpen={!!roleToEdit}
          role={roleToEdit}
          onClose={handleCloseModal}
        />
      )}
    </TagsProvider>
  );
};
