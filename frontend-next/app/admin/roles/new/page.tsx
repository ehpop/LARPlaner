"use client";

import {Button, Input, Textarea} from "@nextui-org/react";
import {useState} from "react";

const DEFAULT_ATTRIBUTE = {key: "", value: 50};

export default function RolesPage() {

    const [attributes, setAttributes] = useState([{...DEFAULT_ATTRIBUTE}]);
    const [querks, setQuerks] = useState<string[]>([]);

    const addAttribute = () => {
        setAttributes([...attributes, {...DEFAULT_ATTRIBUTE}]);
    }

    const removeAttribute = (index: number) => {
        const updatedAttributes = [...attributes];
        updatedAttributes.splice(index, 1);
        setAttributes(updatedAttributes);
    }

    const onAttributeChange = (index: number, key: string, value: string) => {
        const updatedAttributes = [...attributes];
        updatedAttributes[index] = {key: key, value: Number(value)};
        setAttributes(updatedAttributes);
    }

    const addQuerk = () => {
        setQuerks([...querks, ""]);
    }

    const removeQuerk = (index: number) => {
        const updatedQuerks = [...querks];
        updatedQuerks.splice(index, 1);
        setQuerks(updatedQuerks);
    }

    const handleQuerkChanged = (index: number, newQuerkValue: string) => {
        const updatedQuerks = [...querks];
        updatedQuerks[index] = newQuerkValue;
        setQuerks(updatedQuerks);
    }

    return (
        <div className="space-y-10 border-1 p-3">
            <div className="w-full flex justify-center">
                <p id="add-event-modal" className="text-3xl">
                    Dodaj postać
                </p>
            </div>
            <Input
                size="lg"
                isClearable
                variant="underlined"
                className="w-full"
                label="Nazwa"
                placeholder="Wprowadź nazwę postaci..."
            />
            <Textarea
                size="lg"
                variant="underlined"
                className="w-full"
                label="Opis"
                placeholder="Wprowadź opis wydarzenia"
            />
            <div className="border-1 p-3 space-y-3">
                <p>Atrybuty</p>
                {
                    attributes.map((attribute, index) => (
                        <div key={index} className="lg:w-1/2 w-full flex flex-col space-y-3">
                            <div className="flex flex-row space-x-3 items-baseline">
                                <Input
                                    isClearable
                                    variant="underlined"
                                    className="w-1/2"
                                    label="Nazwa"
                                    value={attribute.key}
                                    placeholder="Wprowadź nazwę atrybutu..."
                                    onChange={(e) => onAttributeChange(index, e.target.value, attribute.value.toString())}
                                />
                                <Input
                                    isClearable
                                    variant="underlined"
                                    className="w-1/6"
                                    label="Wartość"
                                    placeholder="Wprowadź wartość atrybutu..."
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={attribute.value.toString()}
                                    onChange={(e) => onAttributeChange(index, attribute.key, e.target.value)}
                                />
                                <Button color="danger" variant="bordered" size="sm"
                                        onClick={() => removeAttribute(index)}>
                                    Usuń atrybut
                                </Button>
                            </div>
                        </div>
                    ))
                }
                <Button color="success" variant="solid" size="sm" onClick={addAttribute}>
                    Dodaj atrybut
                </Button>
            </div>
            <div className="border-1 p-3 space-y-3">
                <p>Querki postaci</p>
                {
                    querks.map((querk, index) => (
                        <div key={index} className="lg:w-1/2 w-full flex flex-row space-x-3 items-baseline">
                            <Input
                                isClearable
                                variant="underlined"
                                className="lg:w-1/2 w-full"
                                label="Nazwa"
                                placeholder="Wprowadź nazwę qerka..."
                                value={querk}
                                onChange={(e) => handleQuerkChanged(index, e.target.value)}
                            />
                            <Button color="danger" variant="bordered" size="sm" onClick={() => removeQuerk(index)}>
                                Usuń qerk
                            </Button>
                        </div>
                    ))
                }
                <Button color="success" variant="solid" size="sm" onClick={addQuerk}>
                    Dodaj qerk
                </Button>
            </div>
            <div className="w-full flex justify-end">
                <div className="flex justify-between space-x-3">
                    <Button color="danger" variant="bordered" size="lg">
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
