"use client";

import { useState } from "react";
import {
  Button,
  Image,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { FormattedMessage, useIntl } from "react-intl";
import { uuidv4 } from "@firebase/util";

import { scenarios } from "@/data/mock-data";

const AttributeInput = ({
  attribute,
  index,
  handleAttributeChange,
}: {
  attribute: { id: string; name: string; value: number };
  index: number;
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

export default function AddRolePage() {
  const intl = useIntl();
  const [imageUrl, setImageUrl] = useState("");
  const [selectedScenario, setSelectedScenario] = useState<string[]>([]);
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [gmNotes, setGMNotes] = useState("");
  const [tags, setTags] = useState([{ id: uuidv4(), value: "" }]);
  const [attributes, setAttributes] = useState([
    { id: uuidv4(), name: "", value: 0 },
  ]);

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
    if (attributes.some((attr) => attr.name === "")) return;
    setAttributes([...attributes, { id: uuidv4(), name: "", value: 0 }]);
  };

  const handleTagChanged = (index: number, newTagValue: string) => {
    const updatedTags = [...tags];

    updatedTags[index] = { ...updatedTags[index], value: newTagValue };
    setTags(updatedTags);
  };

  const handleAddTag = () => {
    if (tags.some((tag) => tag.value === "")) return;
    setTags([...tags, { id: uuidv4(), value: "" }]);
  };

  const handleTagRemoved = (tagIndex: number) => {
    setTags(tags.filter((_tag, index) => index !== tagIndex));
  };

  const selectScenario = (
    <Select
      label={intl.formatMessage({
        id: "roles.new.page.display.scenario",
        defaultMessage: "Scenarios",
      })}
      placeholder={intl.formatMessage({
        id: "roles.new.page.display.selectScenario",
        defaultMessage: "Select a scenario...",
      })}
      selectionMode="multiple"
      size="lg"
      variant="underlined"
      onChange={(event) => setSelectedScenario(event.target.value.split(","))}
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
      label={intl.formatMessage({
        id: "role.new.page.description.label",
        defaultMessage: "Description",
      })}
      placeholder={intl.formatMessage({
        id: "role.new.page.description.placeholder",
        defaultMessage: "Enter description...",
      })}
      size="lg"
      value={description}
      variant="underlined"
      onChange={(e) => setDescription(e.target.value)}
    />
  );

  const roleGMNotes = (
    <Textarea
      label={intl.formatMessage({
        id: "role.display.gm.notes.label",
        defaultMessage: "GM Notes",
      })}
      placeholder={intl.formatMessage({
        id: "role.display.gm.notes.placeholder",
        defaultMessage: "Enter GM notes...",
      })}
      size="lg"
      value={gmNotes}
      variant="underlined"
      onChange={(e) => setGMNotes(e.target.value)}
    />
  );

  const roleNameInput = (
    <Input
      label={intl.formatMessage({
        id: "role.display.name",
        defaultMessage: "Name",
      })}
      placeholder={intl.formatMessage({
        id: "role.display.name.placeholder",
        defaultMessage: "Enter role name...",
      })}
      size="lg"
      value={roleName}
      variant="underlined"
      onChange={(e) => setRoleName(e.target.value)}
    />
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
            <AttributeInput
              attribute={attribute}
              handleAttributeChange={handleAttributeChange}
              index={index}
            />
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
          </div>
        ))
      )}
      <div className="w-full flex justify-center">
        <Button color="success" size="md" onClick={handleAddAttribute}>
          <FormattedMessage
            defaultMessage="Add attribute"
            id="role.display.addAttribute"
          />
        </Button>
      </div>
    </div>
  );

  const tagsElement = (
    <div className="w-full sm:w-1/2 min-h-full border-1 p-3 space-y-3">
      <p className="text-xl font-bold">
        <FormattedMessage defaultMessage="Tags:" id="role.new.page.tags" />
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
              placeholder={intl.formatMessage({
                defaultMessage: "Insert tag name...",
                id: "role.display.tag.name.placeholder",
              })}
              value={tag.value}
              variant="underlined"
              onChange={(e) => handleTagChanged(index, e.target.value)}
            />

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
          </div>
        ))
      )}
      <div className="w-full flex justify-center">
        <Button color="success" size="md" onClick={handleAddTag}>
          <FormattedMessage defaultMessage="Add tag" id="role.display.addTag" />
        </Button>
      </div>
    </div>
  );

  const imageInput = (
    <div className="w-full flex sm:flex-row sm:space-x-3 sm:space-y-0 flex-col-reverse space-x-0 space-y-3 sm:items-center">
      <Textarea
        className="w-full sm:w-1/2"
        label={intl.formatMessage({
          id: "role.new.page.display.image.label",
          defaultMessage: "Role image",
        })}
        placeholder={intl.formatMessage({
          id: "role.new.page.display.image.placeholder",
          defaultMessage: "Enter image URL...",
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
          fallbackSrc="images/role-fallback.jpg"
          src={imageUrl}
        />
      </div>
    </div>
  );

  return (
    <div className="w-full h-full flex justify-center">
      <div className="sm:w-3/4 w-full space-y-10 border-1 p-3">
        <div className="w-full flex justify-center">
          <p className="text-3xl">
            <FormattedMessage
              defaultMessage="Add New Role"
              id="role.display.addTitle"
            />
          </p>
        </div>

        <div className="space-y-3">
          <div className="w-full flex sm:flex-row sm:space-x-3 sm:space-y-0 flex-col space-x-0 space-y-3 align-bottom">
            {roleNameInput}
            {selectScenario}
          </div>
          {imageInput}
          {roleDescription}
          {roleGMNotes}
        </div>

        <div className="w-full flex flex-col space-y-3 space-x-0 sm:flex-row sm:space-x-3 sm:space-y-0">
          {attributesElement}
          {tagsElement}
        </div>

        <div className="w-full flex justify-end space-x-3">
          <Button color="success" size="lg">
            <FormattedMessage defaultMessage="Save" id="role.display.save" />
          </Button>
        </div>
      </div>
    </div>
  );
}
