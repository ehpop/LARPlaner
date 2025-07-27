import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import React, { useState } from "react";
import { Button } from "@heroui/button";
import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import {
  Control,
  Controller,
  ControllerRenderProps,
  useFieldArray,
  useWatch,
} from "react-hook-form";

import { IAction, IScenario } from "@/types/scenario.types";
import InputTagsWithTable from "@/components/tags/input-tags-with-table";
import ConfirmActionModal from "@/components/buttons/confirm-action-modal";
import { ITag } from "@/types/tags.types";
import HidableSection from "@/components/common/hidable-section";

const messages = defineMessages({
  actionNameLabel: {
    id: "scenario.action-form.actionNameLabel",
    defaultMessage: "Action name",
  },
  actionNameRequired: {
    id: "scenario.action-form.actionNameRequired",
    defaultMessage: "Action name is required",
  },
  actionDescriptionLabel: {
    id: "scenario.action-form.actionDescriptionLabel",
    defaultMessage: "Action description",
  },
  messageOnSuccessLabel: {
    id: "scenario.action-form.messageOnSuccessLabel",
    defaultMessage: "Message on success",
  },
  messageOnFailureLabel: {
    id: "scenario.action-form.messageOnFailureLabel",
    defaultMessage: "Message on failure",
  },
  requiredTagsToDisplayLabel: {
    id: "scenario.action-form.requiredTagsToDisplayLabel",
    defaultMessage: "Required tags to display",
  },
  requiredTagsToSucceedLabel: {
    id: "scenario.action-form.requiredTagsToSucceedLabel",
    defaultMessage: "Required tags to succeed",
  },
  forbiddenTagsToDisplayLabel: {
    id: "scenario.action-form.forbiddenTagsToDisplayLabel",
    defaultMessage: "Forbidden tags to display",
  },
  forbiddenTagsToSucceedLabel: {
    id: "scenario.action-form.forbiddenTagsToSucceedLabel",
    defaultMessage: "Forbidden tags to succeed",
  },
  tagsToApplyOnSuccessLabel: {
    id: "scenario.action-form.tagsToApplyOnSuccessLabel",
    defaultMessage: "Tags to apply on success",
  },
  tagsToApplyOnFailureLabel: {
    id: "scenario.action-form.tagsToApplyOnFailureLabel",
    defaultMessage: "Tags to apply on failure",
  },
  tagsToRemoveOnSuccessLabel: {
    id: "scenario.action-form.tagsToRemoveOnSuccessLabel",
    defaultMessage: "Tags to remove on success",
  },
  tagsToRemoveOnFailureLabel: {
    id: "scenario.action-form.tagsToRemoveOnFailureLabel",
    defaultMessage: "Tags to remove on failure",
  },
  cancelButton: { id: "common.cancelButton", defaultMessage: "Cancel" },
  saveButton: { id: "common.saveButton", defaultMessage: "Save" },
  closeButton: { id: "common.closeButton", defaultMessage: "Close" },
  closeEditorPrompt: {
    id: "scenario.action-form.closeEditorPrompt",
    defaultMessage:
      "Are you sure you want to close? Your changes will be kept but not saved until the entire scenario is saved.",
  },
  closeEditorTitle: {
    id: "scenario.action-form.closeEditorTitle",
    defaultMessage: "Close Action Editor",
  },
  // ActionRow
  nameLabel: { id: "scenario.action-row.nameLabel", defaultMessage: "Name" },
  removeButton: { id: "common.removeButton", defaultMessage: "Remove" },
  detailsButton: { id: "common.detailsButton", defaultMessage: "Details" },
  removeActionPrompt: {
    id: "scenario.action-row.removeActionPrompt",
    defaultMessage:
      'Are you sure you want to remove the action "{actionName}"?',
  },
  removeActionTitle: {
    id: "scenario.action-row.removeActionTitle",
    defaultMessage: "Remove action",
  },
  // ActionsListForm
  addAction: {
    id: "scenario.actions-list.addAction",
    defaultMessage: "Add action",
  },
  actionDetailsTitle: {
    id: "scenario.actions-list.actionDetailsTitle",
    defaultMessage: "Action Details",
  },
});

type TActionListBasePath = `actions` | `items.${number}.actions`;

/**
 * Utility type to extract only the keys from IAction that correspond to ITag[] fields.
 * This creates a union of string literals: "requiredTagsToDisplay" | "requiredTagsToSucceed" | ...
 */
type ActionTagFieldName = NonNullable<
  {
    [K in keyof IAction]: IAction[K] extends ITag[] ? K : never;
  }[keyof IAction]
>;

/**
 * A precise FieldPath type for react-hook-form that only allows paths to the tag array fields
 * within an action, whether it's a top-level action or nested in an item.
 */
type ActionTagFieldPath =
  | `actions.${number}.${ActionTagFieldName}`
  | `items.${number}.actions.${number}.${ActionTagFieldName}`;

