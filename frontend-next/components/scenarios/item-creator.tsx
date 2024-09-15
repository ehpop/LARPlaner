"use client";

import {Button, Input, Select, SelectItem} from "@nextui-org/react";
import React, {useState} from "react";

import MultiSelect from "@/components/multi-select";

const Item = ({skills, querks, removeItem, index}: any) => {
    const [showItem, setShowItem] = useState(true);

    return (
        <div className="w-full flex justify-between items-center space-y-3 space-x-3">
            <div className="w-full flex flex-col border-1 space-y-3 p-3">
                <div className="w-full flex flex-row justify-between space-y-3">
                    <Input
                        className="lg:w-1/4 w-1/2"
                        label="Nazwa przedmiotu"
                        placeholder="Nazwa..."
                        size="sm"
                        type="text"
                        variant="underlined"
                    />
                    <div className="space-x-3">
                        <Button
                            size="sm"
                            variant="bordered"
                            onClick={() => setShowItem(!showItem)}
                        >
                            {showItem ? "-" : "+"}
                        </Button>
                        <Button
                            color="danger"
                            size="sm"
                            variant="bordered"
                            onClick={() => removeItem(index)}
                        >
                            Usuń
                        </Button>
                    </div>
                </div>
                <div className={showItem ? "space-y-3" : "hidden"}>
                    <Input
                        className="lg:w-1/2 w-3/4"
                        label="Opis przedmiotu"
                        placeholder="Opis..."
                        size="sm"
                        type="text"
                        variant="underlined"
                    />
                    <div className="w-full flex flex-col border-1 p-3 space-y-3">
                        <p>Umiejętności wymagane do użycia przedmiotu</p>
                        <MultiSelect
                            addButtonLabel="Dodaj wymaganą umiejętność"
                            counterLabel="Minimalny poziom"
                            defaultCounterValue="10"
                            maxCounterValue={10}
                            minCounterValue={1}
                            options={skills}
                            removeButtonLabel="Usuń umiejętność"
                            selectLabel="Umiejętność"
                        />
                    </div>
                    {querks && (
                        <div className="w-full flex flex-col border-1 p-3 space-y-3">
                            <p>Dodaj wymagane querki postaci</p>
                            <div className="lg:w-1/2 w-3/4">
                                <Select
                                    className="w-full"
                                    placeholder="Wybierz querki..."
                                    selectionMode="multiple"
                                    variant="bordered"
                                >
                                    {querks.map((querk: string) => (
                                        <SelectItem key={querk} value={querk}>
                                            {querk}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ItemCreator = ({skills, querks}: any) => {
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
                    key={index}
                    index={index}
                    querks={querks}
                    removeItem={removeItem}
                    skills={skills}
                />
            ))}
            <Button color="success" size="sm" variant="solid" onClick={addItem}>
                Dodaj
            </Button>
        </div>
    );
};

export default ItemCreator;
