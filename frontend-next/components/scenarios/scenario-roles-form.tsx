import { Button } from "@nextui-org/react";
import React from "react";
import { FormattedMessage } from "react-intl";
import { uuidv4 } from "@firebase/util";

import { RoleItem } from "@/components/scenarios/role-item-display";
import { IRoleList, IScenario, IScenarioRole } from "@/types";
import { emptyScenarioRole } from "@/data/mock-data";

export const ScenarioRolesForm = ({
  availableRoles,
  isBeingEdited,
  scenario,
  setScenario,
}: {
  availableRoles: IRoleList;
  isBeingEdited?: boolean;
  scenario: IScenario;
  setScenario: (scenario: IScenario) => void;
}) => {
  // const [roleList, setRoleList] = useState(scenario.roles);

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
    // setRoleList(newScenarioRoles);
  };

  const handleRoleChange = (index: number, newScenarioRole: IScenarioRole) => {
    const newScenarioRoles = [...scenario.roles];

    newScenarioRoles[index] = newScenarioRole;
    setScenario({ ...scenario, roles: newScenarioRoles });
    // setRoleList(newScenarioRoles);
  };

  const handleRoleRemove = (index: number) => {
    const newScenarioRoles = [...scenario.roles];

    newScenarioRoles.splice(index, 1);
    setScenario({
      ...scenario,
      roles: newScenarioRoles,
    });
    // setRoleList(newScenarioRoles);
  };

  console.log(scenario.roles);

  return (
    <div className="w-full flex flex-col space-y-3">
      <div className="w-full flex flex-col space-y-3">
        {scenario.roles.map((role, index) => (
          <RoleItem
            key={`${role.id}`}
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
