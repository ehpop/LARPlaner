"use client";

import { Button, Input, Textarea } from "@nextui-org/react";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import MultiSelect from "@/components/multi-select";
import ItemCreator from "@/components/scenarios/item-creator";

const roles: string[] = ["mag", "wojownik", "złodziej", "czarodziej", "kapłan"];

const skills: string[] = ["skill1", "skill2", "skill3", "skill4", "skill5"];

const querks: string[] = ["querk1", "querk2", "querk3", "querk4"];

export default function ScenariosPage() {
  const [showSection, setShowSection] = useState(true);
  const intl = useIntl();

  return (
    <div className="space-y-10 border-1 p-3 min-h-full">
      <div className="w-full flex justify-center">
        <p className="text-3xl" id="add-event-modal">
          <FormattedMessage
            defaultMessage={"Add scenario"}
            id={"scenarios.new.page.title"}
          />
        </p>
      </div>
      <Input
        className="w-full"
        isClearable={true}
        label={intl.formatMessage({
          id: "scenarios.new.page.scenarioName",
          defaultMessage: "Name",
        })}
        placeholder={intl.formatMessage({
          id: "scenarios.new.page.insertScenarioName",
          defaultMessage: "Insert scenario name",
        })}
        size="lg"
        variant="underlined"
      />
      <Textarea
        className="w-full"
        label={intl.formatMessage({
          id: "scenarios.new.page.scenarioDescription",
          defaultMessage: "Description",
        })}
        placeholder={intl.formatMessage({
          id: "scenarios.new.page.insertScenarioDescription",
          defaultMessage: "Insert scenario description",
        })}
        size="lg"
        variant="underlined"
      />
      <div className="w-full border-1 p-3 space-y-3">
        <p>
          <FormattedMessage
            defaultMessage={"Role in scenario:"}
            id={"scenarios.new.page.rolesInScenario"}
          />
        </p>
        <MultiSelect
          addButtonLabel={intl.formatMessage({
            id: "scenarios.new.page.addRole",
            defaultMessage: "Add role",
          })}
          counterLabel={intl.formatMessage({
            id: "scenarios.new.page.roleCount",
            defaultMessage: "Role count",
          })}
          defaultCounterValue="1"
          minCounterValue={1}
          options={roles}
          removeButtonLabel={intl.formatMessage({
            id: "scenarios.new.page.removeRole",
            defaultMessage: "Delete role",
          })}
          selectLabel={intl.formatMessage({
            id: "scenarios.new.page.selectRole",
            defaultMessage: "Select role",
          })}
        />
      </div>
      <div className="w-full border-1 p-3 space-y-3">
        <div className="w-full flex flex-row justify-between">
          <p>
            <FormattedMessage
              defaultMessage={"Items in scenario:"}
              id={"scenarios.new.page.itemsInScenario"}
            />
          </p>
          <Button
            size="sm"
            variant="bordered"
            onClick={() => setShowSection(!showSection)}
          >
            {showSection ? "-" : "+"}
          </Button>
        </div>
        <div className={showSection ? "" : "hidden"}>
          <ItemCreator querks={querks} skills={skills} />
        </div>
      </div>
      <div className="w-full flex justify-end">
        <div className="flex justify-between space-x-3">
          <Button color="danger" size="lg" variant="bordered">
            <FormattedMessage
              defaultMessage={"Delete"}
              id={"scenarios.new.page.deleteScenarioButton"}
            />
          </Button>
          <Button color="success" size="lg">
            <FormattedMessage
              defaultMessage={"Add"}
              id={"scenarios.new.page.addScenarioButton"}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
