"use client";

import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import MultiSelect from "@/components/multi-select";

const Item = ({ skills, querks, removeItem, index }: any) => {
  const [showItem, setShowItem] = useState(true);
  const intl = useIntl();

  return (
    <div className="w-full flex justify-between items-center space-y-3 space-x-3">
      <div className="w-full flex flex-col border-1 space-y-3 p-3">
        <div className="w-full flex flex-row justify-between space-y-3">
          <Input
            className="lg:w-1/4 w-1/2"
            label={intl.formatMessage({
              id: "scenarios.id.page.itemName",
              defaultMessage: "Name",
            })}
            placeholder={intl.formatMessage({
              id: "scenarios.id.page.itemNamePlaceholder",
              defaultMessage: "Name...",
            })}
            size="sm"
            type="text"
            variant="underlined"
          />
          <div className="space-x-3">
            <Button
              size="sm"
              variant="bordered"
              onPress={() => setShowItem(!showItem)}
            >
              {showItem ? "-" : "+"}
            </Button>
            <Button
              color="danger"
              size="sm"
              variant="bordered"
              onPress={() => removeItem(index)}
            >
              <FormattedMessage
                defaultMessage={"Remove"}
                id={"scenarios.id.page.removeItemButton"}
              />
            </Button>
          </div>
        </div>
        <div className={showItem ? "space-y-3" : "hidden"}>
          <Input
            className="lg:w-1/2 w-3/4"
            label={intl.formatMessage({
              id: "scenarios.id.page.itemDescription",
              defaultMessage: "Description",
            })}
            placeholder={intl.formatMessage({
              id: "scenarios.id.page.insertItemDescription",
              defaultMessage: "Insert item description",
            })}
            size="sm"
            type="text"
            variant="underlined"
          />
          <div className="w-full flex flex-col border-1 p-3 space-y-3">
            <p>
              <FormattedMessage
                defaultMessage={"Required skills:"}
                id={"scenarios.id.page.requiredSkills"}
              />
            </p>
            <MultiSelect
              addButtonLabel={intl.formatMessage({
                id: "scenarios.id.page.addSkill",
                defaultMessage: "Add skill",
              })}
              counterLabel={intl.formatMessage({
                id: "scenarios.id.page.skillCount",
                defaultMessage: "Skill count",
              })}
              defaultCounterValue="10"
              maxCounterValue={10}
              minCounterValue={1}
              options={skills}
              removeButtonLabel={intl.formatMessage({
                id: "scenarios.id.page.removeSkill",
                defaultMessage: "Delete skill",
              })}
              selectLabel={intl.formatMessage({
                id: "scenarios.id.page.selectSkill",
                defaultMessage: "Select skill",
              })}
            />
          </div>
          {querks && (
            <div className="w-full flex flex-col border-1 p-3 space-y-3">
              <p>
                <FormattedMessage
                  defaultMessage={"Required querks:"}
                  id={"scenarios.id.page.requiredQuerks"}
                />
              </p>
              <div className="lg:w-1/2 w-3/4">
                <Select
                  className="w-full"
                  placeholder={intl.formatMessage({
                    id: "scenarios.id.page.selectQuerk",
                    defaultMessage: "Select querk",
                  })}
                  selectionMode="multiple"
                  variant="bordered"
                >
                  {querks.map((querk: string) => (
                    <SelectItem key={querk} value={querk}>
                      {querk}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ItemCreator = ({ skills, querks }: any) => {
  const [items, setItems] = useState<string[]>(["1st item"]);

  const addItem = () => {
    setItems([...items, ""]);
  };

  const removeItem = (index: number) => {
    const updatedItems = [...items];

    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  return (
    <div className="w-full space-y-10 lg:space-y-3 overflow-y-auto">
      {items.map((item, index) => (
        <Item
          key={index}
          index={index}
          querks={querks}
          removeItem={removeItem}
          skills={skills}
        />
      ))}
      <Button color="success" size="sm" variant="solid" onPress={addItem}>
        <FormattedMessage
          defaultMessage={"Add item"}
          id={"scenarios.id.page.addItemButton"}
        />
      </Button>
    </div>
  );
};

export default ItemCreator;
