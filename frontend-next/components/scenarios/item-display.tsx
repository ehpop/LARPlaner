import React from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import QRCode from "react-qr-code";
import { useIntl } from "react-intl";

import { scenario } from "@/data/mock-data"; // Import the useIntl hook for translations

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
  isBeingEdited,
}: {
  item: (typeof scenario.items)[0];
  isBeingEdited: boolean;
}) => {
  const intl = useIntl();
  const [showItem, setShowItem] = React.useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedItem, setSelectedItem] = React.useState("");

  const onOpenModal = (item: string) => {
    setSelectedItem(item);
    onOpen();
  };

  return (
    <div className="w-full flex flex-col border p-3 space-y-3">
      <div className="w-full flex flex-row justify-between">
        <Input
          className="sm:w-1/2 w-1/4"
          isDisabled={!isBeingEdited}
          label={intl.formatMessage({
            id: "item.name",
            defaultMessage: "Item Name",
          })}
          size="sm"
          value={item.name}
          variant="underlined"
        />
        <div className="flex flex-row lg:space-x-2 space-x-1">
          <Button
            color="primary"
            size="sm"
            variant="bordered"
            onPress={() => onOpenModal(item.name)}
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
          <div className="w-full border p-3 space-y-3">
            <p>
              {intl.formatMessage({
                id: "item.requiredSkills",
                defaultMessage: "Skills Required to Use Item",
              })}
            </p>
            {item.skills.map((skill: any, index: number) => (
              <div
                key={index}
                className="lg:w-1/2 w-full flex flex-row space-x-3 items-baseline"
              >
                <Select
                  className="lg:w-3/4 w-full"
                  defaultSelectedKeys={[skill.name]}
                  isDisabled={!isBeingEdited}
                  label={intl.formatMessage({
                    id: "item.skill",
                    defaultMessage: "Skill",
                  })}
                  placeholder={intl.formatMessage({
                    id: "item.chooseSkill",
                    defaultMessage: "Choose Skill",
                  })}
                  variant="underlined"
                >
                  <SelectItem key={skill.name} value={skill.name}>
                    {skill.name}
                  </SelectItem>
                </Select>
                <Input
                  className="lg:w-1/4 w-1/2"
                  isDisabled={!isBeingEdited}
                  label={intl.formatMessage({
                    id: "item.level",
                    defaultMessage: "Level",
                  })}
                  max="10"
                  min="1"
                  size="sm"
                  type="number"
                  value={skill.level}
                  variant="underlined"
                />
              </div>
            ))}
          </div>

          {item.tags && (
            <div className="w-full border p-3 space-y-3">
              <p>
                {intl.formatMessage({
                  id: "item.requiredTags",
                  defaultMessage: "Required Tags",
                })}
              </p>
              <div className="lg:w-1/2 w-full">
                <Select
                  className="lg:w-3/4 w-full"
                  defaultSelectedKeys={item.tags}
                  isDisabled={!isBeingEdited}
                  placeholder={intl.formatMessage({
                    id: "item.chooseTags",
                    defaultMessage: "Choose Tags",
                  })}
                  selectionMode="multiple"
                  variant="underlined"
                >
                  {item.tags.map((tag: string) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </Select>
              </div>
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
  items,
  isBeingEdited,
}: {
  items: typeof scenario.items;
  isBeingEdited: boolean;
}) => {
  return (
    <>
      {items.map((item: any, index: number) => (
        <Item key={index} isBeingEdited={isBeingEdited} item={item} />
      ))}
    </>
  );
};

export default ItemDisplay;
