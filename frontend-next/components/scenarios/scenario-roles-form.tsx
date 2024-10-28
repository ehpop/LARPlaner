import { Button } from "@nextui-org/react";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";

import { RoleItem } from "@/components/scenarios/role-item-display";
import { IRoleList, IScenarioRole, IScenarioRoleList } from "@/types";
import { exampleScenarioRole } from "@/data/mock-data";

export const ScenarioRolesForm = ({
  availableRoles,
  rolesPresentInScenario,
  isBeingEdited,
}: {
  availableRoles: IRoleList;
  rolesPresentInScenario?: IScenarioRoleList;
  isBeingEdited?: boolean;
}) => {
  const [roleList, setRoleList] = useState<IScenarioRoleList>(
    rolesPresentInScenario && rolesPresentInScenario.length > 0
      ? rolesPresentInScenario
      : [{ ...exampleScenarioRole, id: 1 }],
  );

  const addRole = () => {
    setRoleList([...roleList, exampleScenarioRole]);
  };

  const handleRoleChange = (index: number, value: IScenarioRole) => {
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
            key={`${role.name}-${index}`}
            availableRoles={availableRoles}
            handleRoleChange={handleRoleChange}
            handleRoleRemove={handleRoleRemove}
            index={index}
            initialRole={role}
            isBeingEdited={isBeingEdited || false}
          />
        ))}
      </div>
      {isBeingEdited && (
        <div className="w-full flex justify-center">
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
