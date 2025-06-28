import { FormattedMessage } from "react-intl";
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
  FieldPath,
  useFieldArray,
  useWatch,
} from "react-hook-form";

import { IAction, IScenario } from "@/types/scenario.types";
import InputTagsWithTable from "@/components/input-tags-with-table";
import ConfirmActionModal from "@/components/buttons/confirm-action-modal";

type TActionListBasePath = `actions` | `items.${number}.actions`;

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

  const createName = <T extends FieldPath<IAction>>(
    fieldName: T,
  ): `${TActionListBasePath}.${number}.${T}` => {
    return `${basePath}.${actionIndex}.${fieldName}`;
  };

  return (
    <>
      <ModalBody>
        <div className="w-full flex flex-col space-y-3 border-1 p-3">
          <Controller
            control={control}
            name={createName("name")}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                className="w-1/2"
                errorMessage={fieldState.error?.message}
                isDisabled={!isBeingEdited}
                isInvalid={!!fieldState.error}
                label="Action name"
                variant="underlined"
              />
            )}
            rules={{ required: "Action name is required" }}
          />
          <Controller
            control={control}
            name={createName("description")}
            render={({ field }) => (
              <Textarea
                {...field}
                isDisabled={!isBeingEdited}
                label="Action description"
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
                isDisabled={!isBeingEdited}
                label="Message on success"
                variant="underlined"
              />
            )}
          />
          <Controller
            control={control}
            name={createName("messageOnFailure")}
            render={({ field }) => (
              <Textarea
                {...field}
                isDisabled={!isBeingEdited}
                label="Message on failure"
                variant="underlined"
              />
            )}
          />
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-2">
            <Controller
              control={control}
              name={createName("requiredTagsToDisplay")}
              render={({ field }) => (
                <InputTagsWithTable
                  addedTags={field.value || []}
                  inputLabel="Required tags to display"
                  isDisabled={!isBeingEdited}
                  setAddedTags={field.onChange}
                />
              )}
            />
            <Controller
              control={control}
              name={createName("requiredTagsToSucceed")}
              render={({ field }) => (
                <InputTagsWithTable
                  addedTags={field.value || []}
                  inputLabel="Required tags to succeed"
                  isDisabled={!isBeingEdited}
                  setAddedTags={field.onChange}
                />
              )}
            />
            <Controller
              control={control}
              name={createName("tagsToApplyOnSuccess")}
              render={({ field }) => (
                <InputTagsWithTable
                  addedTags={field.value || []}
                  inputLabel="Tags to apply on success"
                  isDisabled={!isBeingEdited}
                  setAddedTags={field.onChange}
                />
              )}
            />
            <Controller
              control={control}
              name={createName("tagsToApplyOnFailure")}
              render={({ field }) => (
                <InputTagsWithTable
                  addedTags={field.value || []}
                  inputLabel="Tags to apply on failure"
                  isDisabled={!isBeingEdited}
                  setAddedTags={field.onChange}
                />
              )}
            />
            <Controller
              control={control}
              name={createName("tagsToRemoveOnSuccess")}
              render={({ field }) => (
                <InputTagsWithTable
                  addedTags={field.value || []}
                  inputLabel="Tags to remove on success"
                  isDisabled={!isBeingEdited}
                  setAddedTags={field.onChange}
                />
              )}
            />
            <Controller
              control={control}
              name={createName("tagsToRemoveOnFailure")}
              render={({ field }) => (
                <InputTagsWithTable
                  addedTags={field.value || []}
                  inputLabel="Tags to remove on failure"
                  isDisabled={!isBeingEdited}
                  setAddedTags={field.onChange}
                />
              )}
            />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="space-x-3">
          {isBeingEdited ? (
            <>
              <Button color="danger" variant="bordered" onPress={handleCancel}>
                Cancel
              </Button>
              <Button color="success" variant="solid" onPress={handleSave}>
                Save
              </Button>
            </>
          ) : (
            <Button color="danger" variant="bordered" onPress={onClose}>
              Close
            </Button>
          )}
        </div>
      </ModalFooter>
      <ConfirmActionModal
        handleOnConfirm={handleConfirmCancel}
        isOpen={isCancelOpen}
        prompt="Are you sure you want to close? Your changes will be kept but not saved until the entire scenario is saved."
        title="Close Action Editor"
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
    <div className="w-full flex flex-row justify-between items-baseline border-1 p-3">
      <Input
        isDisabled
        label="Name"
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
            Remove
          </Button>
        )}
        <Button
          color="primary"
          size="sm"
          onPress={() => onActionDetailsPressed(actionIndex)}
        >
          Details
        </Button>
      </div>
      <ConfirmActionModal
        handleOnConfirm={() => handleRemove(actionIndex)}
        isOpen={isRemoveOpen}
        prompt={`Are you sure you want to remove the action "${actionName}"?`}
        title="Remove action"
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
            Add action
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
            Action Details
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
