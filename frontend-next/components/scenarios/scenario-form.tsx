import { FormattedMessage, useIntl } from "react-intl";
import React, { useState } from "react";
import { Button, Input, Textarea, useDisclosure } from "@nextui-org/react";

import { ScenarioRolesForm } from "@/components/scenarios/scenario-roles-form";
import {
  emptyScenario,
  exampleScenario,
  possibleRoles,
} from "@/data/mock-data";
import ScenarioItemsForm from "@/components/scenarios/scenario-items-form";
import ConfirmActionModal from "@/components/buttons/confirm-action-modal";
import { ButtonPanel } from "@/components/buttons/button-pannel";

export default function ScenarioForm({ scenarioId }: { scenarioId?: string }) {
  const intl = useIntl();
  const isNewScenario = !scenarioId;
  const [scenario, setScenario] = useState(
    isNewScenario ? emptyScenario : exampleScenario,
  );

  const [isBeingEdited, setIsBeingEdited] = useState(isNewScenario);
  const [showItemsSection, setShowItemsSection] = useState(true);
  const [showRolesSection, setShowRolesSection] = useState(true);
  const [touched, setTouched] = useState({
    name: false,
    description: false,
  });

  const handleTouched = (key: keyof typeof touched) => {
    setTouched({ ...touched, [key]: true });
  };

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

  const handleSave = () => {
    alert("Saving scenario: " + JSON.stringify(scenario));
  };

  const nameElement = (
    <Input
      isRequired
      className="w-full"
      defaultValue={scenario.name}
      errorMessage={intl.formatMessage({
        id: "scenarios.new.page.scenarioNameError",
        defaultMessage: "Scenario name is required",
      })}
      isDisabled={!(isBeingEdited || isNewScenario)}
      isInvalid={touched.name && !scenario.name}
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
      onChange={(e) => {
        setScenario({ ...scenario, name: e.target.value });
        handleTouched("name");
      }}
    />
  );
  const descriptionElement = (
    <Textarea
      isRequired
      className="w-full"
      defaultValue={scenario.description}
      errorMessage={intl.formatMessage({
        id: "scenarios.new.page.scenarioDescriptionError",
        defaultMessage: "Scenario description is required",
      })}
      isDisabled={!(isBeingEdited || isNewScenario)}
      isInvalid={touched.description && !scenario.description}
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
      onChange={(e) => {
        setScenario({ ...scenario, description: e.target.value });
        handleTouched("description");
      }}
    />
  );
  const rolesElement = (
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
        <ScenarioRolesForm
          availableRoles={possibleRoles}
          isBeingEdited={isBeingEdited}
          scenario={scenario}
          setScenario={setScenario}
        />
      </div>
    </div>
  );
  const itemsElement = (
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
        <ScenarioItemsForm
          initialItems={scenario.items}
          isBeingEdited={isBeingEdited}
          scenario={scenario}
          setScenario={setScenario}
        />
      </div>
    </div>
  );
  const saveButton = (
    <div className="w-full flex justify-end">
      <div className="flex justify-between space-x-3">
        <Button
          color="success"
          size="lg"
          onPress={() => {
            handleSave();
          }}
        >
          <FormattedMessage
            defaultMessage={"Save"}
            id={"scenarios.new.page.save"}
          />
        </Button>
      </div>
    </div>
  );

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

  const buttonsElement = (
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
          handleSave();
          setIsBeingEdited(false);
        }}
      />
      {confirmCancel}
      {confirmDelete}
    </div>
  );

  const titleElement = (
    <div className="w-full flex justify-center">
      <p className="text-3xl" id="add-event-modal">
        {isNewScenario ? (
          <FormattedMessage
            defaultMessage={"Add new scenario"}
            id={"scenarios.new.page.addNewScenario"}
          />
        ) : (
          <FormattedMessage
            defaultMessage='Scenario "{scenarioName}"'
            id="scenarios.new.page.editScenario"
            values={{ scenarioName: scenario.name }}
          />
        )}
      </p>
    </div>
  );

  return (
    <div className="sm:w-4/5 w-full space-y-10 border-1 p-3">
      {titleElement}
      {nameElement}
      {descriptionElement}
      <div className="w-full flex flex-col space-y-3 space-x-0 lg:flex-row lg:space-x-3 lg:space-y-0">
        {rolesElement}
        {itemsElement}
      </div>
      {isNewScenario ? saveButton : buttonsElement}
    </div>
  );
}