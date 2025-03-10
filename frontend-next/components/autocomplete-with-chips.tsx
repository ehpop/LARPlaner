"use client";

import { Autocomplete, AutocompleteItem, Chip } from "@heroui/react";
import { Check, X } from "lucide-react";

import { ITag } from "@/types/tags.types";

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
    if (!selectedItems.map((i) => i.id).includes(item.id)) {
      setSelectedItems([...selectedItems, item]);
    } else {
      setSelectedItems(
        selectedItems.filter((selection) => selection.id !== item.id),
      );
    }
  };

  const handleDeleteSelection = (item: ITag) => {
    setSelectedItems(
      selectedItems.filter((selection) => selection.id !== item.id),
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
        {allItems.map((item) => (
          <AutocompleteItem
            key={item.id}
            endContent={
              selectedItems.includes(item) && (
                <Check className="mr-2 text-green-500" size={16} />
              )
            }
            value={item.value}
            onPress={() => handleSelect(item)}
          >
            {item.value}
          </AutocompleteItem>
        ))}
      </Autocomplete>
      <div className="flex mt-2 w-full flex-wrap">
        {selectedItems.map((item) => (
          <Chip
            key={item.value}
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
            {item.value}
          </Chip>
        ))}
      </div>
    </div>
  );
};

export default MultiselectSearch;
