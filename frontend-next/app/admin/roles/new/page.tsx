"use client";

import {Button, Input, Textarea} from "@nextui-org/react";
import {useState} from "react";

const DEFAULT_ATTRIBUTE = {key: "", value: 50};

export default function RolesPage() {
    const [attributes, setAttributes] = useState([{...DEFAULT_ATTRIBUTE}]);
    const [querks, setQuerks] = useState<string[]>([]);

    const addAttribute = () => {
        setAttributes([...attributes, {...DEFAULT_ATTRIBUTE}]);
    };

    const removeAttribute = (index: number) => {
        const updatedAttributes = [...attributes];

        updatedAttributes.splice(index, 1);
        setAttributes(updatedAttributes);
    };

    const onAttributeChange = (index: number, key: string, value: string) => {
        const updatedAttributes = [...attributes];

        updatedAttributes[index] = {key: key, value: Number(value)};
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
                    Dodaj postać
                </p>
            </div>
            <Input
                isClearable
                className="w-full"
                label="Nazwa"
                placeholder="Wprowadź nazwę postaci..."
                size="lg"
                variant="underlined"
            />
            <Textarea
                className="w-full"
                label="Opis"
                placeholder="Wprowadź opis wydarzenia"
                size="lg"
                variant="underlined"
            />
            <div className="border-1 p-3 space-y-3">
                <p>Atrybuty</p>
                {attributes.map((attribute, index) => (
                    <div key={index} className="lg:w-1/2 w-full flex flex-col space-y-3">
                        <div className="flex flex-row space-x-3 items-baseline">
                            <Input
                                isClearable
                                className="w-1/2"
                                label="Nazwa"
                                placeholder="Wprowadź nazwę atrybutu..."
                                value={attribute.key}
                                variant="underlined"
                                onChange={(e) =>
                                    onAttributeChange(
                                        index,
                                        e.target.value,
                                        attribute.value.toString(),
                                    )
                                }
                            />
                            <Input
                                isClearable
                                className="w-1/6"
                                label="Wartość"
                                max={100}
                                min={0}
                                placeholder="Wprowadź wartość atrybutu..."
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
                                Usuń atrybut
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
                    Dodaj atrybut
                </Button>
            </div>
            <div className="border-1 p-3 space-y-3">
                <p>Querki postaci</p>
                {querks.map((querk, index) => (
                    <div
                        key={index}
                        className="lg:w-1/2 w-full flex flex-row space-x-3 items-baseline"
                    >
                        <Input
                            isClearable
                            className="lg:w-1/2 w-full"
                            label="Nazwa"
                            placeholder="Wprowadź nazwę qerka..."
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
                            Usuń qerk
                        </Button>
                    </div>
                ))}
                <Button color="success" size="sm" variant="solid" onClick={addQuerk}>
                    Dodaj qerk
                </Button>
            </div>
            <div className="w-full flex justify-end">
                <div className="flex justify-between space-x-3">
                    <Button color="danger" size="lg" variant="bordered">
                        Anuluj
                    </Button>
                    <Button color="success" size="lg">
                        Zapisz
                    </Button>
                </div>
            </div>
        </div>
    );
}
