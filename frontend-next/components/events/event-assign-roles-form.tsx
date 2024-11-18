import { Autocomplete, AutocompleteItem, Input } from "@nextui-org/react";
import { FormattedMessage, useIntl } from "react-intl";
import React, { useState } from "react";

import { getRole, getScenario, userEmails } from "@/services/mock/mock-data";
import { IScenarioRole } from "@/types/scenario.types";
import { IEvent } from "@/types/event.types";
import { isValidEmail } from "@/utils/validation";

function RoleAssignmentEntry({
  event,
  setEvent,
  scenarioRole,
  isBeingEdited,
}: {
  event: IEvent;
  setEvent: (event: IEvent) => void;
  scenarioRole: IScenarioRole;
  isBeingEdited: boolean;
}) {
  const intl = useIntl();
  const role = getRole(scenarioRole.roleId as number);
  const assignedRole = event.assignedRoles.find(
    (assignedRole) => assignedRole.scenarioRoleId === scenarioRole.roleId,
  );

  const [selectedEmail, setSelectedEmail] = useState<string>(
    assignedRole?.assignedEmail || "",
  );

  const handleRoleAssignment = (
    scenarioRoleId: number,
    email: string | null,
  ) => {
    setEvent({
      ...event,
      assignedRoles: assignNewRoleOrUpdateOldOne(
        event.assignedRoles,
        scenarioRoleId,
        email || "",
      ),
    });
  };

  const assignNewRoleOrUpdateOldOne = (
    assignedRoles: any[],
    roleId: number,
    email: string,
  ) => {
    const updatedRoles = assignedRoles.filter(
      (assignedRole) => assignedRole.scenarioRoleId !== roleId,
    );

    updatedRoles.push({ scenarioRoleId: roleId, assignedEmail: email });

    return updatedRoles;
  };

  const isInvalidEmailForRoleId = (scenarioRoleId: number) => {
    const assignedRoleInEvent = event.assignedRoles.find(
      (assignedRole) => assignedRole.scenarioRoleId === scenarioRoleId,
    );

    if (assignedRoleInEvent?.assignedEmail === "") {
      return false;
    }

    return assignedRoleInEvent
      ? !isValidEmail(assignedRoleInEvent.assignedEmail)
      : false;
  };

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
        allowsCustomValue
        className="max-w-xs"
        defaultItems={userEmails}
        disabledKeys={event.assignedRoles.map((role) => role.assignedEmail)}
        errorMessage={intl.formatMessage({
          id: "events.page.display.selectEmail.error",
          defaultMessage: "You have to provide valid email",
        })}
        inputValue={selectedEmail}
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
        variant="underlined"
        onInputChange={(value) => {
          setSelectedEmail(value);
          handleRoleAssignment(scenarioRole.roleId as number, value);
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

  const assignRolesElement =
    scenario.roles.length === 0 ? (
      <div className="w-full flex flex-row space-x-3 items-baseline">
        <p>
          <FormattedMessage
            defaultMessage="No roles"
            id="events.page.display.noRoles"
          />
        </p>
      </div>
    ) : (
      <div className="w-full flex flex-col">
        {scenario.roles.map((scenarioRole) => (
          <RoleAssignmentEntry
            key={scenarioRole.roleId}
            event={event}
            isBeingEdited={isBeingEdited}
            scenarioRole={scenarioRole}
            setEvent={setEvent}
          />
        ))}
      </div>
    );

  return event.scenarioId ? (
    assignRolesElement
  ) : (
    <div className="w-full flex justify-center p-3">
      <p className="text-large">
        <FormattedMessage
          defaultMessage="Select scenario to assign roles"
          id="events.page.display.selectScenarioToAssignRoles"
        />
      </p>
    </div>
  );
};

export default EventAssignRolesForm;
