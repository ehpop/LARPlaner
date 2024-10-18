"use client";

import React, { useState } from "react";
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
import { uuidv4 } from "@firebase/util";

import { role as initialRole, scenarios } from "@/data/mock-data";
import { ButtonPanel } from "@/components/buttons/button-pannel";
import ConfirmActionModal from "@/components/buttons/confirm-action-modal";

const AttributeDisplay = ({
  attribute,
  isBeingEdited,
  index,
  handleAttributeChange,
}: {
  attribute: { id: string; name: string; value: number };
  index: number;
  isBeingEdited: boolean;
  handleAttributeChange: (
    index: number,
    field: string,
    value: string | number,
  ) => void;
}) => {
  return (
    <div className="w-full flex flex-row space-x-3 items-baseline">
      <Input
        className="lg:w-3/4 w-full"
        isDisabled={!isBeingEdited}
        label={
          <FormattedMessage
            defaultMessage="Attribute"
            id="role.display.attribute"
          />
        }
        placeholder="Attribute name"
        value={attribute.name}
        variant="underlined"
        onChange={(e) => handleAttributeChange(index, "name", e.target.value)}
      />

      <Input
        className="lg:w-1/4 w-1/2"
        isDisabled={!isBeingEdited}
        label={
          <FormattedMessage defaultMessage="Value" id="role.display.value" />
        }
        type="number"
        value={attribute.value.toString()}
        variant="underlined"
        onChange={(e) =>
          handleAttributeChange(index, "value", Number(e.target.value))
        }
      />
    </div>
  );
};

export default function RoleDisplayPage({ params }: any) {
  const intl = useIntl();

  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState([scenarios[0]]);
  const [role, setRole] = useState(initialRole);
  const [imageUrl, setImageUrl] = useState(role.imageUrl);
  const [tags, setTags] = useState(
    role.tags.map((tag) => ({ id: uuidv4(), value: tag })),
  );
  const [attributes, setAttributes] = useState(
    role.attributes.map((attr) => ({ ...attr, id: uuidv4() })),
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

  const handleAttributeChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const updatedAttributes = attributes.map((attr, i) =>
      i === index ? { ...attr, [field]: value } : attr,
    );

    setAttributes(updatedAttributes);
  };

  const handleAttributeRemoved = (index: number) => {
    const updatedAttributes = attributes.filter((_, i) => i !== index);

    setAttributes(updatedAttributes);
  };

  const handleAddAttribute = () => {
    if (attributes.filter((attr) => attr.name === "").length > 0) {
      return;
    }

    setAttributes([...attributes, { id: uuidv4(), name: "", value: 0 }]);
  };

  const handleTagChanged = (tagIndex: number, newTagValue: string) => {
    const updatedTags = [...tags];

    updatedTags[tagIndex] = { ...updatedTags[tagIndex], value: newTagValue };
    setTags(updatedTags);
  };

  const handleTagRemoved = (tagIndex: number) => {
    setTags(tags.filter((_tag, index) => index !== tagIndex));
  };

  const selectScenario = (
    <Select
      defaultSelectedKeys={selectedScenario}
      description={intl.formatMessage({
        id: "events.page.display.scenario.description",
        defaultMessage:
          "Select one or more scenarios that will include this role",
      })}
      isDisabled={!isBeingEdited}
      label={intl.formatMessage({
        id: "events.page.display.scenario",
        defaultMessage: "Scenarios",
      })}
      placeholder={intl.formatMessage({
        id: "events.page.display.selectScenario",
        defaultMessage: "Select a scenario...",
      })}
      selectionMode="multiple"
      size="lg"
      variant="underlined"
      onChange={(event) => {
        setSelectedScenario(event.target.value.split(","));
      }}
    >
      {scenarios.map((scenario) => (
        <SelectItem key={scenario} value={scenario}>
          {scenario}
        </SelectItem>
      ))}
    </Select>
  );

  const roleDescription = (
    <Textarea
      description={intl.formatMessage({
        id: "role.display.description.description",
        defaultMessage: "Base description of the character",
      })}
      isDisabled={!isBeingEdited}
      label={intl.formatMessage({
        id: "role.display.description.label",
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
      isDisabled={!isBeingEdited}
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

  const pageTitle = (
    <div className="w-full flex justify-center">
      <p className="text-3xl">
        <FormattedMessage
          defaultMessage={`Character '${params.id}'`}
          id="role.display.title"
        />
      </p>
    </div>
  );
  const attributesElement = (
    <div className="w-full sm:w-1/2 min-h-full border-1 p-3 space-y-3">
      <p className="text-xl font-bold">
        <FormattedMessage
          defaultMessage="Attributes:"
          id="role.display.attributes"
        />
      </p>
      {attributes.length === 0 ? (
        <div className="w-full h-1/5 text-xl flex justify-center items-center">
          <p>
            <FormattedMessage
              defaultMessage="No attributes"
              id="role.display.noAttributes"
            />
          </p>
        </div>
      ) : (
        attributes.map((attribute, index) => (
          <div
            key={attribute.id}
            className="w-full flex flex-row space-x-3 items-baseline"
          >
            <AttributeDisplay
              attribute={attribute}
              handleAttributeChange={handleAttributeChange}
              index={index}
              isBeingEdited={isBeingEdited}
            />
            {isBeingEdited && (
              <Button
                className="w-1/4"
                color="danger"
                size="sm"
                onClick={() => handleAttributeRemoved(index)}
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
      {isBeingEdited && (
        <div className="w-full flex justify-center">
          <Button color="success" size="md" onClick={handleAddAttribute}>
            <FormattedMessage
              defaultMessage="Add attribute"
              id="role.display.addAttribute"
            />
          </Button>
        </div>
      )}
    </div>
  );
  const tagsElement = (
    <div className="w-full sm:w-1/2 min-h-full border-1 p-3 space-y-3">
      <p className="text-xl font-bold">
        <FormattedMessage
          defaultMessage="Character's tags:"
          id="role.display.tags"
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
              isDisabled={!isBeingEdited}
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
            {isBeingEdited && (
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
      {isBeingEdited && (
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
        isDisabled={!isBeingEdited}
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

  return (
    <div className="w-full h-full flex justify-center">
      <div className="sm:w-3/4 w-full space-y-10 border-1 p-3">
        {pageTitle}

        <div className="space-y-3">
          <div className="w-full flex sm:flex-row sm:space-x-3 sm:space-y-0 flex-col space-x-0 space-y-3 align-bottom">
            {roleName}
            {selectScenario}
          </div>
          {imageInput}
          {roleDescription}
        </div>

        <div className="w-full flex flex-col space-y-3 space-x-0 sm:flex-row sm:space-x-3 sm:space-y-0">
          {attributesElement}
          {tagsElement}
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
            onEditClicked={() => setIsBeingEdited(true)}
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
