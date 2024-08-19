"use client";

import {Button, Input, Select, SelectItem} from "@nextui-org/react";
import React, {useState} from "react";

const MultiSelect = ({roles}: any) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const handleSelectChange = (index: number, event: any) => {
        const newSelection = event.target.value;
        const updatedSelections = [...selectedOptions];
        updatedSelections[index] = newSelection;
        setSelectedOptions(updatedSelections);
    };

    const addSelect = () => {
        if (selectedOptions?.length < roles.length) {
            setSelectedOptions([...selectedOptions, ""]);
        }
    };

    const removeSelect = (index: number) => {
        const updatedSelections = [...selectedOptions];
        updatedSelections.splice(index, 1);
        setSelectedOptions(updatedSelections);
    };

    const getAvailableOptions = (currentSelection: string) => {
        return roles.filter(
            (role: string) => !selectedOptions.includes(role) || role === currentSelection
        );
    };


    return (
        <div className="w-full space-y-10 lg:space-y-3 max-h-[250px] overflow-y-auto">
            {
                selectedOptions.map((selectedOption, index) => (
                    <div className="lg:w-1/2 w-full flex justify-between items-baseline">
                        <Select
                            className="w-1/2"
                            label="Rola"
                            size="sm"
                            onChange={(e) => handleSelectChange(index, e)}
                        >
                            {getAvailableOptions(selectedOption).map((role: string) => (
                                <SelectItem key={role} value={role}>
                                    {role}
                                </SelectItem>
                            ))}
                        </Select>
                        <Input
                            size="sm"
                            variant="underlined"
                            className="w-1/4"
                            label="Ilość postaci"
                            placeholder="Ilość..."
                            defaultValue="1"
                            min={1}
                            type="number"/>
                        <Button
                            color="danger"
                            onClick={() => removeSelect(index)}
                            size="sm"
                            variant="bordered"
                        >
                            Usuń postać
                        </Button>
                    </div>
                ))}
            <Button
                color="success"
                onClick={addSelect}
                size="sm"
            >
                Dodaj postać
            </Button>
        </div>
    );
}

export default MultiSelect;
