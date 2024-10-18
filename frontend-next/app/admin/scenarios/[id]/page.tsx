"use client";

import React, { useState } from "react";
import { Input, Select, SelectItem, useDisclosure } from "@nextui-org/react";
import { FormattedMessage, useIntl } from "react-intl";

import ItemDisplay from "@/components/scenarios/item-display";
import { scenario as initialScenario } from "@/data/mock-data";
import { ButtonPanel } from "@/components/buttons/button-pannel";
import ConfirmActionModal from "@/components/buttons/confirm-action-modal";

export default function ScenarioDisplayPage({ params }: any) {
  const intl = useIntl();
  const {
    onOpen: onOpenDelete,
    isOpen: isOpenDelete,
    onOpenChange: onOpenChangeDelete,
  } = useDisclosure();
  const {
    onOpen: onOpenCancel,
    isOpen: isOpenCancel,
    onOpenChange: onOpenChangeCancel,
  } = useDisclosure();

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

  const confirmDelete = (
    <ConfirmActionModal
      handleOnConfirm={() => {
        alert("Event will be deleted");
      }}
      isOpen={isOpenDelete}
      prompt={intl.formatMessage({
        id: "scenarios.id.page.delete",
        defaultMessage:
          "Are you sure you want to delete this scenario? This action will not be reversible.",
      })}
      title={intl.formatMessage({
        id: "scenarios.id.page.deleteTitle",
        defaultMessage: "Do you want to delete this scenario?",
      })}
      onOpenChange={onOpenChangeDelete}
    />
  );

  const confirmCancel = (
    <ConfirmActionModal
      handleOnConfirm={() => {
        setIsBeingEdited(false);
      }}
      isOpen={isOpenCancel}
      prompt={intl.formatMessage({
        id: "scenarios.id.page.cancelEdit",
        defaultMessage:
          "Are you sure you want to cancel your changes? This action will not be reversible.",
      })}
      title={intl.formatMessage({
        id: "scenarios.id.page.cancelEditTitle",
        defaultMessage: "Do you want to cancel added changes?",
      })}
      onOpenChange={onOpenChangeCancel}
    />
  );

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
                  className="sm:w-1/4 w-3/4"
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
          <ItemDisplay isBeingEdited={isBeingEdited} items={scenario.items} />
        </div>
        <div className="w-full flex justify-end">
          <ButtonPanel
            isBeingEdited={isBeingEdited}
            onCancelEditClicked={() => {
              onOpenCancel();
            }}
            onDeleteClicked={() => {
              onOpenDelete();
            }}
            onEditClicked={() => {
              setIsBeingEdited(true);
            }}
            onSaveClicked={() => {
              setIsBeingEdited(false);
            }}
          />
          {confirmCancel}
          {confirmDelete}
        </div>
      </div>
    </div>
  );
}
