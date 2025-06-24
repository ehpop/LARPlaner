"use client";

import {
  Autocomplete,
  AutocompleteItem,
  Checkbox,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Button } from "@heroui/button";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useAsyncList } from "@react-stately/data";

import { ITag } from "@/types/tags.types";
import ConfirmActionModal from "@/components/buttons/confirm-action-modal";
import tagsService from "@/services/tags.service";
import { showErrorToastWithTimeout } from "@/utils/toast";

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

const emptyTag = {
  value: "",
  expiresAfterMinutes: 0,
  isUnique: false,
} as ITag;

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
  const [key, setKey] = useState<string | undefined>(undefined);
  const [tag, setTag] = useState<ITag>(emptyTag);
  const [isOpenConfirmClearAll, setIsOpenConfirmClearAll] = useState(false);

  const intl = useIntl();

  let list = useAsyncList<ITag>({
    async load({ signal, filterText }) {
      let res = await fetch(
        `http://localhost:8080/api/tags?search=${filterText}`,
        { signal },
      );
      let json = await res.json();

      console.log(`fetched ${json.length} items for search ${filterText}`);

      return {
        items: json,
      };
    },
  });

  const handleDeleteSelection = (deletedTagId: string) => {
    setAddedTags(addedTags.filter((tag) => tag.id !== deletedTagId));
  };

  const handleConfirmClearAll = () => {
    setIsOpenConfirmClearAll(false);
    setAddedTags([]);
  };

  const handleAddTag = () => {
    if (tag.id) {
      setAddedTags([...addedTags, tag]);
      setTag(emptyTag);

      return;
    }

    tagsService
      .saveAll([tag])
      .then((res) => {
        if (res.success) {
          setAddedTags([...addedTags, ...res.data]);
        } else {
          showErrorToastWithTimeout(res.data);
        }
      })
      .catch((err) => {
        showErrorToastWithTimeout(err.message);
      });

    setTag(emptyTag);
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
                  onPress={() => {
                    if (tag.id) handleDeleteSelection(tag.id);
                  }}
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
          <Autocomplete
            allowsCustomValue
            isRequired
            description={description}
            inputValue={list.filterText}
            isLoading={list.isLoading}
            items={list.items}
            label={inputLabel}
            placeholder={placeholder}
            selectedKey={key}
            value={tag.value}
            variant="underlined"
            onInputChange={(input) => {
              list.setFilterText(input);
              setTag({ ...tag, value: input });
            }}
            onSelectionChange={(key) => {
              if (!key) return;
              const tag = list.items.find((i) => i.id === key);

              if (tag) {
                setTag(tag);
              }

              setKey(undefined);
            }}
          >
            {(item) => (
              <AutocompleteItem key={item.id}>{item.value}</AutocompleteItem>
            )}
          </Autocomplete>
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
              isDisabled={tag.value === ""}
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
            value={tag.expiresAfterMinutes?.toString() || ""}
            variant="underlined"
            onChange={(e) =>
              setTag({ ...tag, expiresAfterMinutes: parseInt(e.target.value) })
            }
          />
          <Checkbox
            aria-label={intl.formatMessage({
              defaultMessage: "Unique",
              id: "input-with-chips.uniqueToggle",
            })}
            isDisabled={isDisabled}
            isSelected={tag.isUnique}
            onValueChange={() => {
              setTag({ ...tag, isUnique: !tag.isUnique });
            }}
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
