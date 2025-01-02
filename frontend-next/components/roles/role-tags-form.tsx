import { FormattedMessage, useIntl } from "react-intl";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { useState } from "react";
import { uuidv4 } from "@firebase/util";

import { IRole } from "@/types/roles.types";
import { ITag } from "@/types/tags.types";

const RoleTagEntry = ({
  tag,
  isBeingEdited,
  index,
  handleTagChanged,
  handleTagRemoved,
  isInvalidTag,
}: {
  tag: ITag;
  isBeingEdited: boolean;
  index: number;
  handleTagChanged: (index: number, tag: ITag) => void;
  handleTagRemoved: (index: number) => void;
  isInvalidTag: (tag: ITag) => boolean;
}) => {
  const intl = useIntl();

  return (
    <div key={tag.id} className="w-full flex flex-row space-x-3 items-baseline">
      <Input
        isRequired
        className="w-full"
        errorMessage={intl.formatMessage({
          defaultMessage: "Tag name cannot be empty",
          id: "role.display.tag.name.error",
        })}
        isDisabled={!isBeingEdited}
        isInvalid={isInvalidTag(tag)}
        label={intl.formatMessage({
          defaultMessage: "Tag's Name",
          id: "role.display.tag.name",
        })}
        placeholder={intl.formatMessage({
          defaultMessage: "Insert tag name...",
          id: "role.display.tag.name.placeholder",
        })}
        size="sm"
        value={tag.value}
        variant="underlined"
        onChange={(e) => {
          handleTagChanged(index, {
            id: tag.id,
            value: e.target.value,
          });
        }}
      />
      {isBeingEdited && (
        <Button
          className="w-1/4"
          color="danger"
          size="sm"
          onPress={() => {
            handleTagRemoved(index);
          }}
        >
          <FormattedMessage defaultMessage="Remove" id="role.display.remove" />
        </Button>
      )}
    </div>
  );
};

const RoleTagsForm = ({
  role,
  setRole,
  isBeingEdited,
}: {
  role: IRole;
  setRole: (role: IRole) => void;
  isBeingEdited: boolean;
}) => {
  const mapAllTags = () => {
    return role.tags.map((tag) => ({ tagId: tag.id, touched: false }));
  };

  const [touched, setTouched] = useState({
    tags: mapAllTags(),
  });

  const handleTagChanged = (tagIndex: number, newTag: ITag) => {
    const updatedTags = [...role.tags];

    updatedTags[tagIndex] = newTag;

    setRole({
      ...role,
      tags: updatedTags,
    });
    setTouched({
      ...touched,
      tags: touched.tags.map((tag) =>
        tag.tagId === newTag.id ? { ...tag, touched: true } : tag,
      ),
    });
  };

  const handleTagRemoved = (tagIndex: number) => {
    setRole({
      ...role,
      tags: role.tags.filter((_, index) => index !== tagIndex),
    });
    setTouched({
      ...touched,
      tags: touched.tags.filter((_, index) => index !== tagIndex),
    });
  };

  const handleAddTag = () => {
    const newTag: ITag = { id: uuidv4(), value: "" };
    const updatedTags: ITag[] = [...role.tags, newTag];

    setRole({
      ...role,
      tags: updatedTags,
    });
    setTouched({
      ...touched,
      tags: touched.tags.concat({ tagId: newTag.id, touched: false }),
    });
  };

  const isInvalidTag = (tag: ITag) => {
    const touchedTag = touched.tags.find((t) => t.tagId === tag.id);

    if (touchedTag && !touchedTag.touched) {
      return false;
    }

    return tag.value === "" || tag.value === undefined || tag.value === null;
  };

  const tagListElement =
    role.tags.length === 0 ? (
      <div className="w-full h-1/5 text-xl flex justify-center items-center">
        <p>
          <FormattedMessage defaultMessage="No tags" id="role.display.noTags" />
        </p>
      </div>
    ) : (
      <div className="w-full flex flex-col">
        {role.tags.map((tag, index) => (
          <RoleTagEntry
            key={index}
            handleTagChanged={handleTagChanged}
            handleTagRemoved={handleTagRemoved}
            index={index}
            isBeingEdited={isBeingEdited}
            isInvalidTag={isInvalidTag}
            tag={tag}
          />
        ))}
      </div>
    );

  return (
    <div className="flex flex-col space-y-3">
      {tagListElement}
      {isBeingEdited && (
        <div className="w-full flex justify-center">
          <Button
            color="success"
            isDisabled={role.tags[role.tags?.length - 1]?.value === ""}
            size="md"
            onPress={handleAddTag}
          >
            <FormattedMessage
              defaultMessage="Add tag"
              id="role.display.addTag"
            />
          </Button>
        </div>
      )}
    </div>
  );
};

export default RoleTagsForm;
