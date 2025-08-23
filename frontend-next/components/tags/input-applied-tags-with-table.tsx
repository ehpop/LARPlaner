import { getLocalTimeZone, now } from "@internationalized/date";
import { Button, useDisclosure } from "@heroui/react";
import { Key, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FormattedMessage, useIntl } from "react-intl";

import TagsManager from "@/components/tags/common/tags-manager";
import { IAppliedTag, ITagPersisted } from "@/types/tags.types";
import { IGameRoleStateSummary, IGameSession } from "@/types/game.types";
import { isTagExpired } from "@/utils/date-time";
import { useCurrentTime } from "@/hooks/common/use-current-time";
import { useStomp } from "@/providers/stomp-client-provider";
import ConfirmActionModal from "@/components/buttons/confirm-action-modal";
import { mapAppliedTag } from "@/types/zod/tag";

const InputAppliedTagsWithTable = ({
  userRoleState,
  appliedTags,
  setAppliedTags,
  gameId,
}: {
  userRoleState: IGameRoleStateSummary;
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
    setAppliedTags(receivedTags);
    onCloseUpdateTagsViewModal();
  };

  const columns = [
    {
      key: "value",
      label: intl.formatMessage({
        defaultMessage: "Value",
        id: "input-applied-tags-with-table.value",
      }),
    },
    {
      key: "userEmail",
      label: intl.formatMessage({
        defaultMessage: "Applied To",
        id: "input-applied-tags-with-table.applied-to",
      }),
    },
    {
      key: "appliedAt",
      label: intl.formatMessage({
        defaultMessage: "Applied At",
        id: "input-applied-tags-with-table.applied-at",
      }),
    },
    {
      key: "expiresAfterMinutes",
      label: intl.formatMessage({
        defaultMessage: "Expires after (min)",
        id: "input-applied-tags-with-table.expires-after",
      }),
    },
    {
      key: "actions",
      label: intl.formatMessage({
        defaultMessage: "Actions",
        id: "input-applied-tags-with-table.actions",
      }),
    },
  ];

  const renderCell = (item: IAppliedTag, columnKey: Key) => {
    switch (columnKey) {
      case "value":
        return item.tag.value;
      case "userEmail":
        return item.userEmail;
      case "appliedAt":
        if (item.id) {
          return intl.formatDate(item.appliedToUserAt.toDate(), {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            timeZone: getLocalTimeZone(),
          });
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
            <FormattedMessage
              defaultMessage="Delete"
              id="input-applied-tags-with-table.actions.delete"
            />
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
      .map((item) => item.id!);

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
        console.log("Received message: ", message.body);
        setReceivedTags(
          JSON.parse(message.body).map((tag: IAppliedTag) =>
            mapAppliedTag(tag),
          ),
        );
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
          <FormattedMessage
            defaultMessage="User tag state for: {formattedDate}"
            id="input-applied-tags-with-table.user-tag-state-for"
            values={{
              formattedDate: intl.formatDate(currentTime.toDate(), {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                timeZone: getLocalTimeZone(),
              }),
            }}
          />
        </p>
      </div>
      <TagsManager<IAppliedTag>
        columns={columns}
        createItemFromTag={(tag: ITagPersisted): IAppliedTag => ({
          tag,
          userID: userRoleState.assignedUserID,
          userEmail: userRoleState.assignedEmail,
          appliedToUserAt: now(getLocalTimeZone()),
        })}
        disabledRowKeys={disabledKeys}
        inputLabel={intl.formatMessage({
          defaultMessage: "Apply a tag to this user",
          id: "input-applied-tags-with-table.input-label",
        })}
        itemToKey={(appliedTag) => appliedTag.id!}
        itemToTag={(appliedTag) => appliedTag.tag}
        items={appliedTags}
        placeholder={intl.formatMessage({
          defaultMessage: "Enter a tag value",
          id: "input-applied-tags-with-table.placeholder",
        })}
        renderCell={renderCell}
        setItems={setAppliedTags}
      />
      <ConfirmActionModal
        handleOnConfirm={handleOnConfirmUpdateTagsViewModal}
        isOpen={isUpdateTagsViewModalOpen}
        prompt={intl.formatMessage({
          id: "input-applied-tags-with-table.user-performed-action.prompt",
          defaultMessage:
            "User performed action and his tags were modified. " +
            "Do you want to refresh your view? All your changes will be lost. " +
            "If you save your current changes, they will override the changes " +
            "made by the user action.",
        })}
        title={intl.formatMessage({
          id: "input-applied-tags-with-table.user-performed-action.title",
          defaultMessage: "User performed action and his tags are modified.",
        })}
        onOpenChange={onOpenUpdateTagsViewModalChange}
      />
    </>
  );
};

export default InputAppliedTagsWithTable;
