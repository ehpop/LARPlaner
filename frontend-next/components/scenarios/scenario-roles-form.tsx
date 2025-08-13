import { Button } from "@heroui/react";
import React, { useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import { RoleItem } from "@/components/scenarios/role-item-display";
import { IScenario } from "@/types/scenario.types";
import { IRole } from "@/types/roles.types";
import { emptyScenarioRole } from "@/types/initial-types";

interface ScenarioRolesFormProps {
  availableRoles: IRole[];
  isBeingEdited?: boolean;
}

export const ScenarioRolesForm = ({
  availableRoles,
  isBeingEdited,
}: ScenarioRolesFormProps) => {
  const { control } = useFormContext<IScenario>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "roles",
  });

  const watchedRoles = useWatch({
    control,
    name: "roles",
  });

  const addRole = () => {
    append({ ...emptyScenarioRole });
  };

  const disabledRoleIds = useMemo(() => {
    if (!watchedRoles) {
      return new Set<string>();
    }

    return new Set(watchedRoles.map((role) => role.roleId as string));
  }, [watchedRoles]);

  return (
    <div className="w-full flex flex-col space-y-3">
      <div className="w-full flex flex-col space-y-3">
        {fields.length === 0 ? (
          <div className="w-full flex justify-center">
            <p>
              <FormattedMessage
                defaultMessage={"No roles in scenario"}
                id={"scenarios.id.page.noRolesInScenario"}
              />
            </p>
          </div>
        ) : (
          fields.map((field, index) => (
            <RoleItem
              key={field.id}
              availableRoles={availableRoles}
              disabledRoleIds={disabledRoleIds}
              index={index}
              isBeingEdited={isBeingEdited || false}
              remove={remove}
            />
          ))
        )}
      </div>
      {isBeingEdited && (
        <div className="w-full flex justify-center pt-3">
          <Button color="success" variant="solid" onPress={addRole}>
            <FormattedMessage
              defaultMessage={"Add role"}
              id={"scenarios.id.page.addRoleButton"}
            />
          </Button>
        </div>
      )}
    </div>
  );
};
