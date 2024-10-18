"use client";

import { Button, Input, Textarea } from "@nextui-org/react";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import MultiSelect from "@/components/multi-select";
import AutocompleteWithChips from "@/components/autocomplete-with-chips";

const Item = ({ skills, tags, removeItem, index }: any) => {
  const [showItem, setShowItem] = useState(true);
  const intl = useIntl();

  return (
    <div className="w-full flex justify-between items-center space-y-3 space-x-3 dark:bg-custom-dark-gradient bg-custom-light-gradient">
      <div className="w-full flex flex-col border-1 space-y-3 p-3">
        <div className="w-full flex flex-row justify-between space-y-3">
          <Input
            className="w-1/2"
            label={intl.formatMessage({
              id: "scenarios.new.page.itemName",
              defaultMessage: "Name",
            })}
            placeholder={intl.formatMessage({
              id: "scenarios.new.page.itemNamePlaceholder",
              defaultMessage: "Name...",
            })}
            size="sm"
            type="text"
            variant="underlined"
          />
          <div className="flex flex-row lg:space-x-2 space-x-1">
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
                id={"scenarios.new.page.removeItemButton"}
              />
            </Button>
          </div>
        </div>
        <div className={showItem ? "space-y-3" : "hidden"}>
          <Textarea
            className="w-full"
            label={intl.formatMessage({
              id: "scenarios.new.page.itemDescription",
              defaultMessage: "Description",
            })}
            placeholder={intl.formatMessage({
              id: "scenarios.new.page.insertItemDescription",
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
                id={"scenarios.new.page.requiredSkills"}
              />
            </p>
            <MultiSelect
              addButtonLabel={intl.formatMessage({
                id: "scenarios.new.page.addSkill",
                defaultMessage: "Add skill",
              })}
              counterLabel={intl.formatMessage({
                id: "scenarios.new.page.skillValue",
                defaultMessage: "Skill value",
              })}
              defaultCounterValue="10"
              maxCounterValue={10}
              minCounterValue={1}
              options={skills}
              removeButtonLabel={intl.formatMessage({
                id: "scenarios.new.page.removeSkill",
                defaultMessage: "Delete",
              })}
              selectLabel={intl.formatMessage({
                id: "scenarios.new.page.selectSkill",
                defaultMessage: "Select skill",
              })}
            />
          </div>
          {tags && (
            <div className="w-full flex flex-col border-1 p-3 space-y-3">
              <p>
                <FormattedMessage
                  defaultMessage={"Required tags:"}
                  id={"scenarios.new.page.requiredTags"}
                />
              </p>
              <AutocompleteWithChips
                array={tags}
                selectLabel={intl.formatMessage({
                  defaultMessage: "Select required tags",
                  id: "scenarios.new.page.selectRequiredTags",
                })}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ItemCreator = ({ skills, tags }: any) => {
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
          key={`${item}-${index}`}
          index={index}
          removeItem={removeItem}
          skills={skills}
          tags={tags}
        />
      ))}
      <div className="w-full flex justify-center">
        <Button color="success" variant="solid" onPress={addItem}>
          <FormattedMessage
            defaultMessage={"Add item"}
            id={"scenarios.id.page.addItemButton"}
          />
        </Button>
      </div>
    </div>
  );
};

export default ItemCreator;
