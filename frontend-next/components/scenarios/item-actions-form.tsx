import { FormattedMessage, useIntl } from "react-intl";
import React, { useState } from "react";
import { Button } from "@nextui-org/button";
import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";

import { IScenarioAction } from "@/types/scenario.types";
import InputTagsWithTable from "@/components/input-tags-with-table";
import ConfirmActionModal from "@/components/buttons/confirm-action-modal";

export function ItemActionsForm({
  handleAddAction,
  handleActionChange,
  handleActionRemove,
  actions,
  isRoleBeingEdited,
}: {
  handleAddAction: () => void;
  handleActionChange: (index: number, newAction: IScenarioAction) => void;
  handleActionRemove: (index: number) => void;
  actions: IScenarioAction[];
  isRoleBeingEdited: boolean;
}) {
  const intl = useIntl();
  const [showActionForm, setShowActionForm] = useState(false);
  const [selectedAction, setSelectedAction] = useState<IScenarioAction | null>(
    null,
  );

  const onActionDetailsPressed = (actionId: string) => {
    setSelectedAction(actions.filter((action) => action.id === actionId)[0]);
    setShowActionForm(true);
  };

  const ActionRow = ({
    action,
    index,
    onActionDetailsPressed,
  }: {
    action: IScenarioAction;
    index: number;
    isBeingEdited: boolean;
    onActionDetailsPressed: (actionId: string) => void;
  }) => {
    const [isRemoveOpen, setIsRemoveOpen] = useState(false);

    const handleOnRemoveConfirmed = () => {
      handleActionRemove(index);
      setIsRemoveOpen(false);
    };

    return (
      <div className="w-full flex flex-row justify-between items-baseline border-1 p-3">
        <Input
          isDisabled
          isRequired
          className="w-1/2"
          errorMessage={intl.formatMessage({
            id: "scenarios.new.page.actionName.error",
            defaultMessage: "Name is required",
          })}
          label={intl.formatMessage({
            id: "scenarios.new.page.actionName",
            defaultMessage: "Name",
          })}
          placeholder={intl.formatMessage({
            id: "scenarios.new.page.actionNamePlaceholder",
            defaultMessage: "Name...",
          })}
          size="sm"
          type="text"
          value={action.name}
          variant="underlined"
        />
        <div className="flex flex-row space-x-3">
          {isRoleBeingEdited && (
            <Button
              color="danger"
              size="sm"
              variant="bordered"
              onPress={() => setIsRemoveOpen(true)}
            >
              <FormattedMessage
                defaultMessage={"Remove"}
                id={"scenarios.new.page.removeActionButton"}
              />
            </Button>
          )}
          <Button
            color="primary"
            size="sm"
            onClick={() => onActionDetailsPressed(action.id as string)}
          >
            <FormattedMessage
              defaultMessage={"Details"}
              id={"scenarios.new.page.actionDetailsButton"}
            />
          </Button>
        </div>
        <ConfirmActionModal
          handleOnConfirm={handleOnRemoveConfirmed}
          isOpen={isRemoveOpen}
          prompt={intl.formatMessage(
            {
              id: "scenarios.new.page.removeActionPrompt",
              defaultMessage: "Are you sure you want to remove this action?",
            },
            { actionName: action.name },
          )}
          title={intl.formatMessage({
            id: "scenarios.new.page.removeActionTitle",
            defaultMessage: "Remove action",
          })}
          onOpenChange={setIsRemoveOpen}
        />
      </div>
    );
  };

  const ModalForm = () => {
    return (
      <Modal
        isDismissable={false}
        isOpen={showActionForm}
        placement="center"
        scrollBehavior="inside"
        size="5xl"
        onOpenChange={setShowActionForm}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <FormattedMessage
                  defaultMessage={"Details of action: {actionName}"}
                  id={"scenarios.new.page.actionDetailsButton"}
                  values={{ actionName: selectedAction?.name as string }}
                />
              </ModalHeader>
              <ActionForm
                handleActionChange={handleActionChange}
                index={actions.findIndex(
                  (action) => action.id === selectedAction?.id,
                )}
                initialAction={selectedAction as IScenarioAction}
                isActionBeingEdited={isRoleBeingEdited}
                onClose={onClose}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    );
  };

  return (
    <div className="w-full flex flex-col space-y-3">
      {actions.length > 0 ? (
        actions.map((action, index) => (
          <ActionRow
            key={action.id}
            action={action}
            index={index}
            isBeingEdited={isRoleBeingEdited}
            onActionDetailsPressed={onActionDetailsPressed}
          />
        ))
      ) : (
        <div className="w-full p-5 flex justify-center">
          <p>
            <FormattedMessage
              defaultMessage={"No actions in item"}
              id={"scenarios.items.form.noActionsInItem"}
            />
          </p>
        </div>
      )}
      {isRoleBeingEdited && (
        <div className="w-full flex justify-center pt-3">
          <Button color="success" size="sm" onPress={() => handleAddAction()}>
            <FormattedMessage
              defaultMessage={"Add action"}
              id={"scenarios.new.page.addActionButton"}
            />
          </Button>
        </div>
      )}
      <ModalForm />
    </div>
  );
}

