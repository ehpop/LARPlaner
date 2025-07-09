import { Button, Input, Textarea, useDisclosure } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form"; // <-- RHF imports
import { FormattedMessage, useIntl } from "react-intl";

import { ButtonPanel } from "@/components/buttons/button-pannel";
import ConfirmActionModal from "@/components/buttons/confirm-action-modal";
import LoadingOverlay from "@/components/general/loading-overlay";
import InputTagsWithTable from "@/components/input-tags-with-table";
import { TagsProvider } from "@/providers/tags-provider";
import { emptyRole } from "@/services/mock/mock-data";
import rolesService from "@/services/roles.service";
import { IRole } from "@/types/roles.types";
import {
  showErrorToastWithTimeout,
  showSuccessToastWithTimeout,
} from "@/utils/toast";

export default function RoleForm({ initialRole }: { initialRole?: IRole }) {
  const intl = useIntl();
  const router = useRouter();

  const isNewRole = !initialRole;

  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [showTags, setShowTags] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
    setIsSaving(true);
    const serviceAction = isNewRole
      ? rolesService.save(data)
      : rolesService.update(data.id!, data);

    serviceAction
      .then((result) => {
        if (result.success) {
          showSuccessToastWithTimeout("Role saved successfully");
          if (isNewRole) {
            router.push("/admin/roles");
          } else {
            setIsBeingEdited(false);
            reset(result.data);
            setLastSavedRole(result.data);
          }
        } else {
          showErrorToastWithTimeout(result.data);
        }
      })
      .catch((error) => showErrorToastWithTimeout(error))
      .finally(() => setIsSaving(false));
  };

  const handleConfirmDelete = () => {
    if (!lastSavedRole?.id) return;
    setIsDeleting(true);
    rolesService
      .delete(lastSavedRole.id)
      .then((result) => {
        if (result.success) {
          showSuccessToastWithTimeout("Role deleted successfully");
          router.push("/admin/roles");
        } else {
          showErrorToastWithTimeout(result.data);
        }
      })
      .catch((error) => showErrorToastWithTimeout(error))
      .finally(() => setIsDeleting(false));
  };

  const handleConfirmCancel = () => {
    reset(lastSavedRole);
    setIsBeingEdited(false);
  };

  const form = (
    <TagsProvider>
      <form
        className="w-full flex flex-col justify-center border-1 p-3 space-y-3"
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
                defaultMessage: "Base description of this role",
              })}
              errorMessage={errors.description?.message}
              isDisabled={!isNewRole && !isBeingEdited}
              isInvalid={!!errors.description}
              label={intl.formatMessage({
                id: "role.id.page.description.label",
                defaultMessage: "Role description",
              })}
              placeholder={intl.formatMessage({
                id: "role.display.description.placeholder",
                defaultMessage: "Enter role description",
              })}
              size="lg"
              variant="underlined"
            />
          )}
          rules={{
            required: intl.formatMessage({
              defaultMessage: "Description cannot be empty",
              id: "role.display.description.required",
            }),
          }}
        />

        <div className="w-full min-h-full border-1 p-3 space-y-3">
          <div className="w-full flex flex-row justify-between">
            <p className="text-xl font-bold">
              <FormattedMessage
                defaultMessage="Character's tags:"
                id="role.id.page.display.tags"
              />
            </p>
            <Button
              size="sm"
              variant="bordered"
              onPress={() => setShowTags(!showTags)}
            >
              {showTags ? "-" : "+"}
            </Button>
          </div>
          {showTags && (
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
          )}
        </div>

        {isNewRole ? (
          <div className="w-full flex justify-end space-x-3">
            <Button
              color="success"
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
              isSaveButtonTypeSubmit={true}
              isSaveDisabled={!isDirty || isSaving}
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
              defaultMessage: "Saving...",
              id: "role.form.saving",
            })
          : intl.formatMessage({
              defaultMessage: "Deleting...",
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
