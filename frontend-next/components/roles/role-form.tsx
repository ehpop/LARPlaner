import { Button, Input, Textarea, useDisclosure } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form"; // <-- RHF imports
import { FormattedMessage, useIntl } from "react-intl";

import { ButtonPanel } from "@/components/buttons/button-pannel";
import ConfirmActionModal from "@/components/buttons/confirm-action-modal";
import LoadingOverlay from "@/components/common/loading-overlay";
import InputTagsWithTable from "@/components/tags/input-tags-with-table";
import { IRole, IRolePersisted } from "@/types/roles.types";
import {
  showErrorToastWithTimeout,
  showSuccessToastWithTimeout,
} from "@/utils/toast";
import {
  useCreateRole,
  useDeleteRole,
  useUpdateRole,
} from "@/services/roles/useRoles";
import { TagsProvider } from "@/providers/tags-provider";
import { emptyRole } from "@/types/initial-types";
import { getErrorMessage } from "@/utils/error";
import HidableSection from "@/components/common/hidable-section";

export default function RoleForm({ initialRole }: { initialRole?: IRole }) {
  const intl = useIntl();
  const router = useRouter();

  const isNewRole = !initialRole;

  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [lastSavedRole, setLastSavedRole] = useState(initialRole);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<IRole>({
    defaultValues: lastSavedRole || emptyRole,
  });

  const watchedRoleName = watch("name");

  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const deleteRoleMutation = useDeleteRole();

  const isSaving = createRoleMutation.isPending || updateRoleMutation.isPending;
  const isDeleting = deleteRoleMutation.isPending;

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

  const onSubmit = (data: IRole) => {
    if (isNewRole) {
      createRoleMutation.mutate(data, {
        onSuccess: () => {
          showSuccessToastWithTimeout("Role created successfully");
          router.push("/admin/roles");
        },
        onError: (error) => {
          showErrorToastWithTimeout(getErrorMessage(error));
        },
      });
    } else {
      updateRoleMutation.mutate(data as IRolePersisted, {
        onSuccess: (updatedRole) => {
          showSuccessToastWithTimeout("Role updated successfully");
          setIsBeingEdited(false);
          reset(updatedRole);
          setLastSavedRole(updatedRole);
        },
        onError: (error) => {
          showErrorToastWithTimeout(getErrorMessage(error));
        },
      });
    }
  };

  const handleConfirmDelete = () => {
    if (!lastSavedRole?.id) return;

    deleteRoleMutation.mutate(lastSavedRole.id, {
      onSuccess: () => {
        showSuccessToastWithTimeout("Role deleted successfully");
        router.push("/admin/roles");
      },
      onError: (error) => {
        showErrorToastWithTimeout(getErrorMessage(error));
      },
    });
  };

  const handleConfirmCancel = () => {
    reset(lastSavedRole);
    setIsBeingEdited(false);
  };

  const form = (
    <TagsProvider>
      <form
        className="w-full flex flex-col justify-center border p-3 space-y-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full flex justify-center">
          <p className="text-3xl">
            {isNewRole ? (
              <FormattedMessage
                defaultMessage="New Role"
                id="role.form.newRole"
              />
            ) : (
              <FormattedMessage
                defaultMessage='Role "{roleName}"'
                id="role.form.roleName"
                values={{ roleName: watchedRoleName }}
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
              description={intl.formatMessage({
                defaultMessage:
                  "Name of this role that will be used in scenario",
                id: "role.display.name.description",
              })}
              errorMessage={errors.name?.message}
              isDisabled={!isNewRole && !isBeingEdited}
              isInvalid={!!errors.name}
              label={intl.formatMessage({
                defaultMessage: "Role name",
                id: "role.display.name",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "Enter role name",
                id: "role.display.name.placeholder",
              })}
              size="lg"
              variant="underlined"
            />
          )}
          rules={{
            required: intl.formatMessage({
              defaultMessage: "Role name cannot be empty",
              id: "role.display.name.required",
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
              description={intl.formatMessage({
                id: "role.id.page.description.description",
                defaultMessage: "Base description of this ole",
              })}
              errorMessage={errors.description?.message}
              isDisabled={!isNewRole && !isBeingEdited}
              isInvalid={!!errors.description}
              label={intl.formatMessage({
                id: "role.id.page.description.label",
                defaultMessage: "Role descripion",
              })}
              placeholder={intl.formatMessage({
                id: "role.display.description.placeholder",
                defaultMessage: "Enter role descripion",
              })}
              size="lg"
              variant="underlined"
            />
          )}
          rules={{
            required: intl.formatMessage({
              defaultMessage: "Description cannot be empty",
              id: "role.display.description.requred",
            }),
          }}
        />

        <div className="w-full min-h-full border p-3 space-y-3">
          <HidableSection
            section={
              <Controller
                control={control}
                name="tags"
                render={({ field }) => (
                  <InputTagsWithTable
                    addedTags={field.value || []}
                    description={intl.formatMessage({
                      defaultMessage: "Required tags to display action",
                      id: "scenarios.new.page.requiredTagsToDisplayActionDescription",
                    })}
                    inputLabel={intl.formatMessage({
                      defaultMessage: "Required tags to display action",
                      id: "scenarios.new.page.input",
                    })}
                    isDisabled={!isNewRole && !isBeingEdited}
                    placeholder={intl.formatMessage({
                      defaultMessage: "Enter tag name",
                      id: "role.display.tag.name.placeholder",
                    })}
                    setAddedTags={field.onChange}
                  />
                )}
              />
            }
            titleElement={
              <p className="text-xl font-bold">
                <FormattedMessage
                  defaultMessage="Character's tags:"
                  id="role.id.page.display.tags"
                />
              </p>
            }
          />
        </div>

        {isNewRole ? (
          <div className="w-full flex justify-end space-x-3">
            <Button
              color="success"
              isDisabled={isSaving}
              isLoading={isSaving}
              size="lg"
              type="submit"
            >
              <FormattedMessage defaultMessage="Save" id="role.display.save" />
            </Button>
          </div>
        ) : (
          <div className="w-full flex justify-end">
            <ButtonPanel
              isBeingEdited={isBeingEdited}
              isDeleteDisabled={isDeleting || isSaving}
              isDeleteLoading={isDeleting}
              isSaveButtonTypeSubmit={true}
              isSaveDisabled={!isDirty || isSaving}
              isSaveLoading={isSaving}
              onCancelEditClicked={onOpenCancel}
              onDeleteClicked={onOpenDelete}
              onEditClicked={() => setIsBeingEdited(true)}
            />
          </div>
        )}
      </form>
    </TagsProvider>
  );

  const confirmDelete = (
    <ConfirmActionModal
      handleOnConfirm={handleConfirmDelete}
      isConfirmActionDisabled={isDeleting}
      isOpen={isOpenDelete}
      prompt={intl.formatMessage({
        id: "roles.id.page.delete",
        defaultMessage:
          "Are you sure you want to delete this role? Role will be deleted from all scenarios. This action will not be reversible.",
      })}
      title={intl.formatMessage({
        id: "roles.id.page.deleteTitle",
        defaultMessage: "Do you want to delete this role?",
      })}
      onOpenChange={onOpenChangeDelete}
    />
  );

  const confirmCancel = (
    <ConfirmActionModal
      handleOnConfirm={handleConfirmCancel}
      isOpen={isOpenCancel}
      prompt={intl.formatMessage({
        id: "roles.id.page.cancelEdit",
        defaultMessage:
          "Are you sure you want to cancel your changes? This action will not be reversible.",
      })}
      title={intl.formatMessage({
        id: "roles.id.page.cancelEditTitle",
        defaultMessage: "Do you want to cancel added changes?",
      })}
      onOpenChange={onOpenChangeCancel}
    />
  );

  return (
    <LoadingOverlay
      isLoading={isSaving || isDeleting}
      label={
        isSaving
          ? intl.formatMessage({
              defaultMessage: "Saving role...",
              id: "role.form.saving",
            })
          : intl.formatMessage({
              defaultMessage: "Deleting role...",
              id: "role.form.deleting",
            })
      }
    >
      {form}
      {confirmCancel}
      {confirmDelete}
    </LoadingOverlay>
  );
}
