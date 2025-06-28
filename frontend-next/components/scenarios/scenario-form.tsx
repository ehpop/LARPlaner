import { Button, Input, Textarea, useDisclosure } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { ButtonPanel } from "@/components/buttons/button-pannel";
import ConfirmActionModal from "@/components/buttons/confirm-action-modal";
import LoadingOverlay from "@/components/general/loading-overlay";
import ActionsListForm from "@/components/scenarios/actions-list-form";
import ScenarioItemsForm from "@/components/scenarios/scenario-items-form";
import { ScenarioRolesForm } from "@/components/scenarios/scenario-roles-form";
import useAllRoles from "@/hooks/roles/use-all-roles";
import { TagsProvider } from "@/providers/tags-provider";
import { emptyScenario } from "@/services/mock/mock-data";
import scenariosService from "@/services/scenarios.service";
import { IScenario } from "@/types/scenario.types";
import {
  showErrorToast,
  showErrorToastWithTimeout,
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
  const { roles: allRoles } = useAllRoles();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<IScenario>({
    defaultValues: initialScenario || emptyScenario,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBeingEdited, setIsBeingEdited] = useState(isNewScenario);
  const [showItemsSection, setShowItemsSection] = useState(true);
  const [showRolesSection, setShowRolesSection] = useState(true);
  const [showActionsSection, setShowActionsSection] = useState(true);

  const watchedScenarioName = watch("name");

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

  const onSubmit = (data: IScenario) => {
    setIsSaving(true);

    const serviceCall = isNewScenario
      ? scenariosService.save(data)
      : scenariosService.update(data.id!, data);

    serviceCall
      .then((result) => {
        if (result.success) {
          showSuccessToastWithTimeout(
            intl.formatMessage({
              defaultMessage: "Scenario saved successfully",
              id: "scenario.form.save.success",
            }),
          );
          if (isNewScenario) {
            router.push("/admin/scenarios");
          } else {
            reset(result.data);
            setIsBeingEdited(false);
          }
        } else {
          showErrorToast(result.data);
        }
      })
      .catch((error) => showErrorToast(error))
      .finally(() => setIsSaving(false));
  };

  const handleConfirmDelete = () => {
    if (!initialScenario?.id) return;
    setIsDeleting(true);
    scenariosService
      .delete(initialScenario.id)
      .then((result) => {
        if (result.success) {
          showSuccessToastWithTimeout(
            intl.formatMessage({
              defaultMessage: "Scenario deleted successfully",
              id: "scenario.form.delete.success",
            }),
          );
          router.push("/admin/scenarios");
        } else {
          showErrorToastWithTimeout(result.data);
        }
      })
      .catch((error) => showErrorToastWithTimeout(error))
      .finally(() => setIsDeleting(false));
  };

  const handleConfirmCancel = () => {
    reset(initialScenario);
    setIsBeingEdited(false);
  };

  const form = (
    <TagsProvider>
      <form
        className="w-full flex justify-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full space-y-3 border-1 p-3">
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
                  values={{ scenarioName: watchedScenarioName }}
                />
              )}
            </p>
          </div>

          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                {...field}
                isRequired
                className="w-full"
                errorMessage={errors.name?.message}
                isDisabled={!isBeingEdited}
                isInvalid={!!errors.name}
                label={intl.formatMessage({
                  defaultMessage: "Scenario name",
                  id: "scenarios.new.page.scenarioName",
                })}
                placeholder={intl.formatMessage({
                  defaultMessage: "Enter scenario name",
                  id: "scenarios.new.page.insertScenarioName",
                })}
                size="lg"
                variant="underlined"
              />
            )}
            rules={{
              required: intl.formatMessage({
                defaultMessage: "Scenario name is required",
                id: "scenarios.new.page.scenarioName.required",
              }),
            }}
          />

          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <Textarea
                {...field}
                isRequired
                className="w-full"
                errorMessage={errors.description?.message}
                isDisabled={!isBeingEdited}
                isInvalid={!!errors.description}
                label={intl.formatMessage({
                  defaultMessage: "Scenario description",
                  id: "scenarios.new.page.scenarioDescription",
                })}
                placeholder={intl.formatMessage({
                  defaultMessage: "Enter scenario description",
                  id: "scenarios.new.page.insertScenarioDescription",
                })}
                size="lg"
                variant="underlined"
              />
            )}
            rules={{
              required: intl.formatMessage({
                defaultMessage: "Scenario description is required",
                id: "scenarios.new.page.scenarioDescription.required",
              }),
            }}
          />

          <div className="w-full border-1 p-3 space-y-3">
            <div className="w-full flex flex-row justify-between">
              <p className="text-xl">
                <FormattedMessage
                  defaultMessage="Roles in scenario"
                  id="scenarios.new.page.rolesInScenario"
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
            {showRolesSection && (
              <ScenarioRolesForm
                availableRoles={allRoles}
                control={control}
                isBeingEdited={isBeingEdited}
              />
            )}
          </div>

          <div className="w-full border-1 p-3 space-y-3">
            <div className="w-full flex flex-row justify-between">
              <p className="text-xl">
                <FormattedMessage
                  defaultMessage="Items in scenario"
                  id="scenarios.new.page.itemsInScenario"
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
            {showItemsSection && (
              <ScenarioItemsForm
                control={control}
                isBeingEdited={isBeingEdited}
              />
            )}
          </div>

          <div className="w-full border-1 p-3 space-y-3">
            <div className="w-full flex flex-row justify-between">
              <p className="text-xl">
                <FormattedMessage
                  defaultMessage="Actions in scenario"
                  id="scenarios.new.page.actionsInScenario"
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
            {showActionsSection && (
              <ActionsListForm
                basePath={`actions`}
                control={control}
                isBeingEdited={isBeingEdited}
              />
            )}
          </div>

          {isNewScenario ? (
            <div className="w-full flex justify-end">
              <Button
                color="success"
                isLoading={isSaving}
                size="lg"
                type="submit"
              >
                <FormattedMessage
                  defaultMessage="Save"
                  id="scenarios.new.page.save"
                />
              </Button>
            </div>
          ) : (
            <div className="w-full flex justify-end">
              <ButtonPanel
                isBeingEdited={isBeingEdited}
                isSaveButtonTypeSubmit={true}
                isSaveDisabled={!isDirty || isSaving}
                onCancelEditClicked={onOpenCancel}
                onDeleteClicked={onOpenDelete}
                onEditClicked={() => setIsBeingEdited(true)}
              />
            </div>
          )}
        </div>
      </form>
    </TagsProvider>
  );

  return (
    <LoadingOverlay
      isLoading={isSaving || isDeleting}
      label={
        isSaving
          ? intl.formatMessage({
              defaultMessage: "Saving scenario...",
              id: "scenarios.id.page.saving",
            })
          : intl.formatMessage({
              defaultMessage: "Deleting scenario...",
              id: "scenarios.id.page.deleting",
            })
      }
    >
      {form}
      <ConfirmActionModal
        handleOnConfirm={handleConfirmDelete}
        isOpen={isOpenDelete}
        prompt={intl.formatMessage({
          defaultMessage: "Are you sure you want to delete this scenario?",
          id: "scenarios.id.page.delete",
        })}
        title={intl.formatMessage({
          defaultMessage: "Delete scenario",
          id: "scenarios.id.page.deleteTitle",
        })}
        onOpenChange={onOpenChangeDelete}
      />
      <ConfirmActionModal
        handleOnConfirm={handleConfirmCancel}
        isOpen={isOpenCancel}
        prompt={intl.formatMessage({
          defaultMessage:
            "Are you sure you want to cancel editing this scenario?",
          id: "scenarios.id.page.cancelEdit",
        })}
        title={intl.formatMessage({
          defaultMessage: "Cancel editing scenario",
          id: "scenarios.id.page.cancelEditTitle",
        })}
        onOpenChange={onOpenChangeCancel}
      />
    </LoadingOverlay>
  );
}
