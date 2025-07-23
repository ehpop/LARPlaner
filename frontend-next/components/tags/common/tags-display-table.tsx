"use client";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { ReactNode, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Key } from "@react-types/shared";

import ConfirmActionModal from "@/components/buttons/confirm-action-modal";

interface Column {
  key: string;
  label: ReactNode;
}

interface TagsDisplayTableProps<T> {
  items: T[];
  columns: Column[];
  itemToKey: (item: T) => Key;
  renderCell: (item: T, columnKey: Key) => ReactNode;
  onClearAll: () => void;
  isDisabled?: boolean;
  disabledKeys?: Iterable<Key>;
}

const TagsDisplayTable = <T,>({
  items,
  columns,
  itemToKey,
  renderCell,
  onClearAll,
  isDisabled,
  disabledKeys,
}: TagsDisplayTableProps<T>) => {
  const intl = useIntl();
  const [isOpenConfirmClearAll, setIsOpenConfirmClearAll] = useState(false);

  const handleConfirmClearAll = () => {
    onClearAll();
    setIsOpenConfirmClearAll(false);
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-medium font-semibold">
          <FormattedMessage
            defaultMessage="Added Tags"
            id="components.tags.tags-dispaly-table.addedTagsTitle"
          />
        </h3>
        <Button
          color="danger"
          isDisabled={items.length === 0 || isDisabled}
          size="sm"
          variant="bordered"
          onPress={() => setIsOpenConfirmClearAll(true)}
        >
          <FormattedMessage
            defaultMessage="Clear all"
            id="components.tags.tags-dispaly-table.clearAll"
          />
        </Button>
      </div>
      <Table isStriped aria-label="Tags Table" disabledKeys={disabledKeys}>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={intl.formatMessage({
            defaultMessage: "No tags added",
            id: "components.tags.tags-dispaly-table.noTagsAdded",
          })}
          items={items}
        >
          {items.map((item) => (
            <TableRow key={itemToKey(item)}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ConfirmActionModal
        handleOnConfirm={handleConfirmClearAll}
        isOpen={isOpenConfirmClearAll}
        prompt={intl.formatMessage({
          id: "components.tags.tags-dispaly-table.confirmAction",
          defaultMessage:
            "Are you sure you want to clear all tags in this section?",
        })}
        title={intl.formatMessage({
          id: "components.tags.tags-dispaly-table.clearAllTags",
          defaultMessage: "Clear all tags",
        })}
        onOpenChange={setIsOpenConfirmClearAll}
      />
    </div>
  );
};

export default TagsDisplayTable;
