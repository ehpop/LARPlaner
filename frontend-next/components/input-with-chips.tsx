"use client";

import { Chip, Input } from "@nextui-org/react";
import { X } from "lucide-react";
import { Button } from "@nextui-org/button";
import { useState } from "react";
import { uuidv4 } from "@firebase/util";
import { FormattedMessage, useIntl } from "react-intl";

import { ITag } from "@/types/tags.types";
import ConfirmActionModal from "@/components/buttons/confirm-action-modal";

interface MultiselectSearchProps {
  inputLabel: string;
  isDisabled?: boolean;
  addedTags: ITag[];
  setAddedTags: (items: ITag[]) => void;
  description?: string;
  placeholder?: string;
}

const InputWithChips = ({
  isDisabled = false,
  inputLabel,
  addedTags,
  setAddedTags,
  description,
  placeholder,
}: MultiselectSearchProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isOpenConfirmClearAll, setIsOpenConfirmClearAll] = useState(false);

  const intl = useIntl();

  const handleDeleteSelection = (deletedTag: ITag) => {
    setAddedTags(addedTags.filter((tag) => tag.id !== deletedTag.id));
  };

  const handleConfirmClearAll = () => {
    setIsOpenConfirmClearAll(false);
    setAddedTags([]);
  };

  const confirmClearAll = (
    <ConfirmActionModal
      handleOnConfirm={handleConfirmClearAll}
      isOpen={isOpenConfirmClearAll}
      prompt={intl.formatMessage({
        defaultMessage:
          "Are you sure you want to clear all tags in this section?",
        id: "input-with-chips.clearAllTagsPrompt",
      })}
      title={intl.formatMessage({
        defaultMessage: "Clear all tags",
        id: "input-with-chips.clearAllTags",
      })}
      onOpenChange={setIsOpenConfirmClearAll}
    />
  );

  return (
    <>
      <div className="w-full flex flex-row space-x-1 items-baseline">
        <Input
          className="w-3/4"
          description={description}
          isDisabled={isDisabled}
          label={inputLabel}
          placeholder={placeholder}
          value={inputValue}
          variant="underlined"
          onChange={(e) => setInputValue(e.target.value)}
        />
        {!isDisabled && (
          <>
            <Button
              className="w-1/4"
              color="danger"
              isDisabled={addedTags.length === 0}
              size="sm"
              onPress={() => setIsOpenConfirmClearAll(true)}
            >
              <FormattedMessage
                defaultMessage="Clear all"
                id="input-with-chips.clearAll"
              />
            </Button>
            <Button
              className="w-1/4"
              color="success"
              isDisabled={inputValue === ""}
              size="sm"
              onPress={() => {
                setAddedTags(
                  addedTags.concat({
                    id: uuidv4(),
                    value: inputValue,
                  }),
                );
                setInputValue("");
              }}
            >
              <FormattedMessage
                defaultMessage="Add"
                id="input-with-chips.add"
              />
            </Button>
          </>
        )}
      </div>
      <div className="flex mt-2 w-full flex-wrap">
        {addedTags.map((tag) => (
          <Chip
            key={tag.id}
            className="mr-2 mt-2"
            color={"primary"}
            endContent={
              <X
                className="mr-1 cursor-pointer"
                size={14}
                onClick={() => handleDeleteSelection(tag)}
              />
            }
            isDisabled={isDisabled}
          >
            {tag.value}
          </Chip>
        ))}
      </div>
      {confirmClearAll}
    </>
  );
};

export default InputWithChips;
