import React, { useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import QRCode from "react-qr-code";
import { FormattedMessage, useIntl } from "react-intl";

import { possibleSkills } from "@/data/mock-data";
import MultiselectSearch from "@/components/autocomplete-with-chips";
import { IScenarioItem, IScenarioItemList } from "@/types"; // Import the useIntl hook for translations

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

const Item = ({
  item,
  index,
  isBeingEdited,
  removeItem,
}: {
  item: IScenarioItem;
  index: number;
  isBeingEdited: boolean;
  removeItem: (index: number) => void;
}) => {
  const intl = useIntl();
  const [showItem, setShowItem] = React.useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  //TODO REPLACE with JSON editing
  const [itemsName, setItemsName] = React.useState(item.name);
  const [selectedItem, setSelectedItem] = React.useState("");

  const onOpenModal = (item: string) => {
    setSelectedItem(item);
    onOpen();
  };

  const itemNameElement = (
    <Input
      defaultValue={item.name}
      isDisabled={!isBeingEdited}
      label={intl.formatMessage({
        id: "item.name",
        defaultMessage: "Item Name",
      })}
      size="sm"
      variant="underlined"
      onChange={(e) => setItemsName(e.target.value)}
    />
  );

  return (
    <div className="w-full flex flex-col border p-3 space-y-3">
      <div className="w-full flex flex-row justify-between">
        {itemNameElement}
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
          <Button
            className={isBeingEdited ? "" : "hidden"}
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

      {showItem && (
        <>
          <Input
            className="w-full"
            isDisabled={!isBeingEdited}
            label={intl.formatMessage({
              id: "item.description",
              defaultMessage: "Item Description",
            })}
            size="sm"
            value={item.description}
            variant="underlined"
          />
          {item.requiredTags && (
            <div className="w-full border p-3 space-y-3">
              <p>
                {intl.formatMessage({
                  id: "item.requiredTags",
                  defaultMessage: "Required Tags",
                })}
              </p>
              <MultiselectSearch
                array={possibleSkills.map((skill) => skill.name)}
                initialSelectedItems={item.requiredTags.map((tag) => tag.name)}
                isDisabled={!isBeingEdited}
                selectLabel={intl.formatMessage({
                  id: "item.chooseTags",
                  defaultMessage: "Choose Tags",
                })}
              />
            </div>
          )}
        </>
      )}

      <QRModal
        isOpen={isOpen}
        selectedItem={selectedItem}
        onOpenChange={onOpenChange}
      />
    </div>
  );
};

const ItemDisplay = ({
  initialItems,
  isBeingEdited,
}: {
  initialItems: IScenarioItemList;
  isBeingEdited: boolean;
}) => {
  const [items, setItems] = useState(initialItems);

  const removeItem = (index: number) => {
    const newItems = items.filter((item, i) => i !== index);

    setItems(newItems);
  };

  return (
    <>
      {items.map((item: any, index: number) => (
        <Item
          key={index}
          index={index}
          isBeingEdited={isBeingEdited}
          item={item}
          removeItem={removeItem}
        />
      ))}
    </>
  );
};

export default ItemDisplay;
