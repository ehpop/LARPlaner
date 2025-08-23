import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Input, Textarea, useDisclosure } from "@heroui/react";
import {
  Controller,
  ControllerRenderProps,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { isEqual } from "lodash-es";

import { IAction, IScenario } from "@/types/scenario.types";
import InputTagsWithTable from "@/components/tags/input-tags-with-table";
import ConfirmActionModal from "@/components/buttons/confirm-action-modal";
import { ITag } from "@/types/tags.types";
import HidableSection from "@/components/common/hidable-section";
import { emptyAction } from "@/types/initial-types";

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
  actionDescriptionRequired: {
    id: "scenario.action-form.actionDescriptionRequired",
    defaultMessage: "Action description is required",
  },
  messageOnSuccessLabel: {
    id: "scenario.action-form.messageOnSuccessLabel",
    defaultMessage: "Message on success",
  },
  messageOnSuccessRequired: {
    id: "scenario.action-form.messageOnSuccessRequired",
    defaultMessage: "A message for success is required",
  },
  messageOnFailureLabel: {
    id: "scenario.action-form.messageOnFailureLabel",
    defaultMessage: "Message on failure",
  },
  messageOnFailureRequired: {
    id: "scenario.action-form.messageOnFailureRequired",
    defaultMessage: "A message for failure is required",
  },
  requiredTagsToDisplayLabel: {
    id: "scenario.action-form.requiredTagsToDisplayLabel",
    defaultMessage: "Required ✳️ tags to display ✨",
  },
  requiredTagsToSucceedLabel: {
    id: "scenario.action-form.requiredTagsToSucceedLabel",
    defaultMessage: "Required ✳️ tags to succeed ✅",
  },
  forbiddenTagsToDisplayLabel: {
    id: "scenario.action-form.forbiddenTagsToDisplayLabel",
    defaultMessage: "Forbidden ⛔ tags to display ✨",
  },
  forbiddenTagsToSucceedLabel: {
    id: "scenario.action-form.forbiddenTagsToSucceedLabel",
    defaultMessage: "Forbidden ⛔ tags to succeed ✅",
  },
  tagsToApplyOnSuccessLabel: {
    id: "scenario.action-form.tagsToApplyOnSuccessLabel",
    defaultMessage: "Tags to apply ➕ on success ✅",
  },
  tagsToApplyOnFailureLabel: {
    id: "scenario.action-form.tagsToApplyOnFailureLabel",
    defaultMessage: "Tags to apply ➕ on failure ❌",
  },
  tagsToRemoveOnSuccessLabel: {
    id: "scenario.action-form.tagsToRemoveOnSuccessLabel",
    defaultMessage: "Tags to remove ⛔ on success ✅",
  },
  tagsToRemoveOnFailureLabel: {
    id: "scenario.action-form.tagsToRemoveOnFailureLabel",
    defaultMessage: "Tags to remove ⛔ on failure ❌",
  },
  cancelButton: { id: "common.cancelButton", defaultMessage: "Cancel" },
  saveButton: { id: "common.saveButton", defaultMessage: "Save" },
  closeButton: { id: "common.closeButton", defaultMessage: "Close" },
  confirmButton: { id: "common.confirmButton", defaultMessage: "Confirm" },
  closeEditorPrompt: {
    id: "scenario.action-form.closeEditorPrompt",
    defaultMessage:
      "Are you sure you want to close? Your changes will be kept but not saved until the entire scenario is saved.",
  },
  closeEditorTitle: {
    id: "scenario.action-form.closeEditorTitle",
    defaultMessage: "Close Action Editor",
  },
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
type ActionTagFieldName = NonNullable<
  { [K in keyof IAction]: IAction[K] extends ITag[] ? K : never }[keyof IAction]
>;
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
const MemoizedActionTagInputGroup = React.memo(ActionTagInputGroup);

interface ActionRowProps {
  actionName: string;
  actionIndex: number;
  handleRemove: (index: number) => void;
  onActionDetailsPressed: (index: number) => void;
  isBeingEdited: boolean;
}

const ActionRow = ({
  actionName,
  actionIndex,
  handleRemove,
  onActionDetailsPressed,
  isBeingEdited,
}: ActionRowProps) => {
  const intl = useIntl();
  const {
    isOpen: isRemoveOpen,
    onOpen: onOpenRemove,
    onOpenChange: onOpenChangeRemove,
  } = useDisclosure();

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
const MemoizedActionRow = React.memo(ActionRow);

interface ConnectedActionRowProps {
  basePath: TActionListBasePath;
  actionIndex: number;
  handleRemove: (index: number) => void;
  onActionDetailsPressed: (index: number) => void;
  isBeingEdited: boolean;
}

const ConnectedActionRow = ({
  basePath,
  actionIndex,
  ...rest
}: ConnectedActionRowProps) => {
  const { control } = useFormContext();
  const actionName = useWatch({
    control,
    name: `${basePath}.${actionIndex}.name`,
    defaultValue: "",
  });

  return (
    <MemoizedActionRow
      actionIndex={actionIndex}
      actionName={actionName}
      {...rest}
    />
  );
};

interface ActionsListFormProps {
  basePath: TActionListBasePath;
  isBeingEdited: boolean;
}

function ActionsListForm({ basePath, isBeingEdited }: ActionsListFormProps) {
  const intl = useIntl();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [editingActionIndex, setEditingActionIndex] = useState<number | null>(
    null,
  );
  const [actionBeforeEdit, setActionBeforeEdit] = useState<IAction | null>(
    null,
  );
  const [isNew, setIsNew] = useState<boolean>(false);
  const [isFormDirty, setIsFormDirty] = useState(false);

  const { getValues, control, unregister, trigger } =
    useFormContext<IScenario>();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: basePath,
  });

  const watchedAction = useWatch({
    control,
    name: `${basePath}.${editingActionIndex}` as TActionListBasePath,
  });

  useEffect(() => {
    if (editingActionIndex === null || !watchedAction) {
      setIsFormDirty(false); // Not editing, so not dirty

      return;
    }

    let isDirty;

    if (isNew) {
      // For a new action, compare against the blank template
      isDirty = !isEqual(watchedAction, emptyAction);
    } else {
      // For an existing action, compare against the state when the modal was opened
      isDirty = !isEqual(watchedAction, actionBeforeEdit);
    }
    setIsFormDirty(isDirty);
  }, [watchedAction, actionBeforeEdit, isNew, editingActionIndex]);

  const resetLocalState = useCallback(() => {
    setEditingActionIndex(null);
    setActionBeforeEdit(null);
    setIsNew(false);
    setIsFormDirty(false);
  }, []);

  const handleAddAction = useCallback(() => {
    const newActionIndex = fields.length;

    append({ ...emptyAction }, { shouldFocus: false });
    setIsNew(true);
    setActionBeforeEdit(null); // No "before" state for new actions
    setEditingActionIndex(newActionIndex);
    setIsEditModalOpen(true);
  }, [append, fields.length]);

  const handleEditAction = useCallback(
    (index: number) => {
      // Important: Deep clone the object to prevent mutation issues
      const currentAction = JSON.parse(
        JSON.stringify(getValues(`${basePath}.${index}` as const)),
      );

      setActionBeforeEdit(currentAction);
      setIsNew(false);
      setEditingActionIndex(index);
      setIsEditModalOpen(true);
    },
    [getValues, basePath],
  );

  const handleSaveAndClose = useCallback(() => {
    setIsEditModalOpen(false);
    setTimeout(resetLocalState, 300);
  }, [resetLocalState]);

  const handleRequestCancel = useCallback(() => {
    if (isFormDirty) {
      setIsCancelConfirmOpen(true);
    } else {
      // If no changes, just close immediately without reverting
      handleSaveAndClose();
    }
  }, [isFormDirty, handleSaveAndClose]);

  const handleConfirmCancel = useCallback(() => {
    setIsCancelConfirmOpen(false);
    setIsEditModalOpen(false);
    if (editingActionIndex === null) return;
    if (isNew) {
      unregister(`${basePath}.${editingActionIndex}`);
      remove(editingActionIndex);
    } else if (actionBeforeEdit) {
      update(editingActionIndex, actionBeforeEdit);
    }
    resetLocalState();
  }, [
    editingActionIndex,
    isNew,
    actionBeforeEdit,
    unregister,
    remove,
    update,
    resetLocalState,
  ]);

  const createNameForEditingAction = useCallback(
    <T extends keyof IAction>(
      fieldName: T,
    ): `${TActionListBasePath}.${number}.${T}` => {
      return `${basePath}.${editingActionIndex!}.${fieldName}`;
    },
    [basePath, editingActionIndex],
  );

  const textFieldsToValidate: (keyof IAction)[] = [
    "name",
    "description",
    "messageOnSuccess",
    "messageOnFailure",
  ];

  const handleSaveInModal = useCallback(async () => {
    if (editingActionIndex === null) return;
    const fieldsToValidate = textFieldsToValidate.map((name) =>
      createNameForEditingAction(name),
    );
    const isValid = await trigger(fieldsToValidate);

    if (isValid) handleSaveAndClose();
  }, [
    editingActionIndex,
    trigger,
    createNameForEditingAction,
    handleSaveAndClose,
    textFieldsToValidate,
  ]);

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
    <div className="w-full flex flex-col space-y-3">
      {fields.length === 0 && (
        <div className="w-full flex justify-center pt-3">
          <FormattedMessage
            defaultMessage="No actions in scenario"
            id="scenario.action-form.noActionsMessage"
          />
        </div>
      )}
      {fields.map((field, index) => (
        <ConnectedActionRow
          key={field.id}
          actionIndex={index}
          basePath={basePath}
          handleRemove={remove}
          isBeingEdited={isBeingEdited}
          onActionDetailsPressed={handleEditAction}
        />
      ))}

      {isBeingEdited && (
        <div className="w-full flex justify-center pt-3">
          <Button color="success" size="md" onPress={handleAddAction}>
            {intl.formatMessage(messages.addAction)}
          </Button>
        </div>
      )}

      {/* Important note, this UI logic could be extracted to a Modal component from HeroUI,
          however, it was causing really nasty bugs with RHF state management.
          In the future this should be replaced, at this time I didn't find any
          other solution that just using divs that are controlled by a React state.
          This problem occurs when we use modal in modal inside <form>.
       */}
      {isEditModalOpen && (
        <div
          aria-modal="true"
          className="fixed w-full inset-0 z-50 flex items-center justify-center bg-white dark:bg-black "
          role="dialog"
        >
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full h-full sm:max-w-7xl sm:h-auto sm:max-h-[95vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-zinc-700">
              <h2 className="text-xl font-semibold">
                {intl.formatMessage(messages.actionDetailsTitle)}
              </h2>
            </div>
            {editingActionIndex !== null && (
              <div className="w-full p-4 flex-grow overflow-y-auto">
                <div className="w-full flex flex-col space-y-3 border dark:border-zinc-700 p-3">
                  <Controller
                    control={control}
                    name={createNameForEditingAction("name")}
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
                    name={createNameForEditingAction("description")}
                    render={({ field, fieldState }) => (
                      <Textarea
                        {...field}
                        isRequired
                        errorMessage={fieldState.error?.message}
                        isDisabled={!isBeingEdited}
                        isInvalid={!!fieldState.error}
                        label={intl.formatMessage(
                          messages.actionDescriptionLabel,
                        )}
                        value={field.value || ""}
                        variant="underlined"
                      />
                    )}
                    rules={{
                      required: intl.formatMessage(
                        messages.actionDescriptionRequired,
                      ),
                    }}
                  />
                  <Controller
                    control={control}
                    name={createNameForEditingAction("messageOnSuccess")}
                    render={({ field, fieldState }) => (
                      <Textarea
                        {...field}
                        isRequired
                        errorMessage={fieldState.error?.message}
                        isDisabled={!isBeingEdited}
                        isInvalid={!!fieldState.error}
                        label={intl.formatMessage(
                          messages.messageOnSuccessLabel,
                        )}
                        value={field.value || ""}
                        variant="underlined"
                      />
                    )}
                    rules={{
                      required: intl.formatMessage(
                        messages.messageOnSuccessRequired,
                      ),
                    }}
                  />
                  <Controller
                    control={control}
                    name={createNameForEditingAction("messageOnFailure")}
                    render={({ field, fieldState }) => (
                      <Textarea
                        isRequired
                        {...field}
                        errorMessage={fieldState.error?.message}
                        isDisabled={!isBeingEdited}
                        isInvalid={!!fieldState.error}
                        label={intl.formatMessage(
                          messages.messageOnFailureLabel,
                        )}
                        value={field.value || ""}
                        variant="underlined"
                      />
                    )}
                    rules={{
                      required: intl.formatMessage(
                        messages.messageOnFailureRequired,
                      ),
                    }}
                  />
                  <div className="grid sm:grid-cols-2 grid-cols-1 gap-2">
                    {tagFields.map((tagField) => (
                      <Controller
                        key={tagField.name}
                        control={control}
                        name={createNameForEditingAction(tagField.name)}
                        render={({ field }) => (
                          <MemoizedActionTagInputGroup
                            field={field}
                            inputLabel={tagField.label}
                            isBeingEdited={isBeingEdited}
                          />
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="p-4 border-t border-gray-200 dark:border-zinc-700 flex justify-end">
              <div className="space-x-3">
                {isBeingEdited ? (
                  <>
                    <Button
                      color="danger"
                      variant="bordered"
                      onPress={handleRequestCancel}
                    >
                      {intl.formatMessage(messages.cancelButton)}
                    </Button>
                    <Button
                      color="success"
                      isDisabled={!isFormDirty}
                      variant="solid"
                      onPress={handleSaveInModal}
                    >
                      {intl.formatMessage(messages.saveButton)}
                    </Button>
                  </>
                ) : (
                  <Button
                    color="danger"
                    variant="bordered"
                    onPress={handleSaveAndClose}
                  >
                    {intl.formatMessage(messages.closeButton)}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmActionModal
        handleOnConfirm={handleConfirmCancel}
        isOpen={isCancelConfirmOpen}
        prompt={intl.formatMessage(messages.closeEditorPrompt)}
        title={intl.formatMessage(messages.closeEditorTitle)}
        onOpenChange={setIsCancelConfirmOpen}
      />
    </div>
  );
}

export default ActionsListForm;
