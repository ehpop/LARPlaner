"use client";

import { Button, Input, Textarea, useDisclosure } from "@nextui-org/react";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { uuidv4 } from "@firebase/util";

import { emptyScenarioItem } from "@/services/mock/mock-data";
import {
  IScenario,
  IScenarioItem,
  IScenarioItemAction,
} from "@/types/scenario.types";
import { QrModal } from "@/components/general/qr-modal";
import { ItemActionsForm } from "@/components/scenarios/item-actions-form";
import { ITag } from "@/types/tags.types";

const ItemForm = ({
  item,
  handleItemRemove,
  handleItemChange,
  itemIndex,
  isBeingEdited,
}: {
  item: IScenarioItem;
  handleItemRemove: (index: number) => void;
  handleItemChange: (index: number, newScenarioItem: IScenarioItem) => void;
  itemIndex: number;
  isBeingEdited: boolean;
}) => {
  const intl = useIntl();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [showItem, setShowItem] = useState(true);
  const [showItemActions, setShowItemActions] = useState(true);
  const [selectedItem, setSelectedItem] = React.useState<IScenarioItem | null>(
    null,
  );
  const [touched, setTouched] = useState({
    name: false,
    description: false,
  });

  const handleTouched = (key: keyof typeof touched) => {
    setTouched({ ...touched, [key]: true });
  };

  const onOpenModal = (item: IScenarioItem) => {
    setSelectedItem(item);
    onOpen();
  };

  const itemNameElement = (
    <Input
      isRequired
      className="w-1/2"
      errorMessage={intl.formatMessage({
        id: "scenarios.new.page.itemName.error",
        defaultMessage: "Name is required",
      })}
      isDisabled={!isBeingEdited}
      isInvalid={touched.name && item.name === ""}
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
      value={item.name}
      variant="underlined"
      onChange={(e) => {
        handleItemChange(itemIndex, { ...item, name: e.target.value });
        handleTouched("name");
      }}
    />
  );

  const itemActionButtons = (
    <div className="flex flex-row lg:space-x-2 space-x-1">
      {isBeingEdited && (
        <Button
          color="danger"
          isDisabled={!isBeingEdited}
          size="sm"
          variant="bordered"
          onPress={() => handleItemRemove(itemIndex)}
        >
          <FormattedMessage
            defaultMessage={"Remove"}
            id={"scenarios.new.page.removeItemButton"}
          />
        </Button>
      )}
      <Button
        color="primary"
        isDisabled={item.name === ""}
        size="sm"
        variant="bordered"
        onPress={() => onOpenModal(item)}
      >
        <FormattedMessage defaultMessage="QR Code" id="item.qr" />
      </Button>
      <Button
        size="sm"
        variant="bordered"
        onPress={() => setShowItem(!showItem)}
      >
        {showItem ? "-" : "+"}
      </Button>
    </div>
  );

  const itemDescription = (
    <Textarea
      isRequired
      className="w-full"
      errorMessage={intl.formatMessage({
        id: "scenarios.new.page.description.error",
        defaultMessage: "Description is required",
      })}
      isDisabled={!isBeingEdited}
      isInvalid={touched.description && item.description === ""}
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
      value={item.description}
      variant="underlined"
      onChange={(e) => {
        handleItemChange(itemIndex, { ...item, description: e.target.value });
        handleTouched("description");
      }}
    />
  );

  const handleActionChange = (
    index: number,
    newAction: IScenarioItemAction,
  ) => {
    const updatedActions = [...item.actions];

    updatedActions[index] = newAction;
    handleItemChange(itemIndex, { ...item, actions: updatedActions });
  };

  const handleActionRemove = (index: number) => {
    const updatedActions = [...item.actions];

    updatedActions.splice(index, 1);
    handleItemChange(itemIndex, { ...item, actions: updatedActions });
  };
  const handleAddAction = () => {
    handleItemChange(itemIndex, {
      ...item,
      actions: [
        ...item.actions,
        {
          id: uuidv4(),
          name: "",
          description: "",
          tagsToRemoveOnSuccess: [] as ITag[],
          tagsToApplyOnSuccess: [] as ITag[],
          tagsToApplyOnFailure: [] as ITag[],
          requiredTagsToDisplay: [] as ITag[],
          requiredTagsToSucceed: [] as ITag[],
        } as IScenarioItemAction,
      ],
    });
  };
  const itemActionsForm = (
    <div className="w-full border-1 p-3 space-y-3">
      <div className="w-full flex flex-row justify-between">
        <p className="text-xl">
          <FormattedMessage
            defaultMessage={"Actions in item:"}
            id={"scenarios.items.form.actionsInItem"}
          />
        </p>
        <Button
          size="sm"
          variant="bordered"
          onPress={() => setShowItemActions(!showItemActions)}
        >
          {showItemActions ? "-" : "+"}
        </Button>
      </div>
      <div className={showItemActions ? "" : "hidden"}>
        <ItemActionsForm
          actions={item.actions}
          handleActionChange={handleActionChange}
          handleActionRemove={handleActionRemove}
          handleAddAction={handleAddAction}
          isRoleBeingEdited={isBeingEdited}
        />
      </div>
    </div>
  );

  return (
    <div className="w-full flex justify-between items-center space-y-3 space-x-3 dark:bg-custom-dark-gradient bg-custom-light-gradient">
      <div className="w-full flex flex-col border-1 space-y-3 p-3">
        <div className="w-full flex flex-row justify-between items-baseline">
          {itemNameElement}
          {itemActionButtons}
        </div>
        <div className={showItem ? "" : "hidden"}>
          {itemDescription}
          {itemActionsForm}
        </div>
      </div>
      <QrModal
        isOpen={isOpen}
        modalTitle={
          intl.formatMessage({
            defaultMessage: "QR Code for item: ",
            id: "scenarios.new.page.qrCodeModalTitle",
          }) + selectedItem?.name
        }
        qrCodeData={selectedItem?.id || ""}
        onOpenChange={onOpenChange}
      />
    </div>
  );
};

