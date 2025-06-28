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
  sortDescriptor,
  onSortChange,
}: {
  columns: Column[];
  rows: any[];
  onRowClick: (row: any) => void;
  topContent?: React.ReactNode;
  sortDescriptor: SortDescriptor | null;
  onSortChange: (descriptor: SortDescriptor) => void;
}) => {
  const intl = useIntl();

  return (
    <Table
      isStriped
      aria-label={intl.formatMessage({
        id: "table.admin-table-display.admin.table",
        defaultMessage: "Admin Table",
      })}
      sortDescriptor={sortDescriptor ?? undefined}
      topContent={topContent}
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
            onClick={() => onRowClick(row)}
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
