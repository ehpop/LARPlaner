import { FormattedMessage, useIntl } from "react-intl";
import React, { useState } from "react";
import { Button, Select, SelectItem, Textarea } from "@nextui-org/react";

import { IScenarioRole } from "@/types/scenario.types";
import { IRoleList } from "@/types/roles.types";

export const RoleItem = ({
  index,
  handleRoleChange,
  handleRoleRemove,
  availableRoles,
  role,
  isBeingEdited,
}: {
  index: number;
  handleRoleChange: (index: number, role: IScenarioRole) => void;
  handleRoleRemove: (index: number) => void;
  availableRoles: IRoleList;
  role: IScenarioRole;
  isBeingEdited?: boolean;
}) => {
  const intl = useIntl();
  const [showRole, setShowRole] = useState(true);
  const [touched, setTouched] = useState({
    descriptionForGM: false,
    descriptionForOwner: false,
    descriptionForOthers: false,
    selectedRole: false,
  });

  const handleTouched = (key: keyof typeof touched) => {
    setTouched({ ...touched, [key]: true });
  };

  const roleDescriptionForGM = (
    <Textarea
      isRequired
      description={intl.formatMessage({
        id: "role.display.description.descriptionForGM",
        defaultMessage: "Description of the character visible to the GM only.",
      })}
      errorMessage={intl.formatMessage({
        id: "role.display.description.error",
        defaultMessage: "Description for GM is required",
      })}
      isDisabled={!isBeingEdited}
      isInvalid={touched.descriptionForGM && !role.descriptionForGM}
      label={intl.formatMessage({
        id: "role.display.description.label",
        defaultMessage: "Description for GM",
      })}
      size="lg"
      value={role.descriptionForGM}
      variant="underlined"
      onChange={(e) => {
        handleRoleChange(index, {
          ...role,
          descriptionForGM: e.target.value,
        });
        handleTouched("descriptionForGM");
      }}
    />
  );

  const roleDescriptionForOwner = (
    <Textarea
      isRequired
      description={intl.formatMessage({
        id: "role.display.description.descriptionForOwner",
        defaultMessage:
          "Description of the character visible to the owner only.",
      })}
      errorMessage={intl.formatMessage({
        id: "role.display.description.error",
        defaultMessage: "Description for owner is required",
      })}
      isDisabled={!isBeingEdited}
      isInvalid={touched.descriptionForOwner && !role.descriptionForOwner}
      label={intl.formatMessage({
        id: "role.display.description.label",
        defaultMessage: "Description for owner",
      })}
      size="lg"
      value={role.descriptionForOwner}
      variant="underlined"
      onChange={(e) => {
        handleRoleChange(index, {
          ...role,
          descriptionForOwner: e.target.value,
        });
        handleTouched("descriptionForOwner");
      }}
    />
  );

  const roleDescriptionForOthers = (
    <Textarea
      isRequired
      description={intl.formatMessage({
        id: "role.display.description.descriptionForOthers",
        defaultMessage: "Description of the character visible to others.",
      })}
      errorMessage={intl.formatMessage({
        id: "role.display.description.error",
        defaultMessage: "Description for others is required",
      })}
      isDisabled={!isBeingEdited}
      isInvalid={touched.descriptionForOthers && !role.descriptionForOthers}
      label={intl.formatMessage({
        id: "role.display.description.label",
        defaultMessage: "Description for others",
      })}
      size="lg"
      value={role.descriptionForOthers}
      variant="underlined"
      onChange={(e) => {
        handleRoleChange(index, {
          ...role,
          descriptionForOthers: e.target.value,
        });
        handleTouched("descriptionForOthers");
      }}
    />
  );

  const roleSelect = (
    <Select
      isRequired
      className="w-1/2"
      defaultSelectedKeys={role.roleId ? [String(role.roleId)] : []}
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
        {roleDescriptionForGM}
        {roleDescriptionForOwner}
        {roleDescriptionForOthers}
      </div>
    </div>
  );
};
