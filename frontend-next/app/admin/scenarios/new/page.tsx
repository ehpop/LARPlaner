"use client";

import { Button, Input, Textarea } from "@nextui-org/react";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ItemCreator from "@/components/scenarios/item-creator";
import { RolesCreator } from "@/components/scenarios/role-creator";
import { possibleRoles, possibleSkills, possibleTags } from "@/data/mock-data";

export default function ScenariosPage() {
  const [showItemsSection, setShowItemsSection] = useState(true);
  const [showRolesSection, setShowRolesSection] = useState(true);
  const intl = useIntl();

  return (
    <div className="w-full h-full flex justify-center">
      <div className="sm:w-3/4 w-full space-y-10 border-1 p-3 min-h-full">
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
        <div className="w-full flex flex-col space-y-3 space-x-0 lg:flex-row lg:space-x-3 lg:space-y-0">
          <div className="w-full border-1 p-3 space-y-3">
            <div className="w-full flex flex-row justify-between">
              <p className="text-xl">
                <FormattedMessage
                  defaultMessage={"Roles in scenario:"}
                  id={"scenarios.new.page.rolesInScenario"}
                />
              </p>
              <Button
                size="sm"
                variant="bordered"
                onPress={() => setShowRolesSection(!showRolesSection)}
              >
                {showRolesSection ? "-" : "+"}
              </Button>
            </div>
            <div className={showRolesSection ? "" : "hidden"}>
              <RolesCreator availableRoles={possibleRoles} />
            </div>
          </div>
          <div className="w-full border-1 p-3 space-y-3">
            <div className="w-full flex flex-row justify-between">
              <p className="text-xl">
                <FormattedMessage
                  defaultMessage={"Items in scenario:"}
                  id={"scenarios.new.page.itemsInScenario"}
                />
              </p>
              <Button
                size="sm"
                variant="bordered"
                onPress={() => setShowItemsSection(!showItemsSection)}
              >
                {showItemsSection ? "-" : "+"}
              </Button>
            </div>
            <div className={showItemsSection ? "" : "hidden"}>
              <ItemCreator skills={possibleSkills} tags={possibleTags} />
            </div>
          </div>
        </div>
        <div className="w-full flex justify-end">
          <div className="flex justify-between space-x-3">
            <Button color="success" size="lg">
              <FormattedMessage
                defaultMessage={"Save"}
                id={"scenarios.new.page.save"}
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
