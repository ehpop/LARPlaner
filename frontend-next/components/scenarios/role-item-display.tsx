import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Textarea,
} from "@heroui/react";
import { useMemo, useState } from "react";
import { Control, Controller } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { IRole } from "@/types/roles.types";
import { IScenario } from "@/types/scenario.types";

interface RoleItemProps {
  control: Control<IScenario>;
  index: number;
  remove: (index: number) => void;
  availableRoles: IRole[];
  isBeingEdited?: boolean;
  disabledRoleIds: Set<string>;
}

export const RoleItem = ({
  control,
  index,
  remove,
  availableRoles,
  isBeingEdited,
  disabledRoleIds,
}: RoleItemProps) => {
  const intl = useIntl();
  const [showRole, setShowRole] = useState(true);

  const [filterText, setFilterText] = useState("");

  const filteredRoles = useMemo(() => {
    if (!filterText) {
      return availableRoles;
    }

    return availableRoles.filter((role) =>
      role.name.toLowerCase().includes(filterText.toLowerCase()),
    );
  }, [availableRoles, filterText]);

  return (
    <div className="w-full flex flex-col border-1 sm:p-3 p-1 bg-custom-light-gradient dark:bg-custom-dark-gradient">
      <div className="w-full flex flex-row justify-between items-baseline">
        <Controller
          control={control}
          name={`roles.${index}.roleId`}
          render={({ field, fieldState }) => (
            <Autocomplete
              isRequired
              className="w-1/2"
              disabledKeys={disabledRoleIds}
              errorMessage={fieldState.error?.message}
              isDisabled={!isBeingEdited}
              isInvalid={!!fieldState.error}
              items={filteredRoles}
              label={intl.formatMessage({
                defaultMessage: "Role name",
                id: "role.name",
              })}
              selectedKey={field.value}
              size="sm"
              variant="underlined"
              onInputChange={setFilterText}
              onSelectionChange={(key) => field.onChange(key)}
            >
              {(role) => (
                <AutocompleteItem key={role.id!}>{role.name}</AutocompleteItem>
              )}
            </Autocomplete>
          )}
          rules={{
            required: intl.formatMessage({
              defaultMessage: "Role is required",
              id: "role.select.error",
            }),
          }}
        />
        <div className="flex flex-row lg:space-x-2 space-x-1">
          <Button
            color="default"
            size="sm"
            variant="bordered"
            onPress={() => setShowRole(!showRole)}
          >
            {showRole ? "-" : "+"}
          </Button>
          {isBeingEdited && (
            <Button
              color="danger"
              size="sm"
              variant="bordered"
              onPress={() => remove(index)}
            >
              <FormattedMessage defaultMessage={"Remove"} id={"role.remove"} />
            </Button>
          )}
        </div>
      </div>
      {showRole && (
        <div className="space-y-2 pt-2">
          <Controller
            control={control}
            name={`roles.${index}.descriptionForGM`}
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                isRequired
                description={intl.formatMessage({
                  defaultMessage: "Description for GM",
                  id: "role.display.description.descriptionForGM",
                })}
                errorMessage={fieldState.error?.message}
                isDisabled={!isBeingEdited}
                isInvalid={!!fieldState.error}
                label={intl.formatMessage({
                  defaultMessage: "Description for GM",
                  id: "role.display.description.descriptionForGM.label",
                })}
                size="lg"
                variant="underlined"
              />
            )}
            rules={{
              required: intl.formatMessage({
                defaultMessage: "Description for GM is required",
                id: "role.display.description.descriptionForGM.error",
              }),
            }}
          />
          <Controller
            control={control}
            name={`roles.${index}.descriptionForOwner`}
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                isRequired
                description={intl.formatMessage({
                  defaultMessage: "Description for owner",
                  id: "role.display.description.descriptionForOwner",
                })}
                errorMessage={fieldState.error?.message}
                isDisabled={!isBeingEdited}
                isInvalid={!!fieldState.error}
                label={intl.formatMessage({
                  defaultMessage: "Description for owner",
                  id: "role.display.description.descriptionForOwner.label",
                })}
                size="lg"
                variant="underlined"
              />
            )}
            rules={{
              required: intl.formatMessage({
                defaultMessage: "Description for owner is required",
                id: "role.display.description.descriptionForOwner.error",
              }),
            }}
          />
          <Controller
            control={control}
            name={`roles.${index}.descriptionForOthers`}
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                isRequired
                description={intl.formatMessage({
                  defaultMessage: "Description for others",
                  id: "role.display.description.descriptionForOthers",
                })}
                errorMessage={fieldState.error?.message}
                isDisabled={!isBeingEdited}
                isInvalid={!!fieldState.error}
                label={intl.formatMessage({
                  defaultMessage: "Description for others",
                  id: "role.display.description.descriptionForOthers.label",
                })}
                size="lg"
                variant="underlined"
              />
            )}
            rules={{
              required: intl.formatMessage({
                defaultMessage: "Description for others is required",
                id: "role.display.description.descriptionForOthers.error",
              }),
            }}
          />
        </div>
      )}
    </div>
  );
};
