import { Autocomplete, AutocompleteItem, Input, Spinner } from "@heroui/react";
import { Control, Controller, useFieldArray } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import useRole from "@/hooks/roles/use-role";
import { userEmails } from "@/services/mock/mock-data";
import { IEvent } from "@/types/event.types";
import { IScenario, IScenarioRole } from "@/types/scenario.types";
import { isValidEmail } from "@/utils/validation";

interface RoleAssignmentEntryProps {
  control: Control<IEvent>;
  index: number;
  scenarioRole: IScenarioRole;
  isBeingEdited: boolean;
  assignedEmails: string[];
}

function RoleAssignmentEntry({
  control,
  index,
  scenarioRole,
  isBeingEdited,
  assignedEmails,
}: RoleAssignmentEntryProps) {
  const intl = useIntl();
  const { role, loading } = useRole(scenarioRole.roleId as string);

  if (loading) {
    return (
      <div className="w-full h-16 flex items-center">
        <Spinner>
          <FormattedMessage
            defaultMessage="Loading..."
            id="events.page.display.roles.loading"
          />
        </Spinner>
      </div>
    );
  }

  if (!role) {
    return null;
  }

  return (
    <div
      key={role.id}
      className="w-full flex flex-row space-x-3 items-baseline"
    >
      <Input
        isDisabled
        className="w-1/2"
        label={intl.formatMessage({
          defaultMessage: "Role name",
          id: "events.page.display.roles",
        })}
        size="lg"
        value={role.name}
        variant="underlined"
      />

      <Controller
        control={control}
        name={`assignedRoles.${index}.assignedEmail`}
        render={({ field, fieldState }) => (
          <Autocomplete
            allowsCustomValue
            className="max-w-xs"
            defaultItems={userEmails}
            disabledKeys={assignedEmails.filter(
              (email) => email !== field.value,
            )}
            errorMessage={fieldState.error?.message}
            inputValue={field.value || ""}
            isDisabled={!isBeingEdited}
            isInvalid={!!fieldState.error}
            label={intl.formatMessage({
              defaultMessage: "Assigned email",
              id: "events.page.display.assignEmail",
            })}
            placeholder={intl.formatMessage({
              defaultMessage: "Select email",
              id: "events.page.display.selectEmail",
            })}
            variant="underlined"
            onInputChange={field.onChange}
          >
            {(item) => (
              <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
            )}
          </Autocomplete>
        )}
        rules={{
          validate: (value) => {
            // An empty string is valid (it means unassigned)
            if (!value || value.trim() === "") return true;

            // If a value exists, it must be a valid email format
            return (
              isValidEmail(value) ||
              intl.formatMessage({
                defaultMessage: "You have to provide a valid email",
                id: "events.page.display.invalidEmail",
              })
            );
          },
        }}
      />
    </div>
  );
}

interface EventAssignRolesFormProps {
  control: Control<IEvent>;
  scenario: IScenario | undefined;
  isBeingEdited: boolean;
}

const EventAssignRolesForm = ({
  control,
  scenario,
  isBeingEdited,
}: EventAssignRolesFormProps) => {
  const { fields } = useFieldArray({
    control,
    name: "assignedRoles",
  });

  const assignedEmails = fields
    .map((field) => field.assignedEmail)
    .filter(Boolean);

  if (!scenario || !scenario.id) {
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

  if (scenario.roles.length === 0) {
    return (
      <div className="w-full flex flex-row space-x-3 items-baseline">
        <p>
          <FormattedMessage
            defaultMessage="This scenario has no roles defined."
            id="events.page.display.noRoles"
          />
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col space-y-3">
      {scenario.roles.map((scenarioRole, index) => {
        const field = fields[index];

        if (!field) return null;

        return (
          <RoleAssignmentEntry
            key={field.id}
            assignedEmails={assignedEmails}
            control={control}
            index={index}
            isBeingEdited={isBeingEdited}
            scenarioRole={scenarioRole}
          />
        );
      })}
    </div>
  );
};

export default EventAssignRolesForm;
