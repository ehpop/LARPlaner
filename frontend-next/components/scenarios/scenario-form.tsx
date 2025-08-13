import { Button, Input, Textarea, useDisclosure } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { ButtonPanel } from "@/components/buttons/button-pannel";
import ConfirmActionModal from "@/components/buttons/confirm-action-modal";
import LoadingOverlay from "@/components/common/loading-overlay";
import ActionsListForm from "@/components/scenarios/actions-list-form";
import ScenarioItemsForm from "@/components/scenarios/scenario-items-form";
import { ScenarioRolesForm } from "@/components/scenarios/scenario-roles-form";
import { TagsProvider } from "@/providers/tags-provider";
import { IScenario, IScenarioPersisted } from "@/types/scenario.types";
import {
  showErrorToastWithTimeout,
  showSuccessToastWithTimeout,
} from "@/utils/toast";
import HidableSection from "@/components/common/hidable-section";
import {
  useCreateScenario,
  useDeleteScenario,
  useUpdateScenario,
} from "@/services/scenarios/useScenarios";
import { useRoles } from "@/services/roles/useRoles";
import { getErrorMessage } from "@/utils/error";
import { emptyScenario } from "@/types/initial-types";

export default function ScenarioForm({
  initialScenario,
}: {
  initialScenario?: IScenario;
}) {
  const intl = useIntl();
  const router = useRouter();
  const isNewScenario = !initialScenario;
  const {
    data: allRoles,
    isLoading: isLoadingRoles,
    isError,
    error,
  } = useRoles();

  const [isBeingEdited, setIsBeingEdited] = useState(isNewScenario);
  const [lastSavedScenario, setLastSavedScenario] = useState(initialScenario);

  const methods = useForm<IScenario>({
    defaultValues: initialScenario || emptyScenario,
  });
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = { ...methods };

  const watchedScenarioName = watch("name");

  const createScenarioMutation = useCreateScenario();
  const updateScenarioMutation = useUpdateScenario();
  const deleteScenarioMutation = useDeleteScenario();

  const isSaving =
    createScenarioMutation.isPending || updateScenarioMutation.isPending;
  const isDeleting = deleteScenarioMutation.isPending;

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
    if (isNewScenario) {
      //TODO: If we create scenario, types inside scenario should not be required to be persisted yet
      // @ts-ignore
      createScenarioMutation.mutate(data, {
        onSuccess: () => {
          showSuccessToastWithTimeout("Scenario created successfully");
          router.push("/admin/scenarios");
        },
        onError: (error) => {
          showErrorToastWithTimeout(getErrorMessage(error));
        },
      });
    } else {
      updateScenarioMutation.mutate(data as IScenarioPersisted, {
        onSuccess: (updatedScenario) => {
          showSuccessToastWithTimeout("Scenario updated successfully");
          setIsBeingEdited(false);
          reset(updatedScenario);
          setLastSavedScenario(updatedScenario);
        },
        onError: (error) => {
          showErrorToastWithTimeout(getErrorMessage(error));
        },
      });
    }
  };

  const handleConfirmDelete = () => {
    if (!lastSavedScenario?.id) return;

    deleteScenarioMutation.mutate(lastSavedScenario.id, {
      onSuccess: () => {
        showSuccessToastWithTimeout("Scenario deleted successfully");
        router.push("/admin/scenarios");
      },
      onError: (error) => {
        showErrorToastWithTimeout(getErrorMessage(error));
      },
    });
  };

  const handleCancelClicked = () => {
    if (isDirty) {
      // User made changes, confirm if he wants to quit
      onOpenCancel();
    } else {
      // User didn't make changes, change proceed to confirm action
      handleConfirmCancel();
    }
  };

  const handleConfirmCancel = () => {
    reset(lastSavedScenario);
    setIsBeingEdited(false);
  };

  const form = (
    <TagsProvider>
      <FormProvider {...methods}>
        <form
          className="w-full flex justify-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="w-full space-y-3 border p-3">
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

            <div className="w-full border p-3 space-y-3">
              <HidableSection
                section={
                  <ScenarioRolesForm
                    availableRoles={allRoles || []}
                    isBeingEdited={isBeingEdited}
                  />
                }
                titleElement={
                  <p className="text-xl">
                    <FormattedMessage
                      defaultMessage="Roles in scenario"
                      id="scenarios.new.page.rolesInScenario"
                    />
                  </p>
                }
              />
            </div>

            <div className="w-full border p-3 space-y-3">
              <HidableSection
                section={<ScenarioItemsForm isBeingEdited={isBeingEdited} />}
                titleElement={
                  <p className="text-xl">
                    <FormattedMessage
                      defaultMessage="Items in scenario"
                      id="scenarios.new.page.itemsInScenario"
                    />
                  </p>
                }
              />
            </div>

            <div className="w-full border p-3 space-y-3">
              <HidableSection
                section={
                  <ActionsListForm
                    basePath={`actions`}
                    isBeingEdited={isBeingEdited}
                  />
                }
                titleElement={
                  <p className="text-xl">
                    <FormattedMessage
                      defaultMessage="Actions in scenario"
                      id="scenarios.new.page.actionsInScenario"
                    />
                  </p>
                }
              />
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
                  onCancelEditClicked={handleCancelClicked}
                  onDeleteClicked={onOpenDelete}
                  onEditClicked={() => setIsBeingEdited(true)}
                />
              </div>
            )}
          </div>
        </form>
      </FormProvider>
    </TagsProvider>
  );

  if (isError) {
    return (
      <div className="w-full flex justify-center">
        <p>{error?.message}</p>
      </div>
    );
  }

  return (
    <LoadingOverlay
      isLoading={isSaving || isDeleting || isLoadingRoles}
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
