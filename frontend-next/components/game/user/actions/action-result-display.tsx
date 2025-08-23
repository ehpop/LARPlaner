import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

import { IGameActionLogSummary } from "@/types/game.types";
import TagList from "@/components/game/user/actions/tag-list";

const ActionResultDisplay = ({
  actionResult,
}: {
  actionResult: IGameActionLogSummary;
}) => {
  const hasTags =
    actionResult.appliedTags.length > 0 || actionResult.removedTags.length > 0;

  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4">
      {actionResult.success ? (
        <CheckCircleIcon className="h-12 w-12 text-green-500" />
      ) : (
        <XCircleIcon className="h-12 w-12 text-red-600" />
      )}
      <p className="text-zinc-800 dark:text-zinc-200">{actionResult.message}</p>
      {hasTags && (
        <div className="pt-2 w-full">
          <hr className="border-zinc-200 dark:border-zinc-800 mb-4" />
          <div className="flex flex-wrap justify-center gap-2">
            <TagList tags={actionResult.appliedTags} type="applied" />
            <TagList tags={actionResult.removedTags} type="removed" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionResultDisplay;
