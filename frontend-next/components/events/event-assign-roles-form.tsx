import { Autocomplete, AutocompleteItem, Input } from "@nextui-org/react";
import { useIntl } from "react-intl";
import { Key, useState } from "react";

import { IEvent, IScenarioRole } from "@/types";
import { getRole, getScenario, userEmails } from "@/data/mock-data";

function RoleAssignmentEntry({
  event,
  scenarioRole,
  handleRoleAssignment,
  isBeingEdited,
  isInvalidEmailForRoleId,
}: {
  isInvalidEmailForRoleId: (scenarioRoleId: number) => boolean;
  event: IEvent;
  handleRoleAssignment: (scenarioRoleId: number, key: Key | null) => void;
  scenarioRole: IScenarioRole;
  isBeingEdited: boolean;
}) {
  const intl = useIntl();
  const role = getRole(scenarioRole.roleId as number);

  return (
    <div
      key={role.id}
      className="w-full flex flex-row space-x-3 items-baseline"
    >
      <Input
        isDisabled
        className="w-1/2"
        defaultValue={role.name}
        label={intl.formatMessage({
          id: "events.page.display.roles",
          defaultMessage: "Role",
        })}
        size="lg"
        variant="underlined"
      />
      <Autocomplete
        key={role.id}
        className="max-w-xs"
        defaultItems={userEmails}
        disabledKeys={event.assignedRoles.map((role) => role.assignedEmail)}
        errorMessage={intl.formatMessage({
          id: "events.page.display.selectEmail.error",
          defaultMessage: "You have to select email from the list",
        })}
        isDisabled={!isBeingEdited}
        isInvalid={isInvalidEmailForRoleId(scenarioRole.roleId as number)}
        label={intl.formatMessage({
          id: "events.page.display.assignEmail",
          defaultMessage: "Assign email",
        })}
        placeholder={intl.formatMessage({
          id: "events.page.display.selectEmail",
          defaultMessage: "Select an email...",
        })}
        selectedKey={
          event.assignedRoles
            .filter(
              (assignedRole) =>
                assignedRole.scenarioRoleId === scenarioRole.roleId,
            )
            .map((assignedRole) => assignedRole.assignedEmail)
            .at(0) || null
        }
        variant="underlined"
        onSelectionChange={(key) => {
          handleRoleAssignment(scenarioRole.roleId as number, key);
        }}
      >
        {(item) => (
          <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  );
}

const EventAssignRolesForm = ({
  event,
  setEvent,
  isBeingEdited,
}: {
  event: IEvent;
  setEvent: (event: IEvent) => void;
  isBeingEdited: boolean;
}) => {
  const scenario = getScenario(event?.scenarioId as number);

  const mapAllAssignedRolesToUntouched = (scenarioId: number | null) => {
    if (scenarioId === null) {
      return [];
    }
    const scenario = getScenario(scenarioId);
    const scenarioRoles = scenario.roles;

    return scenarioRoles.map((role) => ({
      scenarioRoleId: role.roleId,
      touched: false,
    }));
  };

  const [touched, setTouched] = useState({
    assignedRoles: mapAllAssignedRolesToUntouched(event.scenarioId),
  });

  const assignNewRoleOrUpdateOldOne = (
    assignedRoles: any,
    roleId: number,
    email: string,
  ) => {
    const newAssignedRoles = assignedRoles.filter(
      (assignedRole: any) => assignedRole.scenarioRoleId !== roleId,
    );

    newAssignedRoles.push({ scenarioRoleId: roleId, assignedEmail: email });

    return newAssignedRoles;
  };

  const handleRoleAssignment = (scenarioRoleId: number, key: Key | null) => {
    const assignedRole = touched.assignedRoles.find(
      (assignedRole) => assignedRole.scenarioRoleId === scenarioRoleId,
    );

    if (assignedRole !== undefined) {
      setTouched({
        ...touched,
        assignedRoles: touched.assignedRoles.map((role) =>
          role.scenarioRoleId === assignedRole.scenarioRoleId
            ? { ...role, touched: true }
            : role,
        ),
      });
    }

    if (key !== null) {
      setEvent({
        ...event,
        assignedRoles: assignNewRoleOrUpdateOldOne(
          event.assignedRoles,
          scenarioRoleId,
          key as string,
        ),
      });
    } else {
      setEvent({
        ...event,
        assignedRoles: event.assignedRoles.filter(
          (assignedRole) => assignedRole.scenarioRoleId !== scenarioRoleId,
        ),
      });
    }
  };

  const isInvalidEmailForRoleId = (scenarioRoleId: number) => {
    const touchedEntry = touched.assignedRoles.find(
      (assignedRole) => assignedRole.scenarioRoleId === scenarioRoleId,
    );

    if (touchedEntry && !touchedEntry.touched) {
      return false;
    }

    const assignedRoleInEvent = event.assignedRoles.find(
      (assignedRole) => assignedRole.scenarioRoleId === scenarioRoleId,
    );

    return (
      assignedRoleInEvent === undefined ||
      assignedRoleInEvent.assignedEmail === "" ||
      assignedRoleInEvent.assignedEmail === undefined ||
      assignedRoleInEvent.assignedEmail === null
    );
  };

  return (
    <div className="w-full flex flex-col">
      {scenario.roles.map((scenarioRole) => (
        <RoleAssignmentEntry
          key={scenarioRole.roleId}
          event={event}
          handleRoleAssignment={handleRoleAssignment}
          isBeingEdited={isBeingEdited}
          isInvalidEmailForRoleId={isInvalidEmailForRoleId}
          scenarioRole={scenarioRole}
        />
      ))}
    </div>
  );
};

export default EventAssignRolesForm;
