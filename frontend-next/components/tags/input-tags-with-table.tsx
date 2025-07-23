import { FormattedMessage } from "react-intl";
import { Button } from "@heroui/react";
import { Key } from "react";

import { ITag } from "@/types/tags.types";
import TagsManager from "@/components/tags/common/tags-manager";

const columns = [
  {
    key: "value",
    label: <FormattedMessage defaultMessage="Value" id="common.value" />,
  },
  {
    key: "expiresAfterMinutes",
    label: (
      <FormattedMessage
        defaultMessage="Expires after (min)"
        id="input-with-chips.expiresAfter"
      />
    ),
  },
  {
    key: "isUnique",
    label: (
      <FormattedMessage
        defaultMessage="Unique"
        id="input-with-chips.isUnique"
      />
    ),
  },
  {
    key: "actions",
    label: <FormattedMessage defaultMessage="Actions" id="common.actions" />,
  },
];

interface InputWithTableProps {
  inputLabel: string;
  isDisabled?: boolean;
  addedTags: ITag[];
  setAddedTags: (items: ITag[]) => void;
  description?: string;
  placeholder?: string;
}

const InputTagsWithTable = ({
  isDisabled,
  inputLabel,
  addedTags,
  setAddedTags,
  description,
  placeholder,
}: InputWithTableProps) => {
  const renderCell = (tag: ITag, columnKey: Key) => {
    switch (columnKey) {
      case "value":
        return tag.value;
      case "expiresAfterMinutes":
        return tag.expiresAfterMinutes || "-";
      case "isUnique":
        return tag.isUnique ? "Yes" : "No";
      case "actions":
        return (
          <Button
            color="danger"
            isDisabled={isDisabled}
            size="sm"
            onPress={() =>
              setAddedTags(addedTags.filter((t) => t.id !== tag.id))
            }
          >
            Delete
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <TagsManager<ITag>
      columns={columns}
      createItemFromTag={(tag) => tag}
      description={description}
      inputLabel={inputLabel}
      isDisabled={isDisabled}
      itemToKey={(tag) => tag.id!}
      itemToTag={(tag) => tag}
      items={addedTags}
      placeholder={placeholder}
      renderCell={renderCell}
      setItems={setAddedTags}
    />
  );
};

export default InputTagsWithTable;
