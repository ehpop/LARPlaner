import React, { useState } from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { Button } from "@nextui-org/button";

const SelectUniqueOptions = ({ roles }: any) => {
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
      (role: string) =>
        !selectedOptions.includes(role) || role === currentSelection,
    );
  };

  const submitSelect = () => {};

  return (
    <div>
      <div>
        {selectedOptions.map((selectedOption, index) => (
          <div key={index}>
            <p style={{ marginRight: "4px" }}>{index + 1}</p>
            <Select
              className="w-1/2"
              items={roles}
              label="Role"
              placeholder="Wybierz role..."
              variant="underlined"
              onChange={(e) => handleSelectChange(index, e)}
            >
              {getAvailableOptions(selectedOption).map((role: string) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </Select>
            <Button type="button" onClick={() => removeSelect(index)}>
              -
            </Button>
          </div>
        ))}
      </div>
      <div>
        <Button type="button" onClick={addSelect}>
          + Add another
        </Button>
        <Button type="button" onClick={submitSelect}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default SelectUniqueOptions;
