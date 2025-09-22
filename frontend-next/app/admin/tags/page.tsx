"use client";

// /components/tags/tags-display-admin.tsx
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Tooltip, useDisclosure } from "@heroui/react";
import React, { useCallback, useMemo, useState } from "react";
import { Input } from "@heroui/input";
import { SortDescriptor } from "@react-types/shared";
import { Trash } from "lucide-react";

import LoadingOverlay from "@/components/common/loading-overlay";
import { ITagPersisted } from "@/types/tags.types";
import { AdminTableDisplay } from "@/components/table/admin-table-display";
import { usePagination } from "@/hooks/use-pagination";
import PaginationControl from "@/components/table/pagination-control";
import ConfirmActionModal from "@/components/buttons/confirm-action-modal";
import {
  showErrorToastWithTimeout,
  showSuccessToastWithTimeout,
} from "@/utils/toast";
import { getErrorMessage } from "@/utils/error";
import { useDeleteTag, useTags } from "@/services/tags/useTags";

export default function TagsPage() {
  const intl = useIntl();
  const { data: tags, isLoading, isError, error } = useTags();

  if (isError) {
    return (
      <div className="w-full flex justify-center">
        <p>{error?.message}</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      <LoadingOverlay
        isLoading={isLoading}
        label={intl.formatMessage({
          id: "admin.tags.page.loading",
          defaultMessage: "Loading tags...",
        })}
      >
        <TagsDisplayAdmin tagsList={tags || []} />
      </LoadingOverlay>
    </div>
  );
}

const TagsDisplayAdmin = ({ tagsList }: { tagsList: ITagPersisted[] }) => {
  const intl = useIntl();
  const itemsPerPage = 10;

  const deleteTagMutation = useDeleteTag();
  const [selectedTagId, setSelectedTagId] = useState<ITagPersisted["id"]>("");
  const { isOpen: isOpenDelete, onOpenChange: onOpenDeleteChanged } =
    useDisclosure();
  const [filterText, setFilterText] = useState("");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "value",
    direction: "ascending",
  });

  const filteredTags = useMemo(() => {
    let filtered = [...tagsList];

    if (filterText) {
      const lowerFilter = filterText.toLowerCase();

      filtered = filtered.filter((tag) =>
        tag.value.toLowerCase().includes(lowerFilter),
      );
    }

    return filtered;
  }, [tagsList, filterText]);

  const sortedTags = useMemo(() => {
    return [...filteredTags].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof ITagPersisted] as any;
      const second = b[sortDescriptor.column as keyof ITagPersisted] as any;
      let cmp = first < second ? -1 : 1;

      if (typeof first === "string" && typeof second === "string") {
        cmp = first.localeCompare(second);
      }

      if (sortDescriptor.direction === "descending") {
        cmp *= -1;
      }

      return cmp;
    });
  }, [filteredTags, sortDescriptor]);

  const { currentList, currentPage, totalPages, setCurrentPage } =
    usePagination(sortedTags, itemsPerPage);

  const handleDeleteTag = useCallback((tagId: ITagPersisted["id"]) => {
    setSelectedTagId(tagId);
    onOpenDeleteChanged();
  }, []); // Removed 'deleteTag' from dependencies as it's not used here

  const columns = [
    {
      key: "value",
      label: intl.formatMessage({
        id: "tags.display-admin.value",
        defaultMessage: "Value",
      }),
      allowsSorting: true,
    },
    {
      key: "isUnique",
      label: intl.formatMessage({
        id: "tags.display-admin.isUnique",
        defaultMessage: "Is Unique?",
      }),
      allowsSorting: true,
    },
    {
      key: "expiresAfterMinutes",
      label: intl.formatMessage({
        id: "tags.display-admin.expires",
        defaultMessage: "Expires After (Minutes)",
      }),
      allowsSorting: true,
    },
    {
      key: "actions",
      label: intl.formatMessage({
        id: "tags.display-admin.actions",
        defaultMessage: "Actions",
      }),
    },
  ];

  const renderCell = useCallback(
    (item: ITagPersisted, columnKey: React.Key) => {
      const cellValue = item[columnKey as keyof ITagPersisted];

      switch (columnKey) {
        case "isUnique":
          return cellValue ? "Yes" : "No";
        case "expiresAfterMinutes":
          return cellValue === 0 ? "Never" : cellValue;
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip color="danger" content="Delete tag">
                <Button
                  isIconOnly
                  aria-label="Delete tag"
                  color="danger"
                  variant="light"
                  onPress={() => handleDeleteTag(item.id)}
                >
                  <Trash />
                </Button>
              </Tooltip>
            </div>
          );
        default:
          return cellValue as any;
      }
    },
    [handleDeleteTag],
  );

  const topContent = useMemo(() => {
    return (
      <div className="flex justify-between items-center">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Search by value..."
          value={filterText}
          onClear={() => setFilterText("")}
          onValueChange={setFilterText}
        />
      </div>
    );
  }, [filterText]);

  const bottomContent = useMemo(() => {
    return (
      <PaginationControl
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    );
  }, [currentPage, setCurrentPage, totalPages]);

  const handleConfirmTagDeleted = () => {
    deleteTagMutation.mutate(selectedTagId, {
      onSuccess: () => {
        showSuccessToastWithTimeout(
          intl.formatMessage({
            id: "tags.id.page.delete.success",
            defaultMessage: "Tag has been deleted successfully.",
          }),
        );
        onOpenDeleteChanged();
      },
      onError: (error) => {
        showErrorToastWithTimeout(getErrorMessage(error));
      },
    });
  };

  const confirmDelete = (
    <ConfirmActionModal
      handleOnConfirm={handleConfirmTagDeleted}
      isConfirmActionDisabled={deleteTagMutation.isPending}
      isOpen={isOpenDelete}
      prompt={intl.formatMessage({
        id: "tags.id.page.delete.prompt",
        defaultMessage:
          "Are you sure you want to delete this tag? This action cannot be undone.",
      })}
      title={intl.formatMessage({
        id: "tags.id.page.delete.title",
        defaultMessage: "Delete Tag",
      })}
      onOpenChange={onOpenDeleteChanged}
    />
  );

  return (
    <div className="w-full h-[85vh] flex flex-col justify-top p-3 border space-y-5">
      <div className="w-full flex justify-center">
        <h1 className="text-2xl">
          <FormattedMessage defaultMessage="Manage Tags" id="tags.title" />
        </h1>
      </div>
      <div className="w-full h-full flex flex-col justify-between space-y-3">
        <AdminTableDisplay
          columns={columns}
          renderCell={renderCell}
          rows={currentList}
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          onSortChange={setSortDescriptor}
        />
        {bottomContent}
      </div>
      {confirmDelete}
    </div>
  );
};
