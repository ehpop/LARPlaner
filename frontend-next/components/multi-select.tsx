"use client";

import { Button, Input, Select, SelectItem } from "@nextui-org/react";
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
    <div className="w-full space-y-10 lg:space-y-3 overflow-y-auto">
      {selectedOptions.map((selectedOption, index) => (
        <div
          key={`option-${selectedOption}-container`}
          className="lg:w-3/4 w-full flex justify-between items-baseline"
        >
          <Select
            className="w-1/2"
            label={selectLabel}
            size="sm"
            variant="bordered"
            onChange={(e) => handleSelectChange(index, e)}
          >
            {getAvailableOptions(selectedOption).map((option: string) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </Select>
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
            onClick={() => removeSelect(index)}
          >
            {removeButtonLabel}
          </Button>
        </div>
      ))}
      <Button color="success" size="sm" onClick={addSelect}>
        {addButtonLabel}
      </Button>
    </div>
  );
};

export default MultiSelect;
