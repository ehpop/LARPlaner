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

import {
  possibleAttributes,
  possibleTags,
  role as initialRole,
  scenarios,
} from "@/data/mock-data";

const AttributeDisplay = ({
  attribute,
  index,
  isBeingEdited,
  handleAttributeChange,
}: {
  attribute: { name: string; value: number };
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
      <Select
        className="lg:w-3/4 w-full"
        defaultSelectedKeys={[attribute.name]}
        isDisabled={!isBeingEdited}
        label={
          <FormattedMessage
            defaultMessage="Attribute"
            id="role.display.attribute"
          />
        }
        variant="underlined"
        onChange={(event) =>
          handleAttributeChange(index, "name", event.target.value)
        }
      >
        {possibleAttributes.map((attribute) => (
          <SelectItem key={attribute.key} value={attribute.name}>
            {attribute.name}
          </SelectItem>
        ))}
      </Select>
      <Input
        className="lg:w-1/4 w-1/2"
        isDisabled={!isBeingEdited}
        label={
          <FormattedMessage defaultMessage="Value" id="role.display.value" />
        }
        size="sm"
        type="number"
        value={attribute.value.toString()}
        variant="underlined"
        onChange={(e) =>
          handleAttributeChange(index, "value", parseInt(e.target.value))
        }
      />
    </div>
  );
};

export default function RoleDisplayPage({ params }: any) {
  const intl = useIntl();
  const [imageUrl, setImageUrl] = useState(
    "https://media.mythopedia.com/6cugv2Onrb7n1IDYjJBTmD/e309806f7646daef4b8abb7b0fc19dcc/wizard-name-generator.jpg?w=1280&h=720&fit=crop&crop=top2",
  );
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState([scenarios[0]]);
  const [role, setRole] = useState(initialRole);

  const handleAttributeChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const updatedAttributes = role.attributes.map((attribute, i) =>
      i === index ? { ...attribute, [field]: value } : attribute,
    );

    setRole({ ...role, attributes: updatedAttributes });
  };

  const handleTagsChange = (selectedTags: string[]) => {
    setRole({ ...role, tags: selectedTags });
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
      isDisabled={!isBeingEdited}
      label={intl.formatMessage({
        id: "role.display.description",
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
  const attributesContainer = (
    <div className="w-full sm:w-1/2 min-h-full border-1 p-3 space-y-3">
      <p className="text-xl font-bold">
        <FormattedMessage
          defaultMessage="Attributes:"
          id="role.display.attributes"
        />
      </p>
      {role.attributes.map((attribute, index) => (
        <AttributeDisplay
          key={attribute.name}
          attribute={attribute}
          handleAttributeChange={handleAttributeChange}
          index={index}
          isBeingEdited={isBeingEdited}
        />
      ))}
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
      <div className="w-full">
        <Select
          className="w-full"
          defaultSelectedKeys={role.tags}
          isDisabled={!isBeingEdited}
          placeholder={intl.formatMessage({
            id: "role.display.tags.placeholder",
            defaultMessage: "Select tags",
          })}
          selectionMode="multiple"
          variant="underlined"
          onChange={(event) => handleTagsChange([event.target.value])}
        >
          {possibleTags.map((tag) => (
            <SelectItem key={tag} value={tag}>
              {tag}
            </SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );

  const editButtons = (
    <>
      <div className="flex space-x-3">
        <Button
          color="danger"
          size="lg"
          onPress={() => setIsBeingEdited(false)}
        >
          <FormattedMessage defaultMessage="Cancel" id="role.display.cancel" />
        </Button>
        <Button
          color="success"
          size="lg"
          onPress={() => setIsBeingEdited(false)}
        >
          <FormattedMessage defaultMessage="Save" id="role.display.save" />
        </Button>
      </div>
    </>
  );
  const controlButtons = (
    <>
      <div className="space-x-3">
        <Button color="danger" size="lg">
          <FormattedMessage defaultMessage="Delete" id="role.display.delete" />
        </Button>
        <Button
          color="warning"
          size="lg"
          onPress={() => setIsBeingEdited(true)}
        >
          <FormattedMessage defaultMessage="Edit" id="role.display.edit" />
        </Button>
      </div>
    </>
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
          <div className="w-full flex sm:flex-row sm:space-x-3 sm:space-y-0 flex-col-reverse space-x-0 space-y-3  sm:items-center">
            <Input
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
                src={imageUrl}
              />
            </div>
          </div>
          {roleDescription}
        </div>

        <div className="w-full flex flex-col space-y-3 space-x-0 sm:flex-row sm:space-x-3 sm:space-y-0">
          {attributesContainer}
          {tagsElement}
        </div>

        <div className="w-full flex justify-end space-x-3">
          {isBeingEdited ? editButtons : controlButtons}
        </div>
      </div>
    </div>
  );
}