const ScenarioItemsForm = ({
  isBeingEdited,
  scenario,
  setScenario,
}: {
  initialItems?: IScenarioItem[];
  isBeingEdited?: boolean;
  scenario: IScenario;
  setScenario: (scenario: IScenario) => void;
}) => {
  const addItem = () => {
    setScenario({
      ...scenario,
      items: [
        ...scenario.items,
        {
          ...emptyScenarioItem,
          id: uuidv4(),
          scenarioId: scenario.id,
        },
      ],
    });
  };

  const handleItemRemove = (index: number) => {
    const updatedItems = [...scenario.items];

    updatedItems.splice(index, 1);
    setScenario({ ...scenario, items: updatedItems });
  };

  const handleItemChange = (index: number, newScenarioItem: IScenarioItem) => {
    const updatedItems = [...scenario.items];

    updatedItems[index] = newScenarioItem;
    setScenario({ ...scenario, items: updatedItems });
  };

  return (
    <div className="w-full space-y-3 overflow-y-auto">
      {scenario.items.length === 0 ? (
        <div className="w-full flex justify-center">
          <p>
            <FormattedMessage
              defaultMessage={"No items in scenario"}
              id={"scenarios.id.page.noItemsInScenario"}
            />
          </p>
        </div>
      ) : (
        scenario.items.map((item, index) => (
          <ItemForm
            key={item.id}
            handleItemChange={handleItemChange}
            handleItemRemove={handleItemRemove}
            isBeingEdited={isBeingEdited || false}
            item={item}
            itemIndex={index}
          />
        ))
      )}
      {isBeingEdited && (
        <div className="w-full flex justify-center">
          <Button color="success" variant="solid" onPress={() => addItem()}>
            <FormattedMessage
              defaultMessage={"Add item"}
              id={"scenarios.id.page.addItemButton"}
            />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ScenarioItemsForm;
