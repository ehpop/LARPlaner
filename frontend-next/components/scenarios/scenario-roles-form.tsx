import { Button } from "@heroui/react";
import React from "react";
import { FormattedMessage } from "react-intl";
import { uuidv4 } from "@firebase/util";

import { RoleItem } from "@/components/scenarios/role-item-display";
import { emptyScenarioRole } from "@/services/mock/mock-data";
import { IScenario, IScenarioRole } from "@/types/scenario.types";
import { IRole } from "@/types/roles.types";

export const ScenarioRolesForm = ({
  availableRoles,
  isBeingEdited,
  scenario,
  setScenario,
}: {
  availableRoles: IRole[];
  isBeingEdited?: boolean;
  scenario: IScenario;
  setScenario: (scenario: IScenario) => void;
}) => {
  const addRole = () => {
    const newScenarioRoles = [
      ...scenario.roles,
      {
        ...emptyScenarioRole,
        id: uuidv4(),
        scenarioId: scenario.id,
      },
    ];

    setScenario({ ...scenario, roles: newScenarioRoles });
  };

  const handleRoleChange = (index: number, newScenarioRole: IScenarioRole) => {
    const newScenarioRoles = [...scenario.roles];

    newScenarioRoles[index] = newScenarioRole;
    setScenario({ ...scenario, roles: newScenarioRoles });
  };

  const handleRoleRemove = (index: number) => {
    const newScenarioRoles = [...scenario.roles];

    newScenarioRoles.splice(index, 1);
    setScenario({
      ...scenario,
      roles: newScenarioRoles,
    });
  };

  return (
    <div className="w-full flex flex-col space-y-3">
      <div className="w-full flex flex-col space-y-3">
        {scenario.roles.length === 0 ? (
          <div className="w-full flex justify-center">
            <p>
              <FormattedMessage
                defaultMessage={"No roles in scenario"}
                id={"scenarios.id.page.noRolesInScenario"}
              />
            </p>
          </div>
        ) : (
          scenario.roles.map((role, index) => (
            <RoleItem
              key={role.id}
              availableRoles={availableRoles}
              handleRoleChange={handleRoleChange}
              handleRoleRemove={handleRoleRemove}
              index={index}
              isBeingEdited={isBeingEdited || false}
              role={role}
            />
          ))
        )}
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
