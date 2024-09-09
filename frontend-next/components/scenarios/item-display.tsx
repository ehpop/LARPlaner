import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent, ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    useDisclosure
} from "@nextui-org/react";
import React from "react";
import QRCode from "react-qr-code";

const QRModal = ({isOpen, onOpen, onOpenChange, selectedItem}: any) => {
    return (
        <>
            <Modal
                backdrop="opaque"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
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
                    }
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{selectedItem}</ModalHeader>
                            <ModalBody className="dark:bg-white">
                                <div className="w-full flex justify-center">
                                    <QRCode value={selectedItem}/>
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
}


const Item = ({item}: any) => {
    const [showItem, setShowItem] = React.useState(true);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [selectedItem, setSelectedItem] = React.useState("");
    const onOpenModal = (item: string) => {
        setSelectedItem(item);
        onOpen();
    }

    return (
        <div className="w-full flex flex-col border-1 p-3 space-y-3">
            <div className="w-full flex flex-row justify-between">
                <Input
                    size="sm"
                    variant="underlined"
                    className="lg:w-1/4 w-3/4"
                    label="Nazwa przedmiotu"
                    value={item.name}
                    isDisabled={true}
                />
                <Button
                    size="sm"
                    variant="bordered"
                    color="primary"
                    onClick={() => onOpenModal(item.name)}
                >
                    Kod QR
                </Button>
                <Button
                    onClick={() => setShowItem(!showItem)}
                    size="sm"
                    variant="bordered"
                >
                    {showItem ? "-" : "+"}
                </Button>
            </div>
            {showItem && (
                <>
                    <Input
                        size="sm"
                        variant="underlined"
                        className="w-full"
                        label="Opis przedmiotu"
                        value={item.description}
                        isDisabled={true}
                    />
                    <div className="w-full border-1 p-3 space-y-3">
                        <p>Umiejętności wymagane do użycia przedmiotu</p>
                        {item.skills.map((skill: any, index: number) => (
                            <div key={index} className="lg:w-1/2 w-full flex flex-row space-x-3 items-baseline">
                                <Select
                                    className="lg:w-3/4 w-full"
                                    label="Umiejętność"
                                    placeholder="Wybierz umiejętność"
                                    variant="underlined"
                                    isDisabled={true}
                                    defaultSelectedKeys={[skill.name]}
                                >
                                    <SelectItem key={skill.name} value={skill.name}>
                                        {skill.name}
                                    </SelectItem>
                                </Select>
                                <Input
                                    value={skill.level}
                                    size="sm"
                                    isDisabled={true}
                                    className="lg:w-1/4 w-1/2"
                                    label="Poziom"
                                    type="number"
                                    variant="underlined"
                                    min="1"
                                    max="10"
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
                                    placeholder="Wybierz querki"
                                    isDisabled={true}
                                    defaultSelectedKeys={item.querks}
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
            <QRModal isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} selectedItem={selectedItem}/>
        </div>
    );
};

const ItemDisplay = ({items}: any) => {
    return (
        <>
            {items.map((item: any, index: number) => (
                <Item key={index} item={item}/>
            ))}
        </>
    );
};

export default ItemDisplay;
