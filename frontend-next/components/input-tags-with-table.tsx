"use client";

import {
  Checkbox,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { useState } from "react";
import { uuidv4 } from "@firebase/util";
import { FormattedMessage, useIntl } from "react-intl";

import { ITag } from "@/types/tags.types";
import ConfirmActionModal from "@/components/buttons/confirm-action-modal";

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
  const [inputValue, setInputValue] = useState("");
  const [isUnique, setIsUnique] = useState(false);
  const [expiresAfterMinutes, setExpiresAfterMinutes] = useState<
    number | undefined
  >(undefined);
  const [isOpenConfirmClearAll, setIsOpenConfirmClearAll] = useState(false);

  const intl = useIntl();

  const handleDeleteSelection = (deletedTagId: string) => {
    setAddedTags(addedTags.filter((tag) => tag.id !== deletedTagId));
  };

  const handleConfirmClearAll = () => {
    setIsOpenConfirmClearAll(false);
    setAddedTags([]);
  };

  const handleAddTag = () => {
    setAddedTags(
      addedTags.concat({
        id: uuidv4(),
        value: inputValue,
        isUnique,
        expiresAfterMinutes,
      } as ITag),
    );
    setInputValue("");
    setIsUnique(false);
    setExpiresAfterMinutes(undefined);
  };

  const tableElement = (
    <div className="mt-4">
      <Table isStriped aria-label="Tags Table">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={intl.formatMessage({
            defaultMessage: "No tags added",
            id: "input-with-chips.noTagsAdded",
          })}
        >
          {addedTags.map((tag) => (
            <TableRow key={tag.id}>
              <TableCell>{tag.value}</TableCell>
              <TableCell>
                {tag.expiresAfterMinutes ? `${tag.expiresAfterMinutes}` : "-"}
              </TableCell>
              <TableCell>
                {tag.isUnique ? (
                  <FormattedMessage defaultMessage="Yes" id="common.yes" />
                ) : (
                  <FormattedMessage defaultMessage="No" id="common.no" />
                )}
              </TableCell>
              <TableCell>
                <Button
                  color="danger"
                  isDisabled={isDisabled}
                  size="sm"
                  onPress={() => handleDeleteSelection(tag.id)}
                >
                  <FormattedMessage
                    defaultMessage="Delete"
                    id="input-with-chips.delete"
                  />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
  const confirmClearAllModal = (
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
  const inputElement = (
    <>
      <div className="w-full flex flex-col space-y-1 border-1 p-3">
        <div className="w-full flex flex-row space-x-1 items-baseline">
          <Input
            isRequired
            description={description}
            isDisabled={isDisabled}
            label={inputLabel}
            placeholder={placeholder}
            value={inputValue}
            variant="underlined"
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className="flex flex-row space-x-1">
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
              onPress={handleAddTag}
            >
              <FormattedMessage
                defaultMessage="Add"
                id="input-with-chips.add"
              />
            </Button>
          </div>
        </div>
        <div className="w-full flex flex-row space-x-1">
          <Input
            description={intl.formatMessage({
              defaultMessage: "Tag will expire after this many minutes",
              id: "input-with-chips.expiresInDays",
            })}
            isDisabled={isDisabled}
            label={intl.formatMessage({
              defaultMessage: "Expires in (minutes)",
              id: "input-with-chips.expiresIn",
            })}
            min={1}
            placeholder={intl.formatMessage({
              defaultMessage: "Leave blank for no expiry",
              id: "input-with-chips.expiresInPlaceholder",
            })}
            type="number"
            value={expiresAfterMinutes?.toString() || ""}
            variant="underlined"
            onChange={(e) => setExpiresAfterMinutes(parseInt(e.target.value))}
          />
          <Checkbox
            aria-label={intl.formatMessage({
              defaultMessage: "Unique",
              id: "input-with-chips.uniqueToggle",
            })}
            isDisabled={isDisabled}
            isSelected={isUnique}
            onValueChange={setIsUnique}
          >
            <FormattedMessage
              defaultMessage="Unique"
              id="input-with-chips.uniqueToggle"
            />
          </Checkbox>
        </div>
      </div>
    </>
  );

  return (
    <>
      {!isDisabled && inputElement}
      {tableElement}
      {confirmClearAllModal}
    </>
  );
};

export default InputTagsWithTable;
