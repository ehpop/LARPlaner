import { useEffect, useState } from "react"; // 1. Import useEffect
import { FormattedMessage, useIntl } from "react-intl";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

import gameService from "@/services/game.service";
import {
  showErrorToastWithTimeout,
  showSuccessToastWithTimeout,
} from "@/utils/toast";
import { IAppliedTag } from "@/types/tags.types";
import { IGameRoleState, IGameSession } from "@/types/game.types";
import InputAppliedTagsWithTable from "@/components/tags/input-applied-tags-with-table";

interface EditRoleTagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: (updatedGame: IGameSession) => void;
  role: IGameRoleState;
}

export const EditRoleTagsModal = ({
  isOpen,
  onClose,
  onSaveSuccess,
  role,
}: EditRoleTagsModalProps) => {
  const intl = useIntl();
  const [editingTags, setEditingTags] = useState<IAppliedTag[]>(
    role.appliedTags,
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      role.appliedTags.map((appliedTag) => appliedTag.tag);
    }
  }, [role, isOpen]);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const response = await gameService.updateGameSessionRoleState(role.id, {
        activeTags: editingTags.map((t) => t.tag.id),
      });

      if (response.success) {
        showSuccessToastWithTimeout(
          intl.formatMessage({
            defaultMessage: "Successfully updated characters tags",
            id: "admin.manage-characters.role.tags.updated.successfully",
          }),
        );
        onSaveSuccess(response.data);
      } else {
        showErrorToastWithTimeout(
          response.data ?? "Failed to update role tags.",
        );
      }
    } catch (err: any) {
      showErrorToastWithTimeout(err.message ?? "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      isDismissable={false}
      isOpen={isOpen}
      scrollBehavior="inside"
      size="4xl"
      onClose={handleClose}
    >
      <ModalContent>
        {(onCloseHandler) => (
          <>
            <ModalHeader>
              <FormattedMessage
                defaultMessage="Edit characters tags"
                id="game.manageCharacters.editTags.header"
                values={{ roleId: role.scenarioRoleId }}
              />
            </ModalHeader>
            <ModalBody>
              <InputAppliedTagsWithTable
                appliedTags={editingTags}
                setAppliedTags={setEditingTags}
                userRoleState={role}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                isDisabled={isSaving}
                variant="bordered"
                onPress={onCloseHandler}
              >
                Cancel
              </Button>
              <Button
                color="success"
                isLoading={isSaving}
                variant="solid"
                onPress={handleSave}
              >
                Save Changes
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
