import { getLocalTimeZone, now } from "@internationalized/date";
import { Button } from "@heroui/react";
import { Key, useMemo } from "react";

import TagsManager from "@/components/tags/common/tags-manager";
import { IAppliedTag, ITag } from "@/types/tags.types";
import { IGameRoleState } from "@/types/game.types";
import { isTagExpired } from "@/utils/date-time";
import { useCurrentTime } from "@/hooks/common/use-current-time";

const InputAppliedTagsWithTable = ({
  userRoleState,
  appliedTags,
  setAppliedTags,
}: {
  userRoleState: IGameRoleState;
  appliedTags: IAppliedTag[];
  setAppliedTags: (tags: IAppliedTag[]) => void;
}) => {
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
        itemToKey={(appliedTag) => appliedTag.tag.id!} // Assuming IAppliedTag has a unique ID
        itemToTag={(appliedTag) => appliedTag.tag}
        items={appliedTags}
        placeholder="Search for a tag to apply..."
        renderCell={renderCell}
        setItems={setAppliedTags}
      />
    </>
  );
};

export default InputAppliedTagsWithTable;
