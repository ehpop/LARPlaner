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
  const [touched, setTouched] = useState({
    description: false,
    gmNotes: false,
    selectedRole: false,
  });

  const handleTouched = (key: keyof typeof touched) => {
    setTouched({ ...touched, [key]: true });
  };

  const roleDescription = (
    <Textarea
      isRequired
      defaultValue={role.scenarioDescription}
      description={intl.formatMessage({
        id: "role.display.description.description",
        defaultMessage:
          "Description of the character visible to the user. Description is specific to this scenario.",
      })}
      errorMessage={intl.formatMessage({
        id: "role.display.description.error",
        defaultMessage: "Description is required",
      })}
      isDisabled={!isBeingEdited}
      isInvalid={touched.description && !role.scenarioDescription}
      label={intl.formatMessage({
        id: "role.display.description.label",
        defaultMessage: "Description in the scenario",
      })}
      size="lg"
      variant="underlined"
      onChange={(e) => {
        handleRoleChange(index, {
          ...role,
          scenarioDescription: e.target.value,
        });
        setRole({ ...role, scenarioDescription: e.target.value });
        handleTouched("description");
      }}
    />
  );
  const roleGMNotes = (
    <Textarea
      isRequired
      defaultValue={role.gmNotes}
      description={intl.formatMessage({
        id: "role.display.gm.notes.description",
        defaultMessage: "Roles notes visible only to the GM",
      })}
      errorMessage={intl.formatMessage({
        id: "role.display.gm.notes.error",
        defaultMessage: "GM notes are required",
      })}
      isDisabled={!isBeingEdited}
      isInvalid={touched.gmNotes && !role.gmNotes}
      label={intl.formatMessage({
        id: "role.display.gm.notes.label",
        defaultMessage: "GM Notes",
      })}
      size="lg"
      variant="underlined"
      onChange={(e) => {
        handleRoleChange(index, {
          ...role,
          gmNotes: e.target.value,
        });
        setRole({ ...role, gmNotes: e.target.value });
        handleTouched("gmNotes");
      }}
    />
  );

  const roleSelect = (
    <Select
      isRequired
      className="w-1/2"
      defaultSelectedKeys={role.id ? [String(role.id)] : []}
      errorMessage={intl.formatMessage({
        id: "role.select.error",
        defaultMessage: "Role is required",
      })}
      isDisabled={!isBeingEdited}
      isInvalid={touched.selectedRole && !role.roleId}
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
        handleTouched("selectedRole");
      }}
    >
      {availableRoles.map((role) => (
        <SelectItem key={String(role.id)} value={role.name}>
          {role.name}
        </SelectItem>
      ))}
    </Select>
  );

  const controlButtons = (
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
  );

  return (
    <div className="w-full flex flex-col border-1 sm:p-3 p-1 bg-custom-light-gradient dark:bg-custom-dark-gradient">
      <div className="w-full flex flex-row justify-between items-baseline">
        {roleSelect}
        {controlButtons}
      </div>
      <div className={showRole ? "" : "hidden"}>
        {roleDescription}
        {roleGMNotes}
      </div>
    </div>
  );
};
