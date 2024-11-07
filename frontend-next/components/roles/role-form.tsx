import {
  Button,
  Image,
  Input,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { FormattedMessage, useIntl } from "react-intl";
import React, { useState } from "react";

import { emptyRole, exampleRole as exampleRole } from "@/data/mock-data";
import ConfirmActionModal from "@/components/buttons/confirm-action-modal";
import { ButtonPanel } from "@/components/buttons/button-pannel";
import { IRole } from "@/types";
import RoleTagsForm from "@/components/roles/role-tags-form";

export default function RoleForm({ roleId }: { roleId?: string }) {
  const intl = useIntl();

  const isNewRole = !roleId;
  const initialRole = isNewRole ? emptyRole : exampleRole;

  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [role, setRole] = useState(initialRole);
  const [imageUrl, setImageUrl] = useState(initialRole.imageUrl);
  const [showTags, setShowTags] = useState(true);

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
    alert("Saving role: " + JSON.stringify(role));
  };

  const roleDescription = (
    <Textarea
      isRequired
      defaultValue={role.description}
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
      defaultValue={role.name}
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
            values={{ roleName: roleId }}
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

  const imageInput = (
    <div className="w-full flex sm:flex-row sm:space-x-3 sm:space-y-0 flex-col-reverse space-x-0 space-y-3  sm:items-center">
      <Textarea
        className="w-full sm:w-1/2"
        defaultValue={imageUrl}
        description={intl.formatMessage({
          id: "role.display.image.description",
          defaultMessage: "URL of the character's image",
        })}
        errorMessage={intl.formatMessage({
          id: "role.display.image.error",
          defaultMessage: "Invalid URL",
        })}
        isDisabled={!(isBeingEdited || isNewRole)}
        isInvalid={
          imageUrl !== "" && imageUrl.match("^(http|https)://") === null
        }
        label={intl.formatMessage({
          id: "role.display.image",
          defaultMessage: "Role image",
        })}
        size="lg"
        variant="underlined"
        onChange={(e) => {
          setRole({ ...role, imageUrl: e.target.value });
          setImageUrl(e.target.value);
        }}
      />
      <div className="w-full sm:w-1/2">
        {imageUrl.match("^(http|https)://") !== null && (
          <Image
            alt="Character's image"
            className="max-w-full"
            fallbackSrc="/images/role-fallback.jpg"
            src={imageUrl}
          />
        )}
      </div>
    </div>
  );
  const confirmDelete = (
    <ConfirmActionModal
      handleOnConfirm={() => {
        alert("Role will be deleted");
      }}
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
          handleSave();
          setIsBeingEdited(false);
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

  return (
    <div className="sm:w-4/5 w-full space-y-10 border-1 p-3">
      {titleElement}
      <div className="space-y-3">
        {roleName}
        {imageInput}
        {roleDescription}
        {tagsElement}
      </div>
      {isNewRole ? saveButton : actionButtons}
    </div>
  );
}
