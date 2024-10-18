import { Button } from "@nextui-org/react";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";

import { RoleItem } from "@/components/scenarios/role-item-display";

export const RolesCreator = ({
  availableRoles,
}: {
  availableRoles: string[];
}) => {
  const [roleList, setRoleList] = useState(
    availableRoles.length > 0 ? [availableRoles[0]] : [],
  );

  const addRole = () => {
    setRoleList([...roleList, ""]);
  };

  const handleRoleChange = (index: number, value: string) => {
    roleList[index] = value;
    setRoleList(roleList);
  };

  const handleRoleRemove = (index: number) => {
    const updatedRoles = [...roleList];

    updatedRoles.splice(index, 1);
    setRoleList(updatedRoles);
  };

  return (
    <div className="w-full flex flex-col space-y-3">
      <div className="w-full flex flex-col space-y-3">
        {roleList.map((role, index) => (
          <RoleItem
            key={`${role}-${index}`}
            availableRoles={availableRoles}
            handleRoleChange={handleRoleChange}
            handleRoleRemove={handleRoleRemove}
            index={index}
            role={role}
          />
        ))}
      </div>
      <div className="w-full flex justify-center">
        <Button color="success" onClick={addRole}>
          <FormattedMessage
            defaultMessage={"Add role"}
            id={"scenarios.new.page.addRoleButton"}
          />
        </Button>
      </div>
    </div>
  );
};
