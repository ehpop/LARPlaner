import { Control, Controller, useFieldArray, useWatch } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { useMemo } from "react";
import { Autocomplete, AutocompleteItem, Input } from "@heroui/react";

import { IEvent } from "@/types/event.types";
import { IScenario, IScenarioRole } from "@/types/scenario.types";
import LoadingOverlay from "@/components/common/loading-overlay";
import { useRole } from "@/services/roles/useRoles";
import { isValidEmail } from "@/utils/validation";
import { useAllUserEmails } from "@/services/admin/useUsers";

interface RoleAssignmentEntryProps {
  control: Control<IEvent>;
  index: number;
  scenarioRole: IScenarioRole;
  isBeingEdited: boolean;
  assignedEmails: string[];
  allUserEmails: string[];
}

function RoleAssignmentEntry({
  control,
  index,
  scenarioRole,
  isBeingEdited,
  assignedEmails,
  allUserEmails,
}: RoleAssignmentEntryProps) {
  const intl = useIntl();
  const {
    data: role,
    isLoading,
    isError,
    error,
  } = useRole(scenarioRole.roleId as string);

  if (!role || isError) {
    return (
      <div className="w-full flex justify-center">
        <p className="text-danger">{error?.message}</p>
      </div>
    );
  }

  return (
    <LoadingOverlay
      isLoading={isLoading}
      label={intl.formatMessage({
        id: "events.event-assign-roles-form.role-assignment-entry.loading",
        defaultMessage: "Loading role details...",
      })}
    >
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
              defaultItems={allUserEmails.map((email) => {
                return {
                  label: email,
                  value: email,
                };
              })}
              disabledKeys={assignedEmails.filter(
                (email) => email !== field.value,
              )}
              errorMessage={fieldState.error?.message}
              inputValue={field.value || ""}
              isDisabled={!isBeingEdited}
              isInvalid={!!fieldState.error}
              label={intl.formatMessage({
                defaultMessage: "Assigned email",
                id: "events.page.display.assignEmai",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "Select email",
                id: "events.page.display.selectEmai",
              })}
              variant="underlined"
              onInputChange={field.onChange}
            >
              {(item) => (
                <AutocompleteItem key={item.value}>
                  {item.label}
                </AutocompleteItem>
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
    </LoadingOverlay>
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
  const { data: emails, isLoading: loadingEmails } = useAllUserEmails();

  const { fields } = useFieldArray({
    control,
    name: "assignedRoles",
  });

  const watchedRoles = useWatch({
    control,
    name: "assignedRoles",
    defaultValue: [],
  });

  const assignedEmails = useMemo(
    () => watchedRoles.map((role) => role.assignedEmail).filter(Boolean),
    [watchedRoles],
  );

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
    <LoadingOverlay isLoading={loadingEmails}>
      <div className="w-full flex flex-col space-y-3">
        {scenario.roles.map((scenarioRole, index) => {
          const field = fields[index];

          if (!field) return null;

          return (
            <RoleAssignmentEntry
              key={field.id}
              allUserEmails={emails || []}
              assignedEmails={assignedEmails}
              control={control}
              index={index}
              isBeingEdited={isBeingEdited}
              scenarioRole={scenarioRole}
            />
          );
        })}
      </div>
    </LoadingOverlay>
  );
};

export default EventAssignRolesForm;
