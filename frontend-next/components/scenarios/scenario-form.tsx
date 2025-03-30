import { FormattedMessage, useIntl } from "react-intl";
import React, { useState } from "react";
import { Button, Input, Textarea, useDisclosure } from "@heroui/react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

import { ScenarioRolesForm } from "@/components/scenarios/scenario-roles-form";
import { emptyScenario, possibleRoles } from "@/services/mock/mock-data";
import ScenarioItemsForm from "@/components/scenarios/scenario-items-form";
import ConfirmActionModal from "@/components/buttons/confirm-action-modal";
import { ButtonPanel } from "@/components/buttons/button-pannel";
import { IScenario, IScenarioAction } from "@/types/scenario.types";
import scenariosService from "@/services/scenarios.service";
import LoadingOverlay from "@/components/general/loading-overlay";
import { ItemActionsForm } from "@/components/scenarios/item-actions-form";
import InputTagsWithTable from "@/components/input-tags-with-table";
import {
  showErrorToast,
  showErrorToastWithTimeout,
  showSuccessToast,
  showSuccessToastWithTimeout,
} from "@/utils/toast";

export default function ScenarioForm({
  initialScenario,
}: {
  initialScenario?: IScenario;
}) {
  const intl = useIntl();
  const router = useRouter();
  const isNewScenario = !initialScenario;
  const [scenario, setScenario] = useState(
    isNewScenario ? emptyScenario : { ...initialScenario },
  );
  const [scenarioBeforeChanges, setScenarioBeforeChanges] = useState(scenario);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBeingEdited, setIsBeingEdited] = useState(isNewScenario);
  const [showItemsSection, setShowItemsSection] = useState(true);
  const [showRolesSection, setShowRolesSection] = useState(true);
  const [showActionsSection, setShowActionsSection] = useState(true);
  const [showTagsSection, setShowTagsSection] = useState(true);
  const [touched, setTouched] = useState({
    name: false,
    description: false,
  });

  const handleAddAction = () => {
    const newAction: IScenarioAction = {
      id: uuidv4(),
      scenarioId: scenario.id,
      name: "",
      description: "",
      messageOnSuccess: "",
      messageOnFailure: "",
      requiredTagsToDisplay: [],
      requiredTagsToSucceed: [],
      tagsToApplyOnSuccess: [],
      tagsToApplyOnFailure: [],
      tagsToRemoveOnSuccess: [],
      tagsToRemoveOnFailure: [],
    };

    setScenario({
      ...scenario,
      actions: [...scenario.actions, newAction],
    });
  };

  const handleActionChange = (index: number, newAction: IScenarioAction) => {
    const newActions = [...scenario.actions];

    newActions[index] = newAction;

    setScenario({
      ...scenario,
      actions: newActions,
    });
  };

  const handleActionRemove = (index: number) => {
    const newActions = [...scenario.actions];

    newActions.splice(index, 1);

    setScenario({
      ...scenario,
      actions: newActions,
    });
  };

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
    setIsSaving(true);

    scenariosService
      .save(scenario)
      .then((result) => {
        if (result.success) {
          showSuccessToast("Scenario saved successfully");
          router.push("/admin/scenarios");
        } else {
          showErrorToast(result.data);
        }
      })
      .catch((error) => {
        showErrorToast(error);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const handleSaveEditedScenario = () => {
    if (!scenario.id) {
      return;
    }

    setIsSaving(true);
    scenariosService
      .update(scenario.id, scenario)
      .then((result) => {
        if (result.success) {
          showSuccessToastWithTimeout("Scenario saved successfully", 3000);
          setScenario(result.data);
          setScenarioBeforeChanges(result.data);
          setIsBeingEdited(false);
        } else {
          showErrorToastWithTimeout(result.data);
        }
      })
      .catch((error) => {
        showErrorToastWithTimeout(error);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const handleConfirmDelete = () => {
    if (!scenario.id) {
      return;
    }

    setIsDeleting(true);
    scenariosService
      .delete(scenario.id)
      .then((result) => {
        if (result.success) {
          showSuccessToastWithTimeout("Scenario deleted successfully");
          router.push("/admin/scenarios");
        } else {
          showErrorToastWithTimeout(result.data);
        }
      })
      .catch((error) => {
        showErrorToastWithTimeout(error);
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  const nameElement = (
    <Input
      isRequired
      className="w-full"
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
      value={scenario.name}
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
      value={scenario.description}
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
          isBeingEdited={isBeingEdited || isNewScenario}
          scenario={scenario}
          setScenario={setScenario}
        />
      </div>
    </div>
  );
  const saveButton = (
    <div className="w-full flex justify-end">
      <div className="flex justify-between space-x-3">
        <Button color="success" size="lg" onPress={handleSave}>
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
        handleConfirmDelete();
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
        setScenario(scenarioBeforeChanges);
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
          handleSaveEditedScenario();
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

  const actionsElement = (
    <div className="w-full border-1 p-3 space-y-3">
      <div className="w-full flex flex-row justify-between">
        <p className="text-xl">
          <FormattedMessage
            defaultMessage={"Actions in scenario:"}
            id={"scenarios.new.page.actionsInScenario"}
          />
        </p>
        <Button
          size="sm"
          variant="bordered"
          onPress={() => setShowActionsSection(!showActionsSection)}
        >
          {showActionsSection ? "-" : "+"}
        </Button>
      </div>
      <div className={showActionsSection ? "" : "hidden"}>
        <ItemActionsForm
          actions={scenario.actions}
          handleActionChange={handleActionChange}
          handleActionRemove={handleActionRemove}
          handleAddAction={handleAddAction}
          isRoleBeingEdited={isBeingEdited}
        />
      </div>
    </div>
  );

  const tagsElement = (
    <div className="w-full border-1 p-3 space-y-3">
      <div className="w-full flex flex-row justify-between">
        <p className="text-xl">
          <FormattedMessage
            defaultMessage={"Tags in scenario:"}
            id={"scenarios.new.page.tagsInScenario"}
          />
        </p>
        <Button
          size="sm"
          variant="bordered"
          onPress={() => setShowTagsSection(!showTagsSection)}
        >
          {showTagsSection ? "-" : "+"}
        </Button>
      </div>
      <div className={showTagsSection ? "" : "hidden"}>
        <InputTagsWithTable
          addedTags={scenario.tags}
          description={intl.formatMessage({
            defaultMessage:
              "Tags are used to categorize scenarios. They can be used to filter scenarios in the list.",
            id: "scenarios.new.page.tagsDescription",
          })}
          inputLabel={intl.formatMessage({
            defaultMessage: "Tag name",
            id: "scenarios.new.page.tags",
          })}
          isDisabled={!(isBeingEdited || isNewScenario)}
          placeholder={intl.formatMessage({
            defaultMessage: "Insert tag name",
            id: "scenarios.new.page.insertTagName",
          })}
          setAddedTags={(tags) => {
            setScenario({
              ...scenario,
              tags: tags,
            });
          }}
        />
      </div>
    </div>
  );

  const form = (
    <div className="w-full flex justify-center">
      <div className="w-full space-y-3 border-1 p-3">
        {titleElement}
        {nameElement}
        {descriptionElement}
        {rolesElement}
        {itemsElement}
        {actionsElement}
        {tagsElement}
        {isNewScenario ? saveButton : buttonsElement}
      </div>
    </div>
  );

  return (
    <LoadingOverlay
      isLoading={isSaving || isDeleting}
      label={isSaving ? "Saving scenario..." : "Deleting scenario..."}
    >
      {form}
    </LoadingOverlay>
  );
}
