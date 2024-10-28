"use client";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import QRCode from "react-qr-code";

import AutocompleteWithChips from "@/components/autocomplete-with-chips";
import { emptyScenarioItem, possibleTags } from "@/data/mock-data";
import { IScenarioItem, IScenarioItemList } from "@/types";

const QRModal = ({ isOpen, onOpenChange, selectedItem }: any) => {
  const intl = useIntl();

  return (
    <Modal
      backdrop="opaque"
      isOpen={isOpen}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {selectedItem}
            </ModalHeader>
            <ModalBody className="dark:bg-white">
              <div className="w-full flex justify-center">
                <QRCode value={selectedItem} />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="bordered" onPress={onClose}>
                {intl.formatMessage({
                  id: "common.close",
                  defaultMessage: "Close",
                })}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const ItemForm = ({
  item,
  removeItem,
  index,
  isBeingEdited,
}: {
  item: IScenarioItem;
  removeItem: (index: number) => void;
  index: number;
  isBeingEdited: boolean;
}) => {
  const intl = useIntl();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [showItem, setShowItem] = useState(true);
  //TODO REPLACE with JSON editing
  const [itemsName, setItemsName] = React.useState(item.name);
  const [selectedItem, setSelectedItem] = React.useState("");

  const onOpenModal = (item: string) => {
    setSelectedItem(item);
    onOpen();
  };

  const itemNameElement = (
    <Input
      className="w-1/2"
      defaultValue={item.name}
      isDisabled={!isBeingEdited}
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
      onChange={(e) => setItemsName(e.target.value)}
    />
  );
  const itemActionButtons = (
    <div className="flex flex-row lg:space-x-2 space-x-1">
      <Button
        color="primary"
        isDisabled={itemsName === ""}
        size="sm"
        variant="bordered"
        onPress={() => onOpenModal(itemsName)}
      >
        {intl.formatMessage({
          id: "item.qr",
          defaultMessage: "QR Code",
        })}
      </Button>
      <Button
        size="sm"
        variant="bordered"
        onPress={() => setShowItem(!showItem)}
      >
        {showItem ? "-" : "+"}
      </Button>
      {isBeingEdited && (
        <Button
          color="danger"
          isDisabled={!isBeingEdited}
          size="sm"
          variant="bordered"
          onPress={() => removeItem(index)}
        >
          <FormattedMessage
            defaultMessage={"Remove"}
            id={"scenarios.new.page.removeItemButton"}
          />
        </Button>
      )}
    </div>
  );
  const itemDescription = (
    <Textarea
      className="w-full"
      defaultValue={item.description}
      isDisabled={!isBeingEdited}
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
  );
  const itemRequiredTags = (
    <div className="w-full flex flex-col border-1 p-3 space-y-3">
      <p>
        <FormattedMessage
          defaultMessage={"Required tags:"}
          id={"scenarios.new.page.requiredTags"}
        />
      </p>
      <AutocompleteWithChips
        array={possibleTags.map((tag) => tag.name)}
        initialSelectedItems={item.requiredTags.map((tag) => tag.name)}
        isDisabled={!isBeingEdited}
        selectLabel={intl.formatMessage({
          defaultMessage: "Select required tags",
          id: "scenarios.new.page.selectRequiredTags",
        })}
      />
    </div>
  );

  return (
    <div className="w-full flex justify-between items-center space-y-3 space-x-3 dark:bg-custom-dark-gradient bg-custom-light-gradient">
      <div className="w-full flex flex-col border-1 space-y-3 p-3">
        <div className="w-full flex flex-row justify-between items-baseline">
          {itemNameElement}
          {itemActionButtons}
        </div>
        <div className={showItem ? "space-y-3" : "hidden"}>
          {itemDescription}
          {itemRequiredTags}
        </div>
      </div>
      <QRModal
        isOpen={isOpen}
        selectedItem={selectedItem}
        onOpenChange={onOpenChange}
      />
    </div>
  );
};

const ScenarioItemsForm = ({
  initialItems,
  isBeingEdited,
}: {
  initialItems?: IScenarioItemList;
  isBeingEdited?: boolean;
}) => {
  const [items, setItems] = useState<IScenarioItemList>(
    initialItems && initialItems.length > 0
      ? initialItems
      : [{ ...emptyScenarioItem, id: 1 }],
  );

  const addItem = () => {
    setItems([...items, { ...emptyScenarioItem, id: items.length + 1 }]);
  };

  const removeItem = (index: number) => {
    const updatedItems = [...items];

    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  return (
    <div className="w-full space-y-10 lg:space-y-3 overflow-y-auto">
      {items.map((item, index) => (
        <ItemForm
          key={`${item}-${index}`}
          index={index}
          isBeingEdited={isBeingEdited || false}
          item={item}
          removeItem={removeItem}
        />
      ))}
      {isBeingEdited && (
        <div className="w-full flex justify-center">
          <Button color="success" variant="solid" onPress={addItem}>
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
