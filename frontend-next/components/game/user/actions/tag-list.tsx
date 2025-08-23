import { ITag } from "@/types/tags.types";

const TagList = ({
  tags,
  type,
}: {
  tags: ITag[];
  type: "applied" | "removed";
}) => {
  if (tags.length === 0) return null;

  const isApplied = type === "applied";
  const bgColor = isApplied
    ? "bg-green-100/60 dark:bg-green-900/40"
    : "bg-red-100/60 dark:bg-red-900/40";
  const textColor = isApplied
    ? "text-green-800 dark:text-green-300"
    : "text-red-800 dark:text-red-300";

  return (
    <>
      {tags.map((tag) => (
        <span
          key={tag.id}
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${bgColor} ${textColor}`}
        >
          {isApplied ? "+" : "-"} {tag.value}
        </span>
      ))}
    </>
  );
};

export default TagList;
