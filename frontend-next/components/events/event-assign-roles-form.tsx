import { Autocomplete, AutocompleteItem, Input } from "@heroui/react";
import { FormattedMessage, useIntl } from "react-intl";
import React, { useState } from "react";

import {
  getRoleById,
  getScenarioById,
  userEmails,
} from "@/services/mock/mock-data";
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
  const role = getRoleById(scenarioRole.roleId); //TODO: Fetch by API
  const assignedRole = event.assignedRoles.find(
    (assignedRole) => assignedRole.scenarioRoleId === scenarioRole.id,
  );

  const [selectedEmail, setSelectedEmail] = useState<string>(
    assignedRole?.assignedEmail || "",
  );

  const handleRoleAssignment = (
    scenarioRoleId: IScenarioRole["id"],
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
    assignedRoles: IEvent["assignedRoles"],
    scenarioRoleId: IScenarioRole["id"],
    email: string,
  ) => {
    const updatedRoles = assignedRoles.filter(
      (assignedRole) => assignedRole.scenarioRoleId !== scenarioRoleId,
    );

    updatedRoles.push({ scenarioRoleId: scenarioRoleId, assignedEmail: email });

    return updatedRoles;
  };

  const isInvalidEmailForRoleId = (scenarioRoleId: IScenarioRole["id"]) => {
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
        key={scenarioRole.id}
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
        isInvalid={isInvalidEmailForRoleId(scenarioRole.id)}
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
          handleRoleAssignment(scenarioRole.id, value);
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
  const scenario = getScenarioById(event?.scenarioId); //TODO: Fetch by API

  if (!scenario || !event.scenarioId) {
    return (
      <div className="w-full flex justify-center p-3">
        <p className="text-large">
          <FormattedMessage
            defaultMessage="Select scenario to assign roles"
            id="events.page.display.selectScenarioToAssignRoles"
          />
        </p>
      </div>
    );
  }

  return scenario.roles.length === 0 ? (
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
};

export default EventAssignRolesForm;
