"use client";

import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Key } from "@react-types/shared";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import ConfirmActionModal from "@/components/buttons/confirm-action-modal";
import { useTags } from "@/providers/tags-provider";
import tagsService from "@/services/tags.service";
import { ITag } from "@/types/tags.types";
import {
  showErrorToastWithTimeout,
  showSuccessToastWithTimeout,
} from "@/utils/toast";

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

const initialNewTagState: INewTagForm = {
  value: "",
  expiresAfterMinutes: undefined,
  isUnique: false,
};

interface InputWithTableProps {
  inputLabel: string;
  isDisabled?: boolean;
  addedTags: ITag[];
  setAddedTags: (items: ITag[]) => void;
  description?: string;
  placeholder?: string;
}

type INewTagForm = {
  value: string;
  expiresAfterMinutes?: number;
  isUnique: boolean;
};

const InputTagsWithTable = ({
  isDisabled,
  inputLabel,
  addedTags,
  setAddedTags,
  description,
  placeholder,
}: InputWithTableProps) => {
  const intl = useIntl();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<INewTagForm>({
    defaultValues: initialNewTagState,
  });

  const { allTags, isLoading, refetchTags } = useTags();

  const [isOpenConfirmClearAll, setIsOpenConfirmClearAll] = useState(false);
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);
  const [tagsFilterText, setTagsFilterText] = useState<string>("");

  const handleAddExistingTag = (key: Key) => {
    setSelectedKey(key);
    const tagToAdd = allTags.find((tag) => tag.id === key);

    if (tagToAdd && !addedTags.some((t) => t.id === tagToAdd.id)) {
      setAddedTags([...addedTags, tagToAdd]);
      setTagsFilterText("");
      setTimeout(() => setSelectedKey(null), 0);
      showSuccessToastWithTimeout(
        "Successfully added existing tag: " + tagToAdd.value,
      );
    }
  };

  const handleCreateNewTag = async (data: INewTagForm) => {
    const res = await tagsService.saveAll([
      { ...data, expiresAfterMinutes: data.expiresAfterMinutes || 0 },
    ]);

    if (res.success) {
      setAddedTags([...addedTags, ...res.data]);
      reset();
      showSuccessToastWithTimeout(
        "Successfully added new tag: " + res.data[res.data.length - 1].value,
      );
      refetchTags();
    } else {
      showErrorToastWithTimeout(res.data);
    }
  };

  const handleDeleteTag = (tagId: string) => {
    setAddedTags(addedTags.filter((tag) => tag.id !== tagId));
  };

  const handleConfirmClearAll = () => {
    setAddedTags([]);
    setIsOpenConfirmClearAll(false);
  };

  const filteredItems = useMemo(() => {
    if (!tagsFilterText) {
      return allTags;
    }

    return allTags.filter((tag) =>
      tag.value.toLowerCase().includes(tagsFilterText.toLowerCase()),
    );
  }, [allTags, tagsFilterText]);

  const disabledKeys = useMemo(() => {
    return new Set(
      addedTags
        .map((tag) => tag.id)
        .filter((id): id is string => id !== undefined),
    );
  }, [addedTags]);

  const addExistingTagElement = (
    <div className="p-3 border rounded-md">
      <h3 className="font-semibold mb-2">
        <FormattedMessage
          defaultMessage="Add an existing tag"
          id="input-with-chips.addExistingTag"
        />
      </h3>
      <Autocomplete
        description={description}
        disabledKeys={disabledKeys}
        inputValue={tagsFilterText}
        isLoading={isLoading}
        items={filteredItems}
        label={inputLabel}
        placeholder={placeholder}
        selectedKey={selectedKey}
        variant="underlined"
        onInputChange={setTagsFilterText}
        onSelectionChange={(key) => key && handleAddExistingTag(key)}
      >
        {(item) => (
          <AutocompleteItem key={item.id}>{item.value}</AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  );

  const createNewTagElement = (
    <div className="p-3 border rounded-md mt-4">
      <h3 className="font-semibold mb-2">
        <FormattedMessage
          defaultMessage="Or create a new tag"
          id="input-with-chips.createNewTag"
        />
      </h3>
      <div className="flex flex-col space-y-3">
        <Controller
          control={control}
          name="value"
          render={({ field }) => (
            <Input
              {...field}
              errorMessage={errors.value?.message}
              isInvalid={!!errors.value}
              label={intl.formatMessage({
                defaultMessage: "Tag name",
                id: "role.display.tag.name",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "Enter tag name",
                id: "role.display.tag.name.placeholder",
              })}
              variant="underlined"
              onValueChange={field.onChange}
            />
          )}
          rules={{
            required: intl.formatMessage({
              defaultMessage: "Tag name cannot be empty.",
              id: "role.display.tag.name.required",
            }),
          }}
        />
        <div className="flex gap-4 items-end">
          <Controller
            control={control}
            name="expiresAfterMinutes"
            render={({ field }) => (
              <Input
                {...field}
                label={intl.formatMessage({
                  defaultMessage: "Expires in (min)",
                  id: "input-with-chips.expiresIn",
                })}
                min={0}
                placeholder={intl.formatMessage({
                  defaultMessage: "Enter expires in (min)",
                  id: "input-with-chips.expiresInPlaceholder",
                })}
                type="number"
                value={field.value?.toString() ?? ""}
                variant="underlined"
                onValueChange={(val) =>
                  field.onChange(val ? parseInt(val, 10) : undefined)
                }
              />
            )}
          />
          <Controller
            control={control}
            name="isUnique"
            render={({ field }) => (
              <Checkbox isSelected={field.value} onValueChange={field.onChange}>
                <FormattedMessage
                  defaultMessage="Unique"
                  id="input-with-chips.uniqueToggle"
                />
              </Checkbox>
            )}
          />
        </div>
        <Button
          className="self-start"
          color="primary"
          type="button"
          variant="bordered"
          onPress={() => handleSubmit(handleCreateNewTag)()}
        >
          <FormattedMessage
            defaultMessage="Create and Add Tag"
            id="input-with-chips.createAndAdd"
          />
        </Button>
      </div>
    </div>
  );

  const addedTagsTableElement = (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">
          <FormattedMessage
            defaultMessage="Added Tags"
            id="input-with-chips.addedTagsTitle"
          />
        </h3>
        <Button
          color="danger"
          isDisabled={addedTags.length === 0 || isDisabled}
          size="sm"
          variant="bordered"
          onPress={() => setIsOpenConfirmClearAll(true)}
        >
          <FormattedMessage
            defaultMessage="Clear all"
            id="input-with-chips.clearAll"
          />
        </Button>
      </div>
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
          items={addedTags}
        >
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.value}</TableCell>
              <TableCell>{item.expiresAfterMinutes || "-"}</TableCell>
              <TableCell>
                {item.isUnique ? (
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
                  onPress={() => handleDeleteTag(item.id!)}
                >
                  <FormattedMessage
                    defaultMessage="Delete"
                    id="input-with-chips.delete"
                  />
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div>
      {!isDisabled && (
        <>
          {addExistingTagElement}
          {createNewTagElement}
        </>
      )}
      {addedTagsTableElement}
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
    </div>
  );
};

export default InputTagsWithTable;
