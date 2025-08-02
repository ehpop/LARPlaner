import { getLocalTimeZone, now } from "@internationalized/date";
import { Button, useDisclosure } from "@heroui/react";
import { Key, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useIntl } from "react-intl";

import TagsManager from "@/components/tags/common/tags-manager";
import { IAppliedTag, ITag } from "@/types/tags.types";
import { IGameRoleState, IGameSession } from "@/types/game.types";
import { isTagExpired } from "@/utils/date-time";
import { useCurrentTime } from "@/hooks/common/use-current-time";
import { useStomp } from "@/providers/stomp-client-provider";
import ConfirmActionModal from "@/components/buttons/confirm-action-modal";

const InputAppliedTagsWithTable = ({
  userRoleState,
  appliedTags,
  setAppliedTags,
  gameId,
}: {
  userRoleState: IGameRoleState;
  appliedTags: IAppliedTag[];
  setAppliedTags: (tags: IAppliedTag[]) => void;
  gameId: IGameSession["id"];
}) => {
  const intl = useIntl();
  const [receivedTags, setReceivedTags] = useState<IAppliedTag[]>([]);
  const {
    isOpen: isUpdateTagsViewModalOpen,
    onOpen: onOpenUpdateTagsViewModal,
    onClose: onCloseUpdateTagsViewModal,
    onOpenChange: onOpenUpdateTagsViewModalChange,
  } = useDisclosure();

  const handleOnConfirmUpdateTagsViewModal = () => {
    console.log("Updating tags view modal...");
    setAppliedTags(receivedTags);
    onCloseUpdateTagsViewModal();
  };

  //TODO: INTL
  const columns = [
    { key: "value", label: "Tag Value" },
    { key: "userEmail", label: "Applied To" },
    { key: "appliedAt", label: "Applied At" },
    { key: "expiresAfterMinutes", label: "Expires after (min)" },
    { key: "actions", label: "Actions" },
  ];

  const renderCell = (item: IAppliedTag, columnKey: Key) => {
    switch (columnKey) {
      case "value":
        return item.tag.value;
      case "userEmail":
        return item.userEmail;
      case "appliedAt":
        if (item.id) {
          return item.appliedToUserAt.toString();
        }

        return "-";
      case "expiresAfterMinutes":
        return item.tag.expiresAfterMinutes;
      case "actions":
        return (
          <Button
            color="danger"
            size="sm"
            onPress={() =>
              setAppliedTags(appliedTags.filter((t) => t.id !== item.id))
            }
          >
            Remove
          </Button>
        );
      default:
        return null;
    }
  };

  const currentTime = useCurrentTime();

  const disabledKeys = useMemo(() => {
    const expiredTagKeys = appliedTags
      .filter((item) => isTagExpired(item, currentTime))
      .map((item) => item.tag.id!);

    return new Set(expiredTagKeys);
  }, [appliedTags, currentTime]);

  const { client: stompClient, isConnected } = useStomp();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!stompClient || !stompClient.active || !isConnected) {
      return;
    }

    const subscription = stompClient.subscribe(
      `/topic/game/${gameId}/action/byUserId/${userRoleState.assignedUserID}`,
      (message) => {
        console.log("Received message: ", JSON.parse(message.body));
        setReceivedTags(JSON.parse(message.body));
        onOpenUpdateTagsViewModal();
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [stompClient, isConnected, queryClient, gameId]);

  return (
    <>
      <div>
        <p className="text-medium text-center">
          {currentTime.toDate().toString()}
        </p>
      </div>
      <TagsManager<IAppliedTag>
        columns={columns}
        createItemFromTag={(tag: ITag): IAppliedTag => ({
          tag,
          userID: userRoleState.assignedUserID,
          userEmail: userRoleState.assignedEmail,
          appliedToUserAt: now(getLocalTimeZone()),
        })}
        disabledRowKeys={disabledKeys}
        inputLabel="Apply a tag to this user"
        itemToKey={(appliedTag) => appliedTag.id!}
        itemToTag={(appliedTag) => appliedTag.tag}
        items={appliedTags}
        placeholder="Search for a tag to apply..."
        renderCell={renderCell}
        setItems={setAppliedTags}
      />
      <ConfirmActionModal
        handleOnConfirm={handleOnConfirmUpdateTagsViewModal}
        isOpen={isUpdateTagsViewModalOpen}
        prompt={intl.formatMessage({
          id: "input-applied-tags-with-table.remove-tag-modal.title",
          defaultMessage:
            "User performed action and his tags were modified. Do you want to refresh your view? All your changes will be lost. If you save your current changes, they will override the changes made by the user action.",
        })}
        title={intl.formatMessage({
          id: "input-applied-tags-with-table.remove-tag-modal.title",
          defaultMessage: "User performed action and his tags are modified.",
        })}
        onOpenChange={onOpenUpdateTagsViewModalChange}
      />
    </>
  );
};

export default InputAppliedTagsWithTable;
