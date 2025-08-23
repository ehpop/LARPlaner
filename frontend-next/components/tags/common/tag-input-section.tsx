"use client";

import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  Input,
} from "@heroui/react";
import { Key } from "@react-types/shared";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import { ITag, ITagPersisted } from "@/types/tags.types";
import {
  showErrorToastWithTimeout,
  showSuccessToastWithTimeout,
} from "@/utils/toast";
import { TagsProvider, useTagsContext } from "@/providers/tags-provider";
import { useCreateAllTags } from "@/services/tags/useTags";
import { getErrorMessage } from "@/utils/error";

type INewTagForm = Omit<ITag, "id">;

const initialNewTagState: INewTagForm = {
  value: "",
  expiresAfterMinutes: undefined,
  isUnique: false,
};

interface TagInputSectionProps {
  onTagAdd: (tag: ITagPersisted) => void;
  disabledKeys: Set<string>;
  inputLabel: string;
  description?: string;
  placeholder?: string;
}

const TagInputSection = ({
  onTagAdd,
  disabledKeys,
  inputLabel,
  description,
  placeholder,
}: TagInputSectionProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<INewTagForm>({ defaultValues: initialNewTagState });

  const { allTags, isLoading, isError, error, refetchTags } = useTagsContext();

  const createAllTagsMutation = useCreateAllTags();
  const isSavingTag = createAllTagsMutation.isPending;

  const [selectedKey, setSelectedKey] = useState<Key | null>(null);
  const [tagsFilterText, setTagsFilterText] = useState<string>("");

  const filteredItems = useMemo(() => {
    if (!allTags) {
      return [];
    }

    if (!tagsFilterText) return allTags;

    return allTags.filter((tag) =>
      tag.value.toLowerCase().includes(tagsFilterText.toLowerCase()),
    );
  }, [allTags, tagsFilterText]);

  if (isError || allTags || error) {
    if (isError) {
      return (
        <div className="w-full flex justify-center">
          <p>{error?.message}</p>
        </div>
      );
    }
  }

  const addTag = (tag: ITagPersisted | undefined) => {
    if (!tag) {
      return;
    }

    onTagAdd(tag);
    setTagsFilterText("");
    setTimeout(() => setSelectedKey(null), 0);
    showSuccessToastWithTimeout(
      "Successfully added existing tag: " + tag.value,
    );
  };

  const handleAddExistingTag = (key: Key) => {
    setSelectedKey(key);
    const tagToAdd = allTags && allTags.find((tag) => tag.id === key);

    addTag(tagToAdd);
  };

  const handleCreateNewTag = async (data: INewTagForm) => {
    const payload = {
      ...data,
      expiresAfterMinutes: data.expiresAfterMinutes || 0,
    };

    createAllTagsMutation.mutate([payload], {
      onSuccess: (createdTags: ITagPersisted[]) => {
        if (createdTags.length === 0) {
          showErrorToastWithTimeout("No tags were created");
          reset();

          return;
        }
        const newTag = createdTags[0];

        addTag(newTag);
        refetchTags();
        reset();
        showSuccessToastWithTimeout(
          "Successfully added new tag: " + newTag.value,
        );
      },
      onError: (error) => {
        showErrorToastWithTimeout(getErrorMessage(error));
      },
    });
  };

  return (
    <TagsProvider>
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
            <AutocompleteItem key={item.id!}>{item.value}</AutocompleteItem>
          )}
        </Autocomplete>
      </div>

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
                label="Tag name"
                placeholder="Enter tag name"
                variant="underlined"
              />
            )}
            rules={{ required: "Tag name cannot be empty." }}
          />
          <div className="flex gap-4 items-end">
            <Controller
              control={control}
              name="expiresAfterMinutes"
              render={({ field }) => (
                <Input
                  {...field}
                  label="Expires in (min)"
                  min={0}
                  placeholder="e.g., 60"
                  type="number"
                  value={field.value?.toString() ?? ""}
                  variant="underlined"
                  onValueChange={(v) =>
                    field.onChange(v ? parseInt(v, 10) : undefined)
                  }
                />
              )}
            />
            <Controller
              control={control}
              name="isUnique"
              render={({ field }) => (
                <Checkbox
                  isSelected={field.value}
                  onValueChange={field.onChange}
                >
                  Unique
                </Checkbox>
              )}
            />
          </div>
          <Button
            className="self-start"
            color="primary"
            isDisabled={isSavingTag}
            type="submit"
            variant="bordered"
            onPress={() => handleSubmit(handleCreateNewTag)()}
          >
            Create and Add Tag
          </Button>
        </div>
      </div>
    </TagsProvider>
  );
};

export default TagInputSection;
