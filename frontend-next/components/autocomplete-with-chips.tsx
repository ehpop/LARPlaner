"use client";

import { useState } from "react";
import { Autocomplete, AutocompleteItem, Chip } from "@nextui-org/react";
import { Check, X } from "lucide-react";

const MultiselectSearch = ({ array }: { array: string[] }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelect = (item: string) => {
    if (!selectedItems.includes(item)) {
      setSelectedItems([...selectedItems, item]);
    } else {
      setSelectedItems(selectedItems.filter((selection) => selection !== item));
    }
  };

  const handleDeleteSelection = (item: string) => {
    setSelectedItems(selectedItems.filter((selection) => selection !== item));
  };

  return (
    <div>
      <Autocomplete className="w-full" selectedKey={""} variant="underlined">
        {array.map((item, index) => (
          <AutocompleteItem
            key={index}
            endContent={
              selectedItems.includes(item) && (
                <Check className="mr-2 text-green-500" size={16} />
              )
            }
            value={item}
            onClick={() => handleSelect(item)}
          >
            {item}
          </AutocompleteItem>
        ))}
      </Autocomplete>
      <div className="flex mt-2 w-full flex-wrap">
        {selectedItems.map((item) => (
          <Chip
            key={item}
            className="mr-2 mt-2"
            color={"primary"}
            endContent={
              <X
                className="mr-1 cursor-pointer"
                size={14}
                onClick={() => handleDeleteSelection(item)}
              />
            }
          >
            {item}
          </Chip>
        ))}
      </div>
    </div>
  );
};

export default MultiselectSearch;
