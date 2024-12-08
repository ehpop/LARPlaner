import { Button, Input, Textarea, useDisclosure } from "@nextui-org/react";
import { FormattedMessage, useIntl } from "react-intl";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { emptyRole } from "@/services/mock/mock-data";
import ConfirmActionModal from "@/components/buttons/confirm-action-modal";
import { ButtonPanel } from "@/components/buttons/button-pannel";
import RoleTagsForm from "@/components/roles/role-tags-form";
import { IRole } from "@/types/roles.types";
import rolesService from "@/services/roles.service";
import LoadingOverlay from "@/components/general/loading-overlay";

export default function RoleForm({ initialRole }: { initialRole?: IRole }) {
  const intl = useIntl();
  const router = useRouter();

  const isNewRole = !initialRole;

  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [role, setRole] = useState(initialRole || emptyRole);
  const [roleBeforeEdit, setRoleBeforeEdit] = useState(role);
  const [showTags, setShowTags] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [touched, setTouched] = useState({
    name: false,
    description: false,
  });

  const handleTouched = (key: keyof typeof touched) => {
    if (touched[key]) {
      return;
    }
    setTouched({ ...touched, [key]: true });
  };

  const isInvalidProperty = (name: keyof typeof touched) => {
    if (!touched[name]) {
      return false;
    }

    return (
      role[name as keyof IRole] === undefined ||
      role[name as keyof IRole] === "" ||
      role[name as keyof IRole] === null
    );
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

    rolesService
      .save(role)
      .then((result) => {
        if (result.success) {
          toast("Role saved successfully", { type: "success" });
          router.push("/admin/roles");
        } else {
          toast(result.data, {
            type: "error",
          });
        }
      })
      .catch((error) => toast(error))
      .finally(() => {
        setIsSaving(false);
      });
  };

  const handleSaveEditedRole = () => {
    if (!role.id) {
      return toast("Role ID is missing", { type: "error" });
    }

    setIsSaving(true);

    rolesService
      .update(role.id, role)
      .then((result) => {
        if (result.success) {
          toast("Role updated successfully", { type: "success" });
          setIsBeingEdited(false);
          setRole(result.data);
          setRoleBeforeEdit(result.data);
        } else {
          toast(result.data, {
            type: "error",
          });
        }
      })
      .catch((error) => toast(error))
      .finally(() => {
        setIsSaving(false);
      });
  };

  const handleConfirmDelete = () => {
    if (role.id === null) {
      return;
    }

    setIsDeleting(true);
    rolesService
      .delete(role.id)
      .then((result) => {
        if (result.success) {
          toast("Role deleted successfully", { type: "success" });
          router.push("/admin/roles");
        } else {
          toast(result.data, {
            type: "error",
          });
        }
      })
      .catch((error) => toast(error))
      .finally(() => {
        setIsDeleting(false);
      });
  };

  const roleDescription = (
    <Textarea
      isRequired
      description={intl.formatMessage({
        id: "events.id.page.description.description",
        defaultMessage: "Base description of the character",
      })}
      errorMessage={intl.formatMessage({
        id: "role.display.description.error",
        defaultMessage: "Description cannot be empty",
      })}
      isDisabled={!(isBeingEdited || isNewRole)}
      isInvalid={isInvalidProperty("description")}
      label={intl.formatMessage({
        id: "events.id.page.description.label",
        defaultMessage: "Description",
      })}
      placeholder={intl.formatMessage({
        id: "role.display.description.placeholder",
        defaultMessage: "Insert role description...",
      })}
      size="lg"
      value={role.description}
      variant="underlined"
      onChange={(e) => {
        setRole({ ...role, description: e.target.value });
        handleTouched("description");
      }}
    />
  );
  const roleName = (
    <Input
      isRequired
      errorMessage={intl.formatMessage({
        id: "role.display.name.error",
        defaultMessage: "Role name cannot be empty",
      })}
      isDisabled={!(isBeingEdited || isNewRole)}
      isInvalid={isInvalidProperty("name")}
      label={intl.formatMessage({
        id: "role.display.name",
        defaultMessage: "Name",
      })}
      placeholder={intl.formatMessage({
        id: "role.display.name.placeholder",
        defaultMessage: "Insert role name...",
      })}
      size="lg"
      value={role.name}
      variant="underlined"
      onChange={(e) => {
        setRole({ ...role, name: e.target.value });
        handleTouched("name");
      }}
    />
  );

  const titleElement = (
    <div className="w-full flex justify-center">
      <p className="text-3xl">
        {isNewRole ? (
          <FormattedMessage defaultMessage="New Role" id="role.form.newRole" />
        ) : (
          <FormattedMessage
            defaultMessage='Role "{roleName}"'
            id="role.form.roleName"
            values={{ roleName: role.name }}
          />
        )}
      </p>
    </div>
  );

  const tagsElement = (
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
        <RoleTagsForm
          isBeingEdited={isNewRole || isBeingEdited}
          role={role}
          setRole={setRole}
        />
      )}
    </div>
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
      handleOnConfirm={() => {
        setIsBeingEdited(false);
        setRole(roleBeforeEdit);
      }}
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

  const actionButtons = (
    <div className="w-full flex justify-end">
      <ButtonPanel
        isBeingEdited={isBeingEdited}
        onCancelEditClicked={() => {
          onOpenCancel();
        }}
        onDeleteClicked={() => {
          onOpenDelete();
        }}
        onEditClicked={() => setIsBeingEdited(true)}
        onSaveClicked={() => {
          handleSaveEditedRole();
        }}
      />
      {confirmCancel}
      {confirmDelete}
    </div>
  );

  const saveButton = (
    <div className="w-full flex justify-end space-x-3">
      <Button
        color="success"
        size="lg"
        onPress={() => {
          handleSave();
        }}
      >
        <FormattedMessage defaultMessage="Save" id="role.display.save" />
      </Button>
    </div>
  );

  const form = (
    <div className="w-full flex flex-col justify-center border-1 p-3 space-y-3">
      {titleElement}
      {roleName}
      {roleDescription}
      {tagsElement}
      {isNewRole ? saveButton : actionButtons}
    </div>
  );

  return (
    <LoadingOverlay
      isLoading={isSaving || isDeleting}
      label={isSaving ? "Saving..." : "Deleting..."}
    >
      {form}
    </LoadingOverlay>
  );
}
