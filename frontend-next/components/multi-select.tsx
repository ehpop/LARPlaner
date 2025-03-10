"use client";

import { Button, Input, Select, SelectItem } from "@heroui/react";
import React, { useState } from "react";

interface MultiSelectProps {
  options: string[];
  addButtonLabel: string;
  removeButtonLabel: string;
  selectLabel: string;
  counterLabel: string;
  minCounterValue: number;
  maxCounterValue?: number;
  defaultCounterValue: string;
}

const MultiSelect = ({
  options,
  addButtonLabel,
  removeButtonLabel,
  selectLabel,
  counterLabel,
  minCounterValue,
  maxCounterValue,
  defaultCounterValue,
}: MultiSelectProps) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleSelectChange = (index: number, event: any) => {
    const newSelection = event.target.value;
    const updatedSelections = [...selectedOptions];

    updatedSelections[index] = newSelection;
    setSelectedOptions(updatedSelections);
  };

  const addSelect = () => {
    if (selectedOptions?.length < options.length) {
      setSelectedOptions([...selectedOptions, ""]);
    }
  };

  const removeSelect = (index: number) => {
    const updatedSelections = [...selectedOptions];

    updatedSelections.splice(index, 1);
    setSelectedOptions(updatedSelections);
  };

  const getAvailableOptions = (currentSelection: string) => {
    return options.filter(
      (role: string) =>
        !selectedOptions.includes(role) || role === currentSelection,
    );
  };

  return (
    <div className="w-full space-y-10 lg:space-y-3 overflow-y-auto ">
      {selectedOptions.map((selectedOption, index) => (
        <div key={selectedOption} className="w-full flex space-x-3">
          <Select
            label={selectLabel}
            size="sm"
            variant="underlined"
            onChange={(e) => handleSelectChange(index, e)}
          >
            {getAvailableOptions(selectedOption).map((option: string) => (
              <SelectItem key={option}>{option}</SelectItem>
            ))}
          </Select>
          <div className="w-full flex flex-row space-x-3 items-baseline">
            <Input
              className="w-1/4"
              defaultValue={defaultCounterValue}
              label={counterLabel}
              max={maxCounterValue}
              min={minCounterValue}
              size="sm"
              type="number"
              variant="underlined"
            />
            <Button
              color="danger"
              size="sm"
              variant="bordered"
              onPress={() => removeSelect(index)}
            >
              {removeButtonLabel}
            </Button>
          </div>
        </div>
      ))}
      <div className="w-full flex justify-center">
        <Button color="success" size="sm" onPress={addSelect}>
          {addButtonLabel}
        </Button>
      </div>
    </div>
  );
};

export default MultiSelect;
