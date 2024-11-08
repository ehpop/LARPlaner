"use client";

import { Autocomplete, AutocompleteItem, Chip } from "@nextui-org/react";
import { Check, X } from "lucide-react";

import { ITag } from "@/types/roles.types";

interface MultiselectSearchProps {
  allItems: ITag[];
  selectLabel: string;
  isDisabled?: boolean;
  selectedItems: ITag[];
  setSelectedItems: (items: ITag[]) => void;
}

const MultiselectSearch = ({
  isDisabled = false,
  allItems,
  selectLabel,
  selectedItems,
  setSelectedItems,
}: MultiselectSearchProps) => {
  const handleSelect = (item: ITag) => {
    if (!selectedItems.map((i) => i.key).includes(item.key)) {
      setSelectedItems([...selectedItems, item]);
    } else {
      setSelectedItems(
        selectedItems.filter((selection) => selection.key !== item.key),
      );
    }
  };

  const handleDeleteSelection = (item: ITag) => {
    setSelectedItems(
      selectedItems.filter((selection) => selection.key !== item.key),
    );
  };

  return (
    <div>
      <Autocomplete
        className="w-full"
        isDisabled={isDisabled}
        label={selectLabel}
        selectedKey={""}
        variant="underlined"
      >
        {allItems.map((item, index) => (
          <AutocompleteItem
            key={index}
            endContent={
              selectedItems.includes(item) && (
                <Check className="mr-2 text-green-500" size={16} />
              )
            }
            value={item.name}
            onClick={() => handleSelect(item)}
          >
            {item.name}
          </AutocompleteItem>
        ))}
      </Autocomplete>
      <div className="flex mt-2 w-full flex-wrap">
        {selectedItems.map((item) => (
          <Chip
            key={item.name}
            className="mr-2 mt-2"
            color={"primary"}
            endContent={
              <X
                className="mr-1 cursor-pointer"
                size={14}
                onClick={() => handleDeleteSelection(item)}
              />
            }
            isDisabled={isDisabled}
          >
            {item.name}
          </Chip>
        ))}
      </div>
    </div>
  );
};

export default MultiselectSearch;
