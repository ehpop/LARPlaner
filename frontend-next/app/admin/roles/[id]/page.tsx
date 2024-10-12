"use client";

import { useState } from "react";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { useIntl } from "react-intl";

import { role as initialRole } from "@/data/mock-data";

export default function RoleDisplayPage({ params }: any) {
  const intl = useIntl();
  const possibleAttributes = [
    { key: "strength", name: "Strength" },
    { key: "dexterity", name: "Dexterity" },
    { key: "intelligence", name: "Intelligence" },
    { key: "charisma", name: "Charisma" },
    { key: "wisdom", name: "Wisdom" },
    { key: "agility", name: "Agility" },
  ];
  const possibleQuerks = ["Brave", "Impulsive", "Strong", "Quick", "Clever"];

  const [isBeingEdited, setIsBeingEdited] = useState(false);
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

  const handleQuerksChange = (selectedQuerks: string[]) => {
    setRole({ ...role, querks: selectedQuerks });
  };

  return (
    <div className="w-full h-full flex justify-center">
      <div className="sm:w-3/4 w-full space-y-10 border-1 p-3">
        <div className="w-full flex justify-center">
          <p className="text-3xl">
            {intl.formatMessage({
              id: "role.display.title",
              defaultMessage: `Character '${params.id}'`,
            })}
          </p>
        </div>

        <div className="space-y-3">
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
        </div>

        <div className="space-y-3">
          <Input
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
        </div>

        <div className="border-1 p-3 space-y-3">
          <p className="text-xl font-bold">
            {intl.formatMessage({
              id: "role.display.attributes",
              defaultMessage: "Attributes:",
            })}
          </p>
          {role.attributes.map((attribute, index) => (
            <div
              key={index}
              className="lg:w-1/2 w-full flex flex-row space-x-3 items-baseline"
            >
              <Select
                key={index}
                className="lg:w-3/4 w-full"
                defaultSelectedKeys={[attribute.name]}
                isDisabled={!isBeingEdited}
                label={intl.formatMessage({
                  id: "role.display.attribute",
                  defaultMessage: "Attribute",
                })}
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
                label={intl.formatMessage({
                  id: "role.display.value",
                  defaultMessage: "Value",
                })}
                size="sm"
                type="number"
                value={attribute.value.toString()}
                variant="underlined"
                onChange={(e) =>
                  handleAttributeChange(
                    index,
                    "value",
                    parseInt(e.target.value),
                  )
                }
              />
            </div>
          ))}
        </div>

        <div className="border-1 p-3 space-y-3">
          <p className="text-xl font-bold">
            {intl.formatMessage({
              id: "role.display.querks",
              defaultMessage: "Character's querks:",
            })}
          </p>
          <div className="lg:w-1/2 w-full">
            <Select
              className="lg:w-3/4 w-full"
              defaultSelectedKeys={role.querks}
              isDisabled={!isBeingEdited}
              placeholder={intl.formatMessage({
                id: "role.display.querks.placeholder",
                defaultMessage: "Select querks",
              })}
              selectionMode="multiple"
              variant="underlined"
              onChange={(event) => handleQuerksChange([event.target.value])}
            >
              {possibleQuerks.map((querk) => (
                <SelectItem key={querk} value={querk}>
                  {querk}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>

        <div className="w-full flex justify-end space-x-3">
          {!isBeingEdited && (
            <div className="space-x-3">
              <Button color="danger" size="lg">
                {intl.formatMessage({
                  id: "role.display.delete",
                  defaultMessage: "Delete",
                })}
              </Button>
              <Button
                color="warning"
                size="lg"
                onPress={() => setIsBeingEdited(true)}
              >
                {intl.formatMessage({
                  id: "role.display.edit",
                  defaultMessage: "Edit",
                })}
              </Button>
            </div>
          )}
          {isBeingEdited && (
            <div className="flex space-x-3">
              <Button
                color="danger"
                size="lg"
                onPress={() => setIsBeingEdited(false)}
              >
                {intl.formatMessage({
                  id: "role.display.cancel",
                  defaultMessage: "Cancel",
                })}
              </Button>
              <Button
                color="success"
                size="lg"
                onPress={() => setIsBeingEdited(false)}
              >
                {intl.formatMessage({
                  id: "role.display.save",
                  defaultMessage: "Save",
                })}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
