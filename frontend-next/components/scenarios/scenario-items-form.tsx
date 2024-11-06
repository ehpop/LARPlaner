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
import { uuidv4 } from "@firebase/util";

import AutocompleteWithChips from "@/components/autocomplete-with-chips";
import { emptyScenarioItem, possibleTags } from "@/data/mock-data";
import { IScenario, IScenarioItem, IScenarioItemList } from "@/types";

const QRModal = ({
  isOpen,
  onOpenChange,
  itemName,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  itemName: string;
}) => {
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
              {itemName}
            </ModalHeader>
            <ModalBody className="dark:bg-white">
              <div className="w-full flex justify-center">
                <QRCode value={itemName} />
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
  handleItemRemove,
  handleItemChange,
  index,
  isBeingEdited,
}: {
  item: IScenarioItem;
  handleItemRemove: (index: number) => void;
  handleItemChange: (index: number, newScenarioItem: IScenarioItem) => void;
  index: number;
  isBeingEdited: boolean;
}) => {
  const intl = useIntl();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [showItem, setShowItem] = useState(true);
  const [selectedItem, setSelectedItem] = React.useState("");
  const [touched, setTouched] = useState({
    name: false,
    description: false,
  });

  const handleTouched = (key: keyof typeof touched) => {
    setTouched({ ...touched, [key]: true });
  };

  const onOpenModal = (item: string) => {
    setSelectedItem(item);
    onOpen();
  };

  const itemNameElement = (
    <Input
      isRequired
      className="w-1/2"
      defaultValue={item.name}
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
      variant="underlined"
      onChange={(e) => {
        handleItemChange(index, { ...item, name: e.target.value });
        handleTouched("name");
      }}
    />
  );

  const itemActionButtons = (
    <div className="flex flex-row lg:space-x-2 space-x-1">
      <Button
        color="primary"
        isDisabled={item.name === ""}
        size="sm"
        variant="bordered"
        onPress={() => onOpenModal(item.name)}
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
      {isBeingEdited && (
        <Button
          color="danger"
          isDisabled={!isBeingEdited}
          size="sm"
          variant="bordered"
          onPress={() => handleItemRemove(index)}
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
      isRequired
      className="w-full"
      defaultValue={item.description}
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
      variant="underlined"
      onChange={(e) => {
        handleItemChange(index, { ...item, description: e.target.value });
        handleTouched("description");
      }}
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
        allItems={possibleTags}
        isDisabled={!isBeingEdited}
        selectLabel={intl.formatMessage({
          defaultMessage: "Select required tags",
          id: "scenarios.new.page.selectRequiredTags",
        })}
        selectedItems={item.requiredTags}
        setSelectedItems={(tags) => {
          handleItemChange(index, { ...item, requiredTags: tags });
        }}
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
        itemName={selectedItem}
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
  initialItems?: IScenarioItemList;
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
    <div className="w-full space-y-10 lg:space-y-3 overflow-y-auto">
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
            index={index}
            isBeingEdited={isBeingEdited || false}
            item={item}
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
