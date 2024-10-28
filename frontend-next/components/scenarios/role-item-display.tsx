import { FormattedMessage, useIntl } from "react-intl";
import React, { useState } from "react";
import { Button, Select, SelectItem, Textarea } from "@nextui-org/react";

import { IRoleList, IScenarioRole } from "@/types";
import { emptyScenarioRole } from "@/data/mock-data";

export const RoleItem = ({
  index,
  handleRoleChange,
  handleRoleRemove,
  availableRoles,
  initialRole,
  isBeingEdited,
}: {
  index: number;
  handleRoleChange: (index: number, role: IScenarioRole) => void;
  handleRoleRemove: (index: number) => void;
  availableRoles: IRoleList;
  initialRole?: IScenarioRole;
  isBeingEdited?: boolean;
}) => {
  const intl = useIntl();
  const [showRole, setShowRole] = useState(true);
  const [role, setRole] = useState<IScenarioRole>(
    initialRole || {
      ...emptyScenarioRole,
      id: 1,
      scenarioId: 1,
      roleId: 1,
    },
  );

  const roleDescription = (
    <Textarea
      defaultValue={role.description}
      description={intl.formatMessage({
        id: "role.display.description.description",
        defaultMessage:
          "Description of the character visible to the user. Description is specific to this scenario.",
      })}
      isDisabled={!isBeingEdited}
      label={intl.formatMessage({
        id: "role.display.description.label",
        defaultMessage: "Description in the scenario",
      })}
      size="lg"
      variant="underlined"
    />
  );
  const roleGMNotes = (
    <Textarea
      defaultValue={role.gmNotes}
      description={intl.formatMessage({
        id: "role.display.gm.notes.description",
        defaultMessage: "Roles notes visible only to the GM",
      })}
      isDisabled={!isBeingEdited}
      label={intl.formatMessage({
        id: "role.display.gm.notes.label",
        defaultMessage: "GM Notes",
      })}
      size="lg"
      variant="underlined"
    />
  );

  return (
    <div className="w-full flex flex-col border-1 sm:p-3 p-1 bg-custom-light-gradient dark:bg-custom-dark-gradient">
      <div className="w-full flex flex-row justify-between items-baseline">
        <Select
          className="w-1/2"
          defaultSelectedKeys={role.id ? [String(role.id)] : []}
          isDisabled={!isBeingEdited}
          label={intl.formatMessage({
            id: "role.name",
            defaultMessage: "Role name",
          })}
          size="sm"
          variant="underlined"
          onChange={(e) => {
            handleRoleChange(index, {
              ...role,
              roleId: parseInt(e.target.value, 10),
            });
            setRole({
              ...role,
              roleId: parseInt(e.target.value, 10),
            });
          }}
        >
          {availableRoles.map((role) => (
            <SelectItem key={String(role.id)} value={role.name}>
              {role.name}
            </SelectItem>
          ))}
        </Select>
        <div className="flex flex-row lg:space-x-2 space-x-1">
          <Button
            color="default"
            size="sm"
            variant="bordered"
            onPress={() => {
              setShowRole(!showRole);
            }}
          >
            {showRole ? "-" : "+"}
          </Button>
          {isBeingEdited && (
            <Button
              color="danger"
              size="sm"
              variant="bordered"
              onPress={() => handleRoleRemove(index)}
            >
              <FormattedMessage defaultMessage={"Remove"} id={"role.remove"} />
            </Button>
          )}
        </div>
      </div>
      <div className={showRole ? "" : "hidden"}>
        {roleDescription}
        {roleGMNotes}
      </div>
    </div>
  );
};
