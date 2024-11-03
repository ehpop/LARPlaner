import {
  Button,
  Image,
  Input,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { FormattedMessage, useIntl } from "react-intl";
import React, { useState } from "react";
import { uuidv4 } from "@firebase/util";

import { emptyRole, exampleRole as exampleRole } from "@/data/mock-data";
import ConfirmActionModal from "@/components/buttons/confirm-action-modal";
import { ButtonPanel } from "@/components/buttons/button-pannel";
import { IRole, ITag } from "@/types";

export default function RoleForm({ roleId }: { roleId?: string }) {
  const intl = useIntl();

  const isNewRole = !roleId;
  const initialRole = isNewRole ? emptyRole : exampleRole;

  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [role, setRole] = useState(initialRole);
  const [imageUrl, setImageUrl] = useState(initialRole.imageUrl);
  const [tags, setTags] = useState(initialRole.tags);

  const mapAllTags = () => {
    return role.tags.map((tag) => ({ tagId: tag.key, touched: false }));
  };

  const [touched, setTouched] = useState({
    name: false,
    description: false,
    tags: mapAllTags(),
  });

  const handleTouched = (key: keyof typeof touched) => {
    if (touched[key]) {
      return;
    }
    setTouched({ ...touched, [key]: true });
  };

  const isInvalidProperty = (name: keyof typeof touched) => {
    if (!touched[name]) {
      return false;
    }

    return (
      role[name as keyof IRole] === undefined ||
      role[name as keyof IRole] === "" ||
      role[name as keyof IRole] === null
    );
  };

  const {
    onOpen: onOpenDelete,
    isOpen: isOpenDelete,
    onOpenChange: onOpenChangeDelete,
  } = useDisclosure();
  const {
    onOpen: onOpenCancel,
    isOpen: isOpenCancel,
    onOpenChange: onOpenChangeCancel,
  } = useDisclosure();

  const handleTagChanged = (tagIndex: number, newTag: ITag) => {
    const updatedTags = [...(tags || [])];

    updatedTags[tagIndex] = newTag;
    setTags(updatedTags);
    setTouched({
      ...touched,
      tags: touched.tags.map((tag) =>
        tag.tagId === newTag.key ? { ...tag, touched: true } : tag,
      ),
    });
  };

  const handleTagRemoved = (tagIndex: number, tagKey: string) => {
    setTags(tags.filter((_, index) => index !== tagIndex));
    setTouched({
      ...touched,
      tags: touched.tags.filter((tag) => tag.tagId !== tagKey),
    });
  };

  const handleAddTag = () => {
    if (tags[tags?.length - 1]?.name === "") {
      return;
    }
    const newTag = { key: uuidv4(), name: "" };

    setTags([...(tags || []), newTag]);
    setTouched({
      ...touched,
      tags: touched.tags.concat({ tagId: newTag.key, touched: false }),
    });
  };

  const isInvalidTag = (tag: ITag) => {
    const touchedTag = touched.tags.find((t) => t.tagId === tag.key);

    if (touchedTag && !touchedTag.touched) {
      return false;
    }

    return tag.name === "" || tag.name === undefined || tag.name === null;
  };

  const handleSave = () => {
    setRole({ ...role, tags: tags?.filter((tag) => tag.name !== "") });
    // Save role
  };

  const roleDescription = (
    <Textarea
      isRequired
      defaultValue={role.description}
      description={intl.formatMessage({
        id: "events.id.page.description.description",
        defaultMessage: "Base description of the character",
      })}
      errorMessage={intl.formatMessage({
        id: "role.display.description.error",
        defaultMessage: "Description cannot be empty",
      })}
      isDisabled={!(isBeingEdited || isNewRole)}
      isInvalid={isInvalidProperty("description")}
      label={intl.formatMessage({
        id: "events.id.page.description.label",
        defaultMessage: "Description",
      })}
      placeholder={intl.formatMessage({
        id: "role.display.description.placeholder",
        defaultMessage: "Insert role description...",
      })}
      size="lg"
      variant="underlined"
      onChange={(e) => {
        setRole({ ...role, description: e.target.value });
        handleTouched("description");
      }}
    />
  );
  const roleName = (
    <Input
      isRequired
      defaultValue={role.name}
      errorMessage={intl.formatMessage({
        id: "role.display.name.error",
        defaultMessage: "Role name cannot be empty",
      })}
      isDisabled={!(isBeingEdited || isNewRole)}
      isInvalid={isInvalidProperty("name")}
      label={intl.formatMessage({
        id: "role.display.name",
        defaultMessage: "Name",
      })}
      placeholder={intl.formatMessage({
        id: "role.display.name.placeholder",
        defaultMessage: "Insert role name...",
      })}
      size="lg"
      variant="underlined"
      onChange={(e) => {
        setRole({ ...role, name: e.target.value });
        handleTouched("name");
      }}
    />
  );

  const titleElement = (
    <div className="w-full flex justify-center">
      <p className="text-3xl">
        {isNewRole ? (
          <FormattedMessage defaultMessage="New Role" id="role.form.newRole" />
        ) : (
          <FormattedMessage
            defaultMessage='Role "{roleName}"'
            id="role.form.roleName"
            values={{ roleName: roleId }}
          />
        )}
      </p>
    </div>
  );

  const tagsElement = (
    <div className="w-full min-h-full border-1 p-3 space-y-3">
      <p className="text-xl font-bold">
        <FormattedMessage
          defaultMessage="Character's tags:"
          id="role.id.page.display.tags"
        />
      </p>
      {tags.length === 0 ? (
        <div className="w-full h-1/5 text-xl flex justify-center items-center">
          <p>
            <FormattedMessage
              defaultMessage="No tags"
              id="role.display.noTags"
            />
          </p>
        </div>
      ) : (
        tags.map((tag, index) => (
          <div
            key={tag.key}
            className="w-full flex flex-row space-x-3 items-baseline"
          >
            <Input
              isRequired
              className="w-full"
              defaultValue={tag.name}
              errorMessage={intl.formatMessage({
                defaultMessage: "Tag name cannot be empty",
                id: "role.display.tag.name.error",
              })}
              isDisabled={!(isBeingEdited || isNewRole)}
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
              variant="underlined"
              onChange={(e) => {
                handleTagChanged(index, {
                  key: tag.key,
                  name: e.target.value,
                });
              }}
            />
            {(isBeingEdited || isNewRole) && (
              <Button
                className="w-1/4"
                color="danger"
                size="sm"
                onClick={(_event) => {
                  handleTagRemoved(index, tag.key);
                }}
              >
                <FormattedMessage
                  defaultMessage="Remove"
                  id="role.display.remove"
                />
              </Button>
            )}
          </div>
        ))
      )}
      {(isBeingEdited || isNewRole) && (
        <div className="w-full flex justify-center">
          <Button color="success" size="md" onPress={handleAddTag}>
            <FormattedMessage
              defaultMessage="Add tag"
              id="role.display.addTag"
            />
          </Button>
        </div>
      )}
    </div>
  );

  const imageInput = (
    <div className="w-full flex sm:flex-row sm:space-x-3 sm:space-y-0 flex-col-reverse space-x-0 space-y-3  sm:items-center">
      <Textarea
        className="w-full sm:w-1/2"
        defaultValue={imageUrl}
        description={intl.formatMessage({
          id: "role.display.image.description",
          defaultMessage: "URL of the character's image",
        })}
        errorMessage={intl.formatMessage({
          id: "role.display.image.error",
          defaultMessage: "Invalid URL",
        })}
        isDisabled={!(isBeingEdited || isNewRole)}
        isInvalid={
          imageUrl !== "" && imageUrl.match("^(http|https)://") === null
        }
        label={intl.formatMessage({
          id: "role.display.image",
          defaultMessage: "Role image",
        })}
        size="lg"
        variant="underlined"
        onChange={(e) => {
          setRole({ ...role, imageUrl: e.target.value });
          setImageUrl(e.target.value);
        }}
      />
      <div className="w-full sm:w-1/2">
        {imageUrl.match("^(http|https)://") !== null && (
          <Image
            alt="Character's image"
            className="max-w-full"
            fallbackSrc="/images/role-fallback.jpg"
            src={imageUrl}
          />
        )}
      </div>
    </div>
  );
  const confirmDelete = (
    <ConfirmActionModal
      handleOnConfirm={() => {
        alert("Role will be deleted");
      }}
      isOpen={isOpenDelete}
      prompt={intl.formatMessage({
        id: "roles.id.page.delete",
        defaultMessage:
          "Are you sure you want to delete this role? Role will be deleted from all scenarios. This action will not be reversible.",
      })}
      title={intl.formatMessage({
        id: "roles.id.page.deleteTitle",
        defaultMessage: "Do you want to delete this role?",
      })}
      onOpenChange={onOpenChangeDelete}
    />
  );

  const confirmCancel = (
    <ConfirmActionModal
      handleOnConfirm={() => {
        setIsBeingEdited(false);
      }}
      isOpen={isOpenCancel}
      prompt={intl.formatMessage({
        id: "roles.id.page.cancelEdit",
        defaultMessage:
          "Are you sure you want to cancel your changes? This action will not be reversible.",
      })}
      title={intl.formatMessage({
        id: "roles.id.page.cancelEditTitle",
        defaultMessage: "Do you want to cancel added changes?",
      })}
      onOpenChange={onOpenChangeCancel}
    />
  );

  const actionButtons = (
    <div className="w-full flex justify-end">
      <ButtonPanel
        isBeingEdited={isBeingEdited}
        onCancelEditClicked={() => {
          onOpenCancel();
        }}
        onDeleteClicked={() => {
          onOpenDelete();
        }}
        onEditClicked={() => setIsBeingEdited(true)}
        onSaveClicked={() => {
          handleSave();
          setIsBeingEdited(false);
        }}
      />
      {confirmCancel}
      {confirmDelete}
    </div>
  );

  const saveButton = (
    <div className="w-full flex justify-end space-x-3">
      <Button color="success" size="lg" onPress={(_) => handleSave()}>
        <FormattedMessage defaultMessage="Save" id="role.display.save" />
      </Button>
    </div>
  );

  return (
    <div className="sm:w-4/5 w-full space-y-10 border-1 p-3">
      {titleElement}
      <div className="space-y-3">
        {roleName}
        {imageInput}
        {roleDescription}
        {tagsElement}
      </div>
      {isNewRole ? saveButton : actionButtons}
    </div>
  );
}
