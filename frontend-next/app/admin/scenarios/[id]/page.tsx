"use client";

import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { FormattedMessage, useIntl } from "react-intl";

import ItemDisplay from "@/components/scenarios/item-display";
import { scenario } from "@/data/mock-data";

export default function ScenarioDisplayPage({ params }: any) {
  const intl = useIntl();

  return (
    <div className="space-y-10 border-1 p-3">
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
        <p>{scenario.name}</p>
      </div>
      <div className="space-y-3">
        <p className="text-xl font-bold">
          <FormattedMessage
            defaultMessage={"Scenario description:"}
            id={"scenarios.id.page.scenarioDescription"}
          />
        </p>
        <p>{scenario.description}</p>
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
                isDisabled={true}
                label="Rola"
                size="md"
                variant="underlined"
              >
                <SelectItem key={role.name} value={role.name}>
                  {role.name}
                </SelectItem>
              </Select>
              <Input
                className="lg:w-1/4 w-3/4"
                isDisabled={true}
                label={intl.formatMessage({
                  id: "scenarios.id.page.roleCount",
                  defaultMessage: "Role count:",
                })}
                min={1}
                size="md"
                type="number"
                value={role.count.toString()}
                variant="underlined"
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
        <ItemDisplay items={scenario.items} />
      </div>
      <div className="w-full flex justify-end">
        <div className="flex justify-between space-x-3">
          <Button color="danger" size="lg">
            <FormattedMessage
              defaultMessage={"Delete"}
              id={"scenarios.id.page.deleteScenarioButton"}
            />
          </Button>
          <Button color="warning" size="lg">
            <FormattedMessage
              defaultMessage={"Edit"}
              id={"scenarios.id.page.editScenarioButton"}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
