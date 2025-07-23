"use client";

import { ReactNode, useMemo } from "react";
import { Key } from "@react-types/shared";

import { ITag } from "@/types/tags.types";
import TagInputSection from "@/components/tags/common/tag-input-section";
import TagsDisplayTable from "@/components/tags/common/tags-display-table";

interface Column {
  key: string;
  label: ReactNode;
}

interface TagsManagerProps<T> {
  items: T[];
  setItems: (items: T[]) => void;

  itemToTag: (item: T) => ITag;
  itemToKey: (item: T) => Key;
  createItemFromTag: (tag: ITag) => T;

  columns: Column[];
  renderCell: (item: T, columnKey: Key) => ReactNode;
  disabledRowKeys?: Iterable<Key>;

  inputLabel: string;
  description?: string;
  placeholder?: string;
  isDisabled?: boolean;
}

const TagsManager = <T,>({
  items,
  setItems,
  itemToTag,
  itemToKey,
  createItemFromTag,
  columns,
  renderCell,
  isDisabled,
  disabledRowKeys,
  ...inputProps
}: TagsManagerProps<T>) => {
  const handleTagAdd = (tag: ITag) => {
    const newItem = createItemFromTag(tag);

    setItems([...items, newItem]);
  };

  const handleClearAll = () => {
    setItems([]);
  };

  const disabledKeys = useMemo(
    () =>
      new Set(
        items.map((item) => itemToTag(item).id).filter(Boolean) as string[],
      ),
    [items, itemToTag],
  );

  return (
    <div>
      {!isDisabled && (
        <TagInputSection
          disabledKeys={disabledKeys}
          onTagAdd={handleTagAdd}
          {...inputProps}
        />
      )}
      <TagsDisplayTable
        columns={columns}
        disabledKeys={disabledRowKeys}
        isDisabled={isDisabled}
        itemToKey={itemToKey}
        items={items}
        renderCell={renderCell}
        onClearAll={handleClearAll}
      />
    </div>
  );
};

export default TagsManager;
