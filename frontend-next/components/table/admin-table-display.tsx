import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useIntl } from "react-intl";
import { SortDescriptor } from "@react-types/shared";
import { ReactNode } from "react";

type Column = {
  key: string;
  label: string;
  allowsSorting?: boolean;
};

export const AdminTableDisplay = ({
  columns,
  rows,
  onRowClick,
  topContent,
  bottomContent,
  sortDescriptor,
  onSortChange,
  isCompact = false,
  classNames = {
    wrapper: "max-h-[60vh] min-h-[60vh]",
  },
}: {
  columns: Column[];
  rows: any[];
  onRowClick?: (row: any) => void;
  topContent?: ReactNode;
  bottomContent?: ReactNode;
  sortDescriptor: SortDescriptor | null;
  onSortChange: (descriptor: SortDescriptor) => void;
  isCompact?: boolean;
  classNames?: { wrapper: string };
}) => {
  const intl = useIntl();

  return (
    <Table
      isHeaderSticky
      isStriped
      aria-label={intl.formatMessage({
        id: "table.admin-table-display.admin.table",
        defaultMessage: "Admin Table",
      })}
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={classNames}
      isCompact={isCompact}
      sortDescriptor={sortDescriptor ?? undefined}
      topContent={topContent}
      topContentPlacement="outside"
      onSortChange={onSortChange}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.key}
            allowsSorting={column.allowsSorting}
            className="text-md"
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={intl.formatMessage({
          defaultMessage: "No data to display",
          id: "admin.table.display.noData",
        })}
      >
        {rows.map((row) => (
          <TableRow
            key={row.id}
            className="cursor-pointer hover:dark:bg-stone-700 hover:bg-stone-300 hover:shadow-md transition-all"
            onClick={() => {
              if (onRowClick !== undefined) {
                onRowClick(row);
              }
            }}
          >
            {(columnKey) => (
              <TableCell>{row[columnKey as keyof typeof row]}</TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
