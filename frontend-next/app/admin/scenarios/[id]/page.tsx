"use client";

import { useState } from "react";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { FormattedMessage, useIntl } from "react-intl";

import ItemDisplay from "@/components/scenarios/item-display";
import { scenario as initialScenario } from "@/data/mock-data";

export default function ScenarioDisplayPage({ params }: any) {
  const intl = useIntl();

  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [scenario, setScenario] = useState(initialScenario);

  const handleRoleChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const updatedRoles = scenario.roles.map((role, i) =>
      i === index ? { ...role, [field]: value } : role,
    );

    setScenario({ ...scenario, roles: updatedRoles });
  };

  return (
    <div className="w-full h-full flex justify-center">
      <div className="sm:w-3/4 w-full space-y-10 border-1 p-3">
        <div className="w-full flex justify-center">
          <p className="text-3xl" id="display-scenario-modal">
            {intl.formatMessage(
              {
                id: "scenarios.id.page.title",
                defaultMessage: "Scenario: {id}",
              },
              { id: params.id },
            )}
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-xl font-bold">
            <FormattedMessage
              defaultMessage={"Scenario name:"}
              id={"scenarios.id.page.scenarioName"}
            />
          </p>
          <Input
            className="w-full"
            defaultValue={scenario.name}
            isDisabled={!isBeingEdited}
            size="lg"
            variant="underlined"
            onChange={(e) => setScenario({ ...scenario, name: e.target.value })}
          />
        </div>
        <div className="space-y-3">
          <p className="text-xl font-bold">
            <FormattedMessage
              defaultMessage={"Scenario description:"}
              id={"scenarios.id.page.scenarioDescription"}
            />
          </p>
          <Input
            className="w-full"
            defaultValue={scenario.description}
            isDisabled={!isBeingEdited}
            size="lg"
            variant="underlined"
            onChange={(e) =>
              setScenario({ ...scenario, description: e.target.value })
            }
          />
        </div>
        <div className="border-1 p-3 space-y-3">
          <p className="text-xl font-bold">
            <FormattedMessage
              defaultMessage={"Roles in scenario:"}
              id={"scenarios.id.page.rolesInScenario"}
            />
          </p>
          <div className="lg:w-1/2 w-full space-y-3">
            {scenario.roles.map((role, index) => (
              <div key={index} className="flex flex-row space-x-3 items-center">
                <Select
                  className="lg:w-1/4 w-3/4"
                  defaultSelectedKeys={[role.name]}
                  isDisabled={!isBeingEdited}
                  label="Role"
                  size="md"
                  variant="underlined"
                  onChange={(event) =>
                    handleRoleChange(index, "name", event.target.value)
                  }
                >
                  <SelectItem key={role.name} value={role.name}>
                    {role.name}
                  </SelectItem>
                </Select>
                <Input
                  className="lg:w-1/4 w-3/4"
                  isDisabled={!isBeingEdited}
                  label={intl.formatMessage({
                    id: "scenarios.id.page.roleCount",
                    defaultMessage: "Role count:",
                  })}
                  min={1}
                  size="md"
                  type="number"
                  value={role.count.toString()}
                  variant="underlined"
                  onChange={(e) =>
                    handleRoleChange(index, "count", parseInt(e.target.value))
                  }
                />
              </div>
            ))}
          </div>
        </div>
        <div className="border-1 p-3 space-y-3">
          <p className="text-xl font-bold">
            <FormattedMessage
              defaultMessage={"Items in scenario:"}
              id={"scenarios.id.page.itemsInScenario"}
            />
          </p>
          <ItemDisplay
            isEditable={isBeingEdited}
            items={scenario.items}
            onItemsChange={(updatedItems: typeof scenario.items) =>
              setScenario({ ...scenario, items: updatedItems })
            }
          />
        </div>
        <div className="w-full flex justify-end">
          <div className="flex justify-between space-x-3">
            {!isBeingEdited && (
              <div className="space-x-3">
                <Button color="danger" size="lg">
                  <FormattedMessage
                    defaultMessage={"Delete"}
                    id={"scenarios.id.page.deleteScenarioButton"}
                  />
                </Button>
                <Button
                  color="warning"
                  size="lg"
                  onPress={() => setIsBeingEdited(true)}
                >
                  <FormattedMessage
                    defaultMessage={"Edit"}
                    id={"scenarios.id.page.editScenarioButton"}
                  />
                </Button>
              </div>
            )}
            {isBeingEdited && (
              <div className="flex space-x-3">
                <Button
                  color="danger"
                  size="lg"
                  onPress={() => setIsBeingEdited(false)}
                >
                  <FormattedMessage
                    defaultMessage={"Cancel"}
                    id={"scenarios.id.page.cancel"}
                  />
                </Button>
                <Button
                  color="success"
                  size="lg"
                  onPress={() => setIsBeingEdited(false)}
                >
                  <FormattedMessage
                    defaultMessage={"Save"}
                    id={"scenarios.id.page.save"}
                  />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