const ActionForm = ({
  initialAction,
  index,
  handleActionChange,
  isActionBeingEdited,
  onClose,
}: {
  initialAction: IScenarioAction;
  index: number;
  handleActionChange: (index: number, newAction: IScenarioAction) => void;
  isActionBeingEdited: boolean;
  onClose: () => void;
}) => {
  const intl = useIntl();
  const [action, setAction] = useState(initialAction);
  const [requiredTagsToSucceed, setRequiredTagsToSucceed] = useState(
    action.requiredTagsToSucceed,
  );
  const [requiredTagsToDisplay, setRequiredTagsToDisplay] = useState(
    action.requiredTagsToDisplay,
  );
  const [tagsToApplyOnSuccess, setTagsToApplyOnSuccess] = useState(
    action.tagsToApplyOnSuccess,
  );
  const [tagsToApplyOnFailure, setTagsToApplyOnFailure] = useState(
    action.tagsToApplyOnFailure,
  );
  const [tagsToRemoveOnSuccess, setTagsToRemoveOnSuccess] = useState(
    action.tagsToRemoveOnSuccess,
  );
  const [tagsToRemoveOnFailure, setTagsToRemoveOnFailure] = useState(
    action.tagsToRemoveOnSuccess,
  );

  const [isOpenCancel, setOpenCancel] = useState(false);

  const handleConfirmCancel = () => {
    setAction(initialAction);
    setOpenCancel(false);
    onClose();
  };

  const handleCancel = () => {
    setOpenCancel(true);
  };

  const handleSave = () => {
    handleActionChange(index, {
      ...action,
      requiredTagsToSucceed,
      requiredTagsToDisplay,
      tagsToApplyOnSuccess,
      tagsToApplyOnFailure,
      tagsToRemoveOnSuccess,
      tagsToRemoveOnFailure,
    });

    onClose();
  };

  const confirmCancel = (
    <ConfirmActionModal
      handleOnConfirm={handleConfirmCancel}
      isOpen={isOpenCancel}
      prompt={intl.formatMessage({
        id: "scenarios.id.page.cancelEdit",
        defaultMessage:
          "Are you sure you want to cancel your changes? This action will not be reversible.",
      })}
      title={intl.formatMessage({
        id: "scenarios.id.page.cancelEditTitle",
        defaultMessage: "Do you want to cancel added changes?",
      })}
      onOpenChange={setOpenCancel}
    />
  );

  const actionRequiredTagsForDisplay = (
    <div className="w-full flex flex-col border-1 p-3 space-y-3">
      <p>
        <FormattedMessage
          defaultMessage={"Required tags to display action:"}
          id={"scenarios.new.page.requiredTagsToDisplayAction"}
        />
      </p>
      <InputTagsWithTable
        addedTags={requiredTagsToDisplay}
        description={intl.formatMessage({
          defaultMessage: "Tag that will be required to display action",
          id: "scenarios.new.page.requiredTagsToDisplayActionDescription",
        })}
        inputLabel={intl.formatMessage({
          defaultMessage: "Tag value",
          id: "scenarios.new.page.input",
        })}
        isDisabled={!isActionBeingEdited}
        placeholder={intl.formatMessage({
          defaultMessage: "Insert tag name...",
          id: "role.display.tag.name.placeholder",
        })}
        setAddedTags={setRequiredTagsToDisplay}
      />
    </div>
  );

  const actionRequiredTagsToSucceed = (
    <div className="w-full flex flex-col border-1 p-3 space-y-3">
      <p>
        <FormattedMessage
          defaultMessage={"Required tags to succeed action:"}
          id={"scenarios.new.page.requiredTagsToSucceedAction"}
        />
      </p>
      <InputTagsWithTable
        addedTags={requiredTagsToSucceed}
        description={intl.formatMessage({
          defaultMessage: "Tag that will be required to succeed action",
          id: "scenarios.new.page.requiredTagsToSucceedActionDescription",
        })}
        inputLabel={intl.formatMessage({
          defaultMessage: "Tag value",
          id: "scenarios.new.page.input",
        })}
        isDisabled={!isActionBeingEdited}
        placeholder={intl.formatMessage({
          defaultMessage: "Insert tag name...",
          id: "role.display.tag.name.placeholder",
        })}
        setAddedTags={setRequiredTagsToSucceed}
      />
    </div>
  );

  const actionTagsToApplyOnSuccess = (
    <div className="w-full flex flex-col border-1 p-3 space-y-3">
      <p>
        <FormattedMessage
          defaultMessage={"Tags to apply on success:"}
          id={"scenarios.new.page.tagsToApplyOnSuccess"}
        />
      </p>
      <InputTagsWithTable
        addedTags={tagsToApplyOnSuccess}
        description={intl.formatMessage({
          defaultMessage:
            "Tag that will be applied on role when action succeeds",
          id: "scenarios.new.page.tagsToApplyOnSuccessDescription",
        })}
        inputLabel={intl.formatMessage({
          defaultMessage: "Tag value",
          id: "scenarios.new.page.input",
        })}
        isDisabled={!isActionBeingEdited}
        placeholder={intl.formatMessage({
          defaultMessage: "Insert tag name...",
          id: "role.display.tag.name.placeholder",
        })}
        setAddedTags={setTagsToApplyOnSuccess}
      />
    </div>
  );

  const actionTagsToApplyOnFailure = (
    <div className="w-full flex flex-col border-1 p-3 space-y-3">
      <p>
        <FormattedMessage
          defaultMessage={"Tags to apply on failure:"}
          id={"scenarios.new.page.tagsToApplyOnFailure"}
        />
      </p>
      <InputTagsWithTable
        addedTags={tagsToApplyOnFailure}
        description={intl.formatMessage({
          defaultMessage: "Tag that will be applied on role when action fails",
          id: "scenarios.new.page.tagsToApplyOnFailureDescription",
        })}
        inputLabel={intl.formatMessage({
          defaultMessage: "Tag value",
          id: "scenarios.new.page.input",
        })}
        isDisabled={!isActionBeingEdited}
        placeholder={intl.formatMessage({
          defaultMessage: "Insert tag name...",
          id: "role.display.tag.name.placeholder",
        })}
        setAddedTags={setTagsToApplyOnFailure}
      />
    </div>
  );

  const actionTagsToRemoveOnSuccess = (
    <div className="w-full flex flex-col border-1 p-3 space-y-3">
      <p>
        <FormattedMessage
          defaultMessage={"Tags to remove on success:"}
          id={"scenarios.new.page.tagsToRemoveOnSuccess"}
        />
      </p>
      <InputTagsWithTable
        addedTags={tagsToRemoveOnSuccess}
        description={intl.formatMessage({
          defaultMessage:
            "Tag that will be removed on role when action succeeds",
          id: "scenarios.new.page.tagsToRemoveOnSuccessDescription",
        })}
        inputLabel={intl.formatMessage({
          defaultMessage: "Tag value",
          id: "scenarios.new.page.input",
        })}
        isDisabled={!isActionBeingEdited}
        placeholder={intl.formatMessage({
          defaultMessage: "Insert tag name...",
          id: "role.display.tag.name.placeholder",
        })}
        setAddedTags={setTagsToRemoveOnSuccess}
      />
    </div>
  );

  const actionTagsToRemoveOnFailure = (
    <div className="w-full flex flex-col border-1 p-3 space-y-3">
      <p>
        <FormattedMessage
          defaultMessage={"Tags to remove on failure:"}
          id={"scenarios.new.page.tagsToRemoveOnFailure"}
        />
      </p>
      <InputTagsWithTable
        addedTags={tagsToRemoveOnFailure}
        description={intl.formatMessage({
          defaultMessage: "Tag that will be removed on role when action fails",
          id: "scenarios.new.page.tagsToRemoveOnFailureDescription",
        })}
        inputLabel={intl.formatMessage({
          defaultMessage: "Tag value",
          id: "scenarios.new.page.input",
        })}
        isDisabled={!isActionBeingEdited}
        placeholder={intl.formatMessage({
          defaultMessage: "Insert tag name...",
          id: "role.display.tag.name.placeholder",
        })}
        setAddedTags={setTagsToRemoveOnFailure}
      />
    </div>
  );

  const nameElement = (
    <Input
      className="w-1/2"
      isDisabled={!isActionBeingEdited}
      label={intl.formatMessage({
        defaultMessage: "Action name",
        id: "scenarios.new.page.actionName",
      })}
      placeholder={intl.formatMessage({
        defaultMessage: "Insert action name...",
        id: "scenarios.new.page.insertActionName",
      })}
      value={action.name}
      variant="underlined"
      onChange={(e) =>
        setAction({
          ...action,
          name: e.target.value,
        })
      }
    />
  );

  const descriptionElement = (
    <Textarea
      isDisabled={!isActionBeingEdited}
      label={intl.formatMessage({
        defaultMessage: "Action description",
        id: "scenarios.new.page.actionDescription",
      })}
      placeholder={intl.formatMessage({
        defaultMessage: "Insert action description...",
        id: "scenarios.new.page.insertActionDescription",
      })}
      value={action.description}
      variant="underlined"
      onChange={(e) =>
        setAction({
          ...action,
          description: e.target.value,
        })
      }
    />
  );

  const successMessageElement = (
    <Textarea
      isDisabled={!isActionBeingEdited}
      label={intl.formatMessage({
        defaultMessage: "Message on success",
        id: "scenarios.new.page.messageOnSuccess",
      })}
      placeholder={intl.formatMessage({
        defaultMessage: "Insert message on success...",
        id: "scenarios.new.page.insertMessageOnSuccess",
      })}
      value={action.messageOnSuccess}
      variant="underlined"
      onChange={(e) =>
        setAction({
          ...action,
          messageOnSuccess: e.target.value,
        })
      }
    />
  );

  const failureMessageElement = (
    <Textarea
      isDisabled={!isActionBeingEdited}
      label={intl.formatMessage({
        defaultMessage: "Message on failure",
        id: "scenarios.new.page.messageOnFailure",
      })}
      placeholder={intl.formatMessage({
        defaultMessage: "Insert message on failure...",
        id: "scenarios.new.page.insertMessageOnFailure",
      })}
      value={action.messageOnFailure}
      variant="underlined"
      onChange={(e) =>
        setAction({
          ...action,
          messageOnFailure: e.target.value,
        })
      }
    />
  );

  return (
    <>
      <ModalBody>
        <div className="w-full flex flex-col space-y-3 border-1 p-3">
          {nameElement}
          <div className="space-y-3">
            {descriptionElement}
            <div className="w-full border-1 p-3 flex flex-col space-y-3">
              <p>
                <FormattedMessage
                  defaultMessage={"Messages:"}
                  id={"scenarios.new.page.messages"}
                />
              </p>
              <div className="">
                {successMessageElement}
                {failureMessageElement}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {actionRequiredTagsForDisplay}
              {actionRequiredTagsToSucceed}
              {actionTagsToApplyOnSuccess}
              {actionTagsToApplyOnFailure}
              {actionTagsToRemoveOnSuccess}
              {actionTagsToRemoveOnFailure}
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="space-x-3">
          {isActionBeingEdited ? (
            <>
              <Button color="danger" variant="bordered" onPress={handleCancel}>
                <FormattedMessage
                  defaultMessage={"Cancel"}
                  id={"common.cancel"}
                />
              </Button>
              <Button color="success" variant="solid" onPress={handleSave}>
                <FormattedMessage defaultMessage={"Save"} id={"common.save"} />
              </Button>
            </>
          ) : (
            <Button color="danger" variant="bordered" onPress={() => onClose()}>
              <FormattedMessage defaultMessage={"Close"} id={"common.close"} />
            </Button>
          )}
        </div>
      </ModalFooter>
      {confirmCancel}
    </>
  );
};
