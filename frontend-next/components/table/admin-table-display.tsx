import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useIntl } from "react-intl";

export const AdminTableDisplay = ({
  columns,
  rows,
  onRowClick,
}: {
  columns: { key: string; label: string }[];
  rows: any[];
  onRowClick: (row: any) => void;
}) => {
  const intl = useIntl();

  return (
    <Table isStriped aria-label="Admin Table">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.key} className="text-md">
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
            {columns.map((column) => (
              <TableCell key={column.key}>{row[column.key]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
