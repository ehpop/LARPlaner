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
import React from "react";
import QRCode from "react-qr-code";

const QRModal = ({ isOpen, onOpenChange, selectedItem }: any) => {
  return (
    <>
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
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

const Item = ({ item }: any) => {
  const [showItem, setShowItem] = React.useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedItem, setSelectedItem] = React.useState("");
  const onOpenModal = (item: string) => {
    setSelectedItem(item);
    onOpen();
  };

  return (
    <div className="w-full flex flex-col border-1 p-3 space-y-3">
      <div className="w-full flex flex-row justify-between">
        <Input
          className="lg:w-1/4 w-3/4"
          isDisabled={true}
          label="Nazwa przedmiotu"
          size="sm"
          value={item.name}
          variant="underlined"
        />
        <Button
          color="primary"
          size="sm"
          variant="bordered"
          onClick={() => onOpenModal(item.name)}
        >
          Kod QR
        </Button>
        <Button
          size="sm"
          variant="bordered"
          onClick={() => setShowItem(!showItem)}
        >
          {showItem ? "-" : "+"}
        </Button>
      </div>
      {showItem && (
        <>
          <Input
            className="w-full"
            isDisabled={true}
            label="Opis przedmiotu"
            size="sm"
            value={item.description}
            variant="underlined"
          />
          <div className="w-full border-1 p-3 space-y-3">
            <p>Umiejętności wymagane do użycia przedmiotu</p>
            {item.skills.map((skill: any, index: number) => (
              <div
                key={index}
                className="lg:w-1/2 w-full flex flex-row space-x-3 items-baseline"
              >
                <Select
                  className="lg:w-3/4 w-full"
                  defaultSelectedKeys={[skill.name]}
                  isDisabled={true}
                  label="Umiejętność"
                  placeholder="Wybierz umiejętność"
                  variant="underlined"
                >
                  <SelectItem key={skill.name} value={skill.name}>
                    {skill.name}
                  </SelectItem>
                </Select>
                <Input
                  className="lg:w-1/4 w-1/2"
                  isDisabled={true}
                  label="Poziom"
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
          {item.querks && (
            <div className="w-full border-1 p-3 space-y-3">
              <p>Wymagane querki</p>
              <div className="lg:w-1/2 w-full">
                <Select
                  className="lg:w-3/4 w-full"
                  defaultSelectedKeys={item.querks}
                  isDisabled={true}
                  placeholder="Wybierz querki"
                  selectionMode="multiple"
                  variant="underlined"
                >
                  {item.querks.map((querk: string) => (
                    <SelectItem key={querk} value={querk}>
                      {querk}
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
        onOpen={onOpen}
        onOpenChange={onOpenChange}
      />
    </div>
  );
};

const ItemDisplay = ({ items }: any) => {
  return (
    <>
      {items.map((item: any, index: number) => (
        <Item key={index} item={item} />
      ))}
    </>
  );
};

export default ItemDisplay;
