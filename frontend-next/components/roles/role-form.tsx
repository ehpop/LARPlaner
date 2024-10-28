import {
  Button,
  Image,
  Input,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { FormattedMessage, useIntl } from "react-intl";
import React, { useState } from "react";
import { uuidv4 } from "@firebase/util";

import {
  emptyRole,
  exampleRole as exampleRole,
  possibleScenarios,
} from "@/data/mock-data";
import ConfirmActionModal from "@/components/buttons/confirm-action-modal";
import { ButtonPanel } from "@/components/buttons/button-pannel";

export default function RoleForm({ roleId }: { roleId?: string }) {
  const intl = useIntl();

  const isNewRole = !roleId;
  const initialRole = isNewRole ? emptyRole : exampleRole;

  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [selectedScenariosIds, setSelectedScenariosIds] = useState(
    possibleScenarios[0].id ? [possibleScenarios[0].id] : [],
  );
  const [role, setRole] = useState(initialRole);
  const [imageUrl, setImageUrl] = useState(role?.imageUrl);
  const [tags, setTags] = useState(
    role?.tags.map((tag) => ({ id: uuidv4(), value: tag })),
  );
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

  const handleTagChanged = (tagIndex: number, newTagValue: string) => {
    const updatedTags = [...(tags || [])];

    updatedTags[tagIndex] = { ...updatedTags[tagIndex], value: newTagValue };
    setTags(updatedTags);
  };

  const handleTagRemoved = (tagIndex: number) => {
    setTags(tags.filter((_tag, index) => index !== tagIndex));
  };

  const selectScenario = (
    <Select
      defaultSelectedKeys={selectedScenariosIds}
      description={intl.formatMessage({
        id: "role.page.display.scenario.description",
        defaultMessage:
          "Select one or more scenarios that will include this role",
      })}
      isDisabled={!(isBeingEdited || isNewRole)}
      label={intl.formatMessage({
        id: "role.page.display.scenario",
        defaultMessage: "Scenarios",
      })}
      placeholder={intl.formatMessage({
        id: "role.page.display.selectScenario",
        defaultMessage: "Select a scenario...",
      })}
      selectionMode="multiple"
      size="lg"
      variant="underlined"
      onChange={(event) => {
        setSelectedScenariosIds(event.target.value.split(",").map(Number));
      }}
    >
      {possibleScenarios.map((scenario) => (
        // @ts-ignore
        <SelectItem key={scenario.id} value={scenario.name}>
          {scenario.name}
        </SelectItem>
      ))}
    </Select>
  );

  const roleDescription = (
    <Textarea
      description={intl.formatMessage({
        id: "events.id.page.description.description",
        defaultMessage: "Base description of the character",
      })}
      isDisabled={!(isBeingEdited || isNewRole)}
      label={intl.formatMessage({
        id: "events.id.page.description.label",
        defaultMessage: "Description",
      })}
      size="lg"
      value={role.description}
      variant="underlined"
      onChange={(e) => setRole({ ...role, description: e.target.value })}
    />
  );
  const roleName = (
    <Input
      isDisabled={!(isBeingEdited || isNewRole)}
      label={intl.formatMessage({
        id: "role.display.name",
        defaultMessage: "Name",
      })}
      size="lg"
      value={role.name}
      variant="underlined"
      onChange={(e) => setRole({ ...role, name: e.target.value })}
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
      <p className="text-xl font-bold">
        <FormattedMessage
          defaultMessage="Character's tags:"
          id="role.id.page.display.tags"
        />
      </p>
      {tags.length === 0 ? (
        <div className="w-full h-1/5 text-xl flex justify-center items-center">
          <p>
            <FormattedMessage
              defaultMessage="No tags"
              id="role.display.noTags"
            />
          </p>
        </div>
      ) : (
        tags.map((tag, index) => (
          <div
            key={tag.id}
            className="w-full flex flex-row space-x-3 items-baseline"
          >
            <Input
              className="w-full"
              defaultValue={tag.value}
              isDisabled={!(isBeingEdited || isNewRole)}
              label={intl.formatMessage({
                defaultMessage: "Tag's Name",
                id: "role.display.tag.name",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "Insert tag name...",
                id: "role.display.tag.name.placeholder",
              })}
              size="sm"
              variant="underlined"
              onChange={(e) => {
                handleTagChanged(index, e.target.value);
              }}
            />
            {(isBeingEdited || isNewRole) && (
              <Button
                className="w-1/4"
                color="danger"
                size="sm"
                onClick={(_event) => {
                  handleTagRemoved(index);
                }}
              >
                <FormattedMessage
                  defaultMessage="Remove"
                  id="role.display.remove"
                />
              </Button>
            )}
          </div>
        ))
      )}
      {(isBeingEdited || isNewRole) && (
        <div className="w-full flex justify-center">
          <Button
            color="success"
            size="md"
            onPress={() => {
              if (tags.findIndex((tag) => tag.value === "") === -1) {
                setTags([...tags, { id: uuidv4(), value: "" }]);
              }
            }}
          >
            <FormattedMessage
              defaultMessage="Add tag"
              id="role.display.addTag"
            />
          </Button>
        </div>
      )}
    </div>
  );

  const imageInput = (
    <div className="w-full flex sm:flex-row sm:space-x-3 sm:space-y-0 flex-col-reverse space-x-0 space-y-3  sm:items-center">
      <Textarea
        className="w-full sm:w-1/2"
        description={intl.formatMessage({
          id: "role.display.image.description",
          defaultMessage: "URL of the character's image",
        })}
        isDisabled={!(isBeingEdited || isNewRole)}
        label={intl.formatMessage({
          id: "role.display.image",
          defaultMessage: "Role image",
        })}
        size="lg"
        value={imageUrl}
        variant="underlined"
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <div className="w-full sm:w-1/2 ">
        <Image
          alt="Character's image"
          className="max-w-full"
          fallbackSrc="/images/role-fallback.jpg"
          src={imageUrl}
        />
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
          "Are you sure you want to delete this role? This action will not be reversible.",
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
          setIsBeingEdited(false);
        }}
      />
      {confirmCancel}
      {confirmDelete}
    </div>
  );

  const saveButton = (
    <div className="w-full flex justify-end space-x-3">
      <Button color="success" size="lg">
        <FormattedMessage defaultMessage="Save" id="role.display.save" />
      </Button>
    </div>
  );

  return (
    <div className="sm:w-4/5 w-full space-y-10 border-1 p-3">
      {titleElement}
      <div className="space-y-3">
        <div className="w-full flex sm:flex-row sm:space-x-3 sm:space-y-0 flex-col space-x-0 space-y-3 align-bottom">
          {roleName}
          {selectScenario}
        </div>
        {imageInput}
        {roleDescription}
      </div>

      <div className="w-full flex flex-col space-y-3 space-x-0 sm:flex-row sm:space-x-3 sm:space-y-0">
        {tagsElement}
      </div>

      {isNewRole ? saveButton : actionButtons}
    </div>
  );
}
