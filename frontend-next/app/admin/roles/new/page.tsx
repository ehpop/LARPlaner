"use client";

import { Button, Input, Textarea } from "@nextui-org/react";
import { useState } from "react";
import { useIntl } from "react-intl";

const DEFAULT_ATTRIBUTE = { key: "", value: 50 };

export default function RolesPage() {
  const intl = useIntl();
  const [attributes, setAttributes] = useState([{ ...DEFAULT_ATTRIBUTE }]);
  const [querks, setQuerks] = useState<string[]>([]);

  const addAttribute = () => {
    setAttributes([...attributes, { ...DEFAULT_ATTRIBUTE }]);
  };

  const removeAttribute = (index: number) => {
    const updatedAttributes = [...attributes];

    updatedAttributes.splice(index, 1);
    setAttributes(updatedAttributes);
  };

  const onAttributeChange = (index: number, key: string, value: string) => {
    const updatedAttributes = [...attributes];

    updatedAttributes[index] = { key: key, value: Number(value) };
    setAttributes(updatedAttributes);
  };

  const addQuerk = () => {
    setQuerks([...querks, ""]);
  };

  const removeQuerk = (index: number) => {
    const updatedQuerks = [...querks];

    updatedQuerks.splice(index, 1);
    setQuerks(updatedQuerks);
  };

  const handleQuerkChanged = (index: number, newQuerkValue: string) => {
    const updatedQuerks = [...querks];

    updatedQuerks[index] = newQuerkValue;
    setQuerks(updatedQuerks);
  };

  return (
    <div className="space-y-10 border-1 p-3">
      <div className="w-full flex justify-center">
        <p className="text-3xl" id="add-event-modal">
          {intl.formatMessage({
            id: "role.add.title",
            defaultMessage: "Add role"
          })}
        </p>
      </div>
      <Input
        isClearable
        className="w-full"
        label={intl.formatMessage({
          id: "role.add.name",
          defaultMessage: "Name"
        })}
        placeholder={intl.formatMessage({
          id: "role.add.name.placeholder",
          defaultMessage: "Insert role name..."
        })}
        size="lg"
        variant="underlined"
      />
      <Textarea
        className="w-full"
        label={intl.formatMessage({
          id: "role.add.description",
          defaultMessage: "Description"
        })}
        placeholder={intl.formatMessage({
          id: "role.add.description.placeholder",
          defaultMessage: "Insert role description..."
        })}
        size="lg"
        variant="underlined"
      />
      <div className="border-1 p-3 space-y-3">
        <p>
          {intl.formatMessage({
            id: "role.add.attributes",
            defaultMessage: "Attributes"
          })}
        </p>
        {attributes.map((attribute, index) => (
          <div key={index} className="lg:w-1/2 w-full flex flex-col space-y-3">
            <div className="flex flex-row space-x-3 items-baseline">
              <Input
                isClearable
                className="w-1/2"
                label={intl.formatMessage({
                  id: "role.add.attribute.name",
                  defaultMessage: "Name"
                })}
                placeholder={intl.formatMessage({
                  id: "role.add.attribute.name.placeholder",
                  defaultMessage: "Insert attribute name..."
                })}
                value={attribute.key}
                variant="underlined"
                onChange={(e) =>
                  onAttributeChange(
                    index,
                    e.target.value,
                    attribute.value.toString()
                  )
                }
              />
              <Input
                isClearable
                className="w-1/6"
                label={intl.formatMessage({
                  id: "role.add.attribute.value",
                  defaultMessage: "Value"
                })}
                max={100}
                min={0}
                placeholder={intl.formatMessage({
                  id: "role.add.attribute.value.placeholder",
                  defaultMessage: "Insert attribute value..."
                })}
                type="number"
                value={attribute.value.toString()}
                variant="underlined"
                onChange={(e) =>
                  onAttributeChange(index, attribute.key, e.target.value)
                }
              />
              <Button
                color="danger"
                size="sm"
                variant="bordered"
                onClick={() => removeAttribute(index)}
              >
                {intl.formatMessage({
                  id: "role.add.attribute.remove",
                  defaultMessage: "Delete attribute"
                })}
              </Button>
            </div>
          </div>
        ))}
        <Button
          color="success"
          size="sm"
          variant="solid"
          onClick={addAttribute}
        >
          {intl.formatMessage({
            id: "role.add.attribute.add",
            defaultMessage: "Add attribute"
          })}
        </Button>
      </div>
      <div className="border-1 p-3 space-y-3">
        <p>
          {intl.formatMessage({
            id: "role.add.querks",
            defaultMessage: "Character's querks"
          })}
        </p>
        {querks.map((querk, index) => (
          <div
            key={index}
            className="lg:w-1/2 w-full flex flex-row space-x-3 items-baseline"
          >
            <Input
              isClearable
              className="lg:w-1/2 w-full"
              label={intl.formatMessage({
                id: "role.add.querk.name",
                defaultMessage: "Name"
              })}
              placeholder={intl.formatMessage({
                id: "role.add.querk.placeholder",
                defaultMessage: "Input querk name..."
              })}
              value={querk}
              variant="underlined"
              onChange={(e) => handleQuerkChanged(index, e.target.value)}
            />
            <Button
              color="danger"
              size="sm"
              variant="bordered"
              onClick={() => removeQuerk(index)}
            >
              {intl.formatMessage({
                id: "role.add.querk.remove",
                defaultMessage: "Delete qerk"
              })}
            </Button>
          </div>
        ))}
        <Button color="success" size="sm" variant="solid" onClick={addQuerk}>
          {intl.formatMessage({
            id: "role.add.querk.add",
            defaultMessage: "Add querk"
          })}
        </Button>
      </div>
      <div className="w-full flex justify-end">
        <div className="flex justify-between space-x-3">
          <Button color="danger" size="lg" variant="bordered">
            {intl.formatMessage({
              id: "role.add.cancel",
              defaultMessage: "Cancel"
            })}
          </Button>
          <Button color="success" size="lg">
            {intl.formatMessage({
              id: "role.add.save",
              defaultMessage: "Save"
            })}
          </Button>
        </div>
      </div>
    </div>
  );
}
