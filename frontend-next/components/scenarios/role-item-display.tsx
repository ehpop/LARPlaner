import { useIntl } from "react-intl";
import React, { useState } from "react";
import { Button, Select, SelectItem, Textarea } from "@nextui-org/react";

export const RoleItem = ({
  index,
  role,
  handleRoleChange,
  handleRoleRemove,
  availableRoles,
}: {
  index: number;
  role: string;
  handleRoleChange: (index: number, role: string) => void;
  handleRoleRemove: (index: number) => void;
  availableRoles: string[];
}) => {
  const intl = useIntl();
  const [showRole, setShowRole] = useState(true);

  const roleDescription = (
    <Textarea
      description={intl.formatMessage({
        id: "role.display.description.description",
        defaultMessage:
          "Description of the character visible to the user. Description is specific to this scenario.",
      })}
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
      description={intl.formatMessage({
        id: "role.display.gm.notes.description",
        defaultMessage: "Roles notes visible only to the GM",
      })}
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
          defaultSelectedKeys={[role]}
          label={intl.formatMessage({
            id: "role.id",
            defaultMessage: "Role name",
          })}
          size="sm"
          variant="underlined"
          onChange={(e) => {
            handleRoleChange(index, e.target.value);
          }}
        >
          {availableRoles.map((role) => (
            <SelectItem key={role} aria-label={role} value={role}>
              {role}
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
          <Button
            color="danger"
            size="sm"
            variant="bordered"
            onPress={() => handleRoleRemove(index)}
          >
            Remove role
          </Button>
        </div>
      </div>
      <div className={showRole ? "" : "hidden"}>
        {roleDescription}
        {roleGMNotes}
      </div>
    </div>
  );
};
