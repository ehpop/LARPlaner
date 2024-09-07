"use client";

import {Button, Input, Select, SelectItem, Textarea} from "@nextui-org/react";

import React, {useState} from "react";
import MultiSelect from "@/components/multi-select";

const Item = ({skills, querks, removeItem, index}: any) => {
    const [showItem, setShowItem] = useState(true);

    return <div className="w-full flex justify-between items-center space-y-3 space-x-3">
        <div className="w-full flex flex-col border-1 space-y-3 p-3">
            <div className="w-full flex flex-row justify-between space-y-3">
                <Input
                    size="sm"
                    variant="underlined"
                    className="w-1/4"
                    label="Nazwa przedmiotu"
                    placeholder="Nazwa..."
                    type="text"
                />
                <div className="space-x-3">
                    <Button
                        onClick={() => setShowItem(!showItem)}
                        size="sm"
                        variant="bordered"
                    >
                        {showItem ? "-" : "+"}
                    </Button>
                    <Button
                        onClick={() => removeItem(index)}
                        size="sm"
                        color="danger"
                        variant="bordered"
                    >
                        Usuń
                    </Button>
                </div>
            </div>
            <div className={showItem ? "space-y-3" : "hidden"}>
                <Input
                    size="sm"
                    variant="underlined"
                    className="w-1/2"
                    label="Opis przedmiotu"
                    placeholder="Opis..."
                    type="text"/>
                <div className="w-full flex flex-col border-1 p-3 space-y-3">
                    <p>Umiejętności wymagane do użycia przedmiotu</p>
                    <MultiSelect
                        options={skills}
                        addButtonLabel="Dodaj wymaganą umiejętność"
                        removeButtonLabel="Usuń umiejętność"
                        selectLabel="Umiejętność"
                        counterLabel="Minimalny poziom"
                        defaultCounterValue="10"
                        minCounterValue={1}
                        maxCounterValue={10}
                    />
                </div>
                {
                    querks &&
                    <div className="w-full flex flex-col border-1 p-3 space-y-3">
                        <p>Dodaj wymagane querki postaci</p>
                        <div className="w-1/2">
                            <Select
                                className="w-3/4"
                                placeholder="Wybierz querki..."
                                selectionMode="multiple"
                                variant="bordered"
                            >
                                {
                                    querks.map((querk: string) => {
                                        return (
                                            <SelectItem key={querk} value={querk}>
                                                {querk}
                                            </SelectItem>
                                        )
                                    })
                                }
                            </Select>
                        </div>
                    </div>
                }
            </div>
        </div>
    </div>
}

const ItemCreator = ({skills, querks}: any) => {
    const [items, setItems] = useState<string[]>(["1st item"]);

    const addItem = () => {
        setItems([...items, ""]);
    }

    const removeItem = (index: number) => {
        const updatedItems = [...items];
        updatedItems.splice(index, 1);
        setItems(updatedItems);
    }

    return (
        <div className="w-full space-y-10 lg:space-y-3 overflow-y-auto">
            {
                items.map((item, index) => (
                    <Item
                        key={index}
                        skills={skills}
                        querks={querks}
                        removeItem={removeItem}
                        index={index}
                    />
                ))
            }
            <Button
                onClick={addItem}
                size="sm"
                color="success"
                variant="solid"
            >
                Dodaj
            </Button>
        </div>
    );
}

export default ItemCreator;