interface ActionTagInputGroupProps {
  field: ControllerRenderProps<IScenario, ActionTagFieldPath>;
  inputLabel: string;
  isBeingEdited: boolean;
}

const ActionTagInputGroup = ({
  field,
  inputLabel,
  isBeingEdited,
}: ActionTagInputGroupProps) => {
  return (
    <div className="border p-3">
      <HidableSection
        section={
          <InputTagsWithTable
            addedTags={field.value || []}
            inputLabel={inputLabel}
            isDisabled={!isBeingEdited}
            setAddedTags={field.onChange}
          />
        }
        titleElement={<h2 className="text-lg mb-2">{inputLabel}</h2>}
      />
    </div>
  );
};

const ActionForm = ({
  control,
  basePath,
  actionIndex,
  isBeingEdited,
  onClose,
}: {
  control: Control<IScenario>;
  basePath: TActionListBasePath;
  actionIndex: number;
  isBeingEdited: boolean;
  onClose: () => void;
}) => {
  const intl = useIntl();
  const {
    isOpen: isCancelOpen,
    onOpen: onOpenCancel,
    onOpenChange: onOpenChangeCancel,
  } = useDisclosure();

  const handleSave = () => onClose();
  const handleCancel = () => onOpenCancel();
  const handleConfirmCancel = () => {
    onClose();
    onOpenChangeCancel();
  };

  const createName = <T extends keyof IAction>(
    fieldName: T,
  ): `${TActionListBasePath}.${number}.${T}` => {
    return `${basePath}.${actionIndex}.${fieldName}`;
  };

  const tagFields: { name: ActionTagFieldName; label: string }[] = [
    {
      name: "requiredTagsToDisplay",
      label: intl.formatMessage(messages.requiredTagsToDisplayLabel),
    },
    {
      name: "requiredTagsToSucceed",
      label: intl.formatMessage(messages.requiredTagsToSucceedLabel),
    },
    {
      name: "forbiddenTagsToDisplay",
      label: intl.formatMessage(messages.forbiddenTagsToDisplayLabel),
    },
    {
      name: "forbiddenTagsToSucceed",
      label: intl.formatMessage(messages.forbiddenTagsToSucceedLabel),
    },
    {
      name: "tagsToApplyOnSuccess",
      label: intl.formatMessage(messages.tagsToApplyOnSuccessLabel),
    },
    {
      name: "tagsToApplyOnFailure",
      label: intl.formatMessage(messages.tagsToApplyOnFailureLabel),
    },
    {
      name: "tagsToRemoveOnSuccess",
      label: intl.formatMessage(messages.tagsToRemoveOnSuccessLabel),
    },
    {
      name: "tagsToRemoveOnFailure",
      label: intl.formatMessage(messages.tagsToRemoveOnFailureLabel),
    },
  ];

  return (
    <>
      <ModalBody>
        <div className="w-full flex flex-col space-y-3 border p-3">
          <Controller
            control={control}
            name={createName("name")}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                isRequired
                className="w-1/2"
                errorMessage={fieldState.error?.message}
                isDisabled={!isBeingEdited}
                isInvalid={!!fieldState.error}
                label={intl.formatMessage(messages.actionNameLabel)}
                variant="underlined"
              />
            )}
            rules={{
              required: intl.formatMessage(messages.actionNameRequired),
            }}
          />
          <Controller
            control={control}
            name={createName("description")}
            render={({ field }) => (
              <Textarea
                {...field}
                isRequired
                isDisabled={!isBeingEdited}
                label={intl.formatMessage(messages.actionDescriptionLabel)}
                variant="underlined"
              />
            )}
          />
          <Controller
            control={control}
            name={createName("messageOnSuccess")}
            render={({ field }) => (
              <Textarea
                {...field}
                isRequired
                isDisabled={!isBeingEdited}
                label={intl.formatMessage(messages.messageOnSuccessLabel)}
                variant="underlined"
              />
            )}
          />
          <Controller
            control={control}
            name={createName("messageOnFailure")}
            render={({ field }) => (
              <Textarea
                isRequired
                {...field}
                isDisabled={!isBeingEdited}
                label={intl.formatMessage(messages.messageOnFailureLabel)}
                variant="underlined"
              />
            )}
          />

          <div className="grid sm:grid-cols-2 grid-cols-1 gap-2">
            {tagFields.map((tagField) => (
              <Controller
                key={tagField.name}
                control={control}
                name={createName(tagField.name)}
                render={({ field }) => (
                  <ActionTagInputGroup
                    field={field}
                    inputLabel={tagField.label}
                    isBeingEdited={isBeingEdited}
                  />
                )}
              />
            ))}
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="space-x-3">
          {isBeingEdited ? (
            <>
              <Button color="danger" variant="bordered" onPress={handleCancel}>
                {intl.formatMessage(messages.cancelButton)}
              </Button>
              <Button color="success" variant="solid" onPress={handleSave}>
                {intl.formatMessage(messages.saveButton)}
              </Button>
            </>
          ) : (
            <Button color="danger" variant="bordered" onPress={onClose}>
              {intl.formatMessage(messages.closeButton)}
            </Button>
          )}
        </div>
      </ModalFooter>
      <ConfirmActionModal
        handleOnConfirm={handleConfirmCancel}
        isOpen={isCancelOpen}
        prompt={intl.formatMessage(messages.closeEditorPrompt)}
        title={intl.formatMessage(messages.closeEditorTitle)}
        onOpenChange={onOpenChangeCancel}
      />
    </>
  );
};

const ActionRow = ({
  control,
  basePath,
  actionIndex,
  handleRemove,
  onActionDetailsPressed,
  isBeingEdited,
}: {
  control: Control<IScenario>;
  basePath: TActionListBasePath;
  actionIndex: number;
  handleRemove: (index: number) => void;
  onActionDetailsPressed: (index: number) => void;
  isBeingEdited: boolean;
}) => {
  const intl = useIntl();
  const {
    isOpen: isRemoveOpen,
    onOpen: onOpenRemove,
    onOpenChange: onOpenChangeRemove,
  } = useDisclosure();

  const actionName = useWatch({
    control,
    name: `${basePath}.${actionIndex}.name`,
  });

  return (
    <div className="w-full flex flex-row justify-between items-baseline border p-3">
      <Input
        isDisabled
        isRequired
        className="w-1/2"
        label={intl.formatMessage(messages.nameLabel)}
        size="sm"
        value={actionName || ""}
        variant="underlined"
      />
      <div className="flex flex-row space-x-3">
        {isBeingEdited && (
          <Button
            color="danger"
            size="sm"
            variant="bordered"
            onPress={onOpenRemove}
          >
            {intl.formatMessage(messages.removeButton)}
          </Button>
        )}
        <Button
          color="primary"
          size="sm"
          onPress={() => onActionDetailsPressed(actionIndex)}
        >
          {intl.formatMessage(messages.detailsButton)}
        </Button>
      </div>
      <ConfirmActionModal
        handleOnConfirm={() => handleRemove(actionIndex)}
        isOpen={isRemoveOpen}
        prompt={intl.formatMessage(messages.removeActionPrompt, {
          actionName: actionName || "",
        })}
        title={intl.formatMessage(messages.removeActionTitle)}
        onOpenChange={onOpenChangeRemove}
      />
    </div>
  );
};

interface ActionsListFormProps {
  control: Control<IScenario>;
  basePath: TActionListBasePath;
  isBeingEdited: boolean;
}

function ActionsListForm({
  control,
  basePath,
  isBeingEdited,
}: ActionsListFormProps) {
  const intl = useIntl();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [editingActionIndex, setEditingActionIndex] = useState<number | null>(
    null,
  );

  const { fields, append, remove } = useFieldArray({
    control,
    name: basePath,
  });

  const handleAddAction = () => {
    append({
      name: "",
      description: "",
      messageOnSuccess: "",
      messageOnFailure: "",
      requiredTagsToDisplay: [],
      requiredTagsToSucceed: [],
      forbiddenTagsToDisplay: [],
      forbiddenTagsToSucceed: [],
      tagsToApplyOnSuccess: [],
      tagsToApplyOnFailure: [],
      tagsToRemoveOnSuccess: [],
      tagsToRemoveOnFailure: [],
    } as IAction);
  };

  const onActionDetailsPressed = (index: number) => {
    setEditingActionIndex(index);
    onOpen();
  };

  const closeModal = () => {
    setEditingActionIndex(null);
    onOpenChange();
  };

  return (
    <div className="w-full flex flex-col space-y-3">
      {fields.length > 0 ? (
        fields.map((field, index) => (
          <ActionRow
            key={field.id}
            actionIndex={index}
            basePath={basePath}
            control={control}
            handleRemove={remove}
            isBeingEdited={isBeingEdited}
            onActionDetailsPressed={onActionDetailsPressed}
          />
        ))
      ) : (
        <div className="w-full flex justify-center">
          <p>
            <FormattedMessage
              defaultMessage="No actions defined"
              id="scenario.item-actions-form.noActions"
            />
          </p>
        </div>
      )}

      {isBeingEdited && (
        <div className="w-full flex justify-center pt-3">
          <Button color="success" size="md" onPress={handleAddAction}>
            {intl.formatMessage(messages.addAction)}
          </Button>
        </div>
      )}

      <Modal
        isDismissable={false}
        isOpen={isOpen}
        placement="center"
        scrollBehavior="inside"
        size="full"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            {intl.formatMessage(messages.actionDetailsTitle)}
          </ModalHeader>
          {editingActionIndex !== null && (
            <ActionForm
              actionIndex={editingActionIndex}
              basePath={basePath}
              control={control}
              isBeingEdited={isBeingEdited}
              onClose={closeModal}
            />
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default ActionsListForm;
