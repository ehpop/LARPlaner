import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "@nextui-org/link";
import { useState } from "react";

import { IEvent } from "@/types/event.types";
import { getDateAndTime } from "@/utils/date-time";

const EventsAdminDisplay = ({
  list,
  title,
}: {
  list: IEvent[];
  title: string;
}) => {
  const intl = useIntl();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(list.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentList = list.slice(startIndex, endIndex);

  const getHowManyRolesAssigned = (event: IEvent) => {
    const allRoles = event.assignedRoles;
    const assignedRoles = allRoles.filter((role) => role.assignedEmail);

    return `${assignedRoles.length}/${allRoles.length}`;
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const paginationElement = (
    <div className="flex justify-between items-center mt-4">
      <Button
        color="default"
        isDisabled={currentPage === 1}
        onClick={handlePreviousPage}
      >
        <FormattedMessage defaultMessage="Previous" id="pagination.previous" />
      </Button>
      <p className="text-sm">
        <FormattedMessage
          defaultMessage="Page {currentPage} of {totalPages}"
          id="pagination.info"
          values={{ currentPage, totalPages }}
        />
      </p>
      <Button
        color="default"
        isDisabled={currentPage === totalPages}
        onPress={handleNextPage}
      >
        <FormattedMessage defaultMessage="Next" id="pagination.next" />
      </Button>
    </div>
  );

  const tableElement = (
    <Table isStriped aria-label="Tags Table">
      <TableHeader
        columns={[
          { key: "name", label: "Name" },
          { key: "description", label: "Description" },
          { key: "date", label: "Date" },
          { key: "status", label: "Status" },
          { key: "assignedRoles", label: "Assigned Roles" },
          { key: "actions", label: "Actions" },
        ]}
      >
        {(column) => (
          <TableColumn key={column.key} className="text-md">
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={intl.formatMessage({
          defaultMessage: "No events to display",
          id: "events.page.display.noEvents",
        })}
      >
        {currentList.map((event) => (
          <TableRow
            key={event.id}
            as={Link}
            className={
              "cursor-pointer hover:dark:bg-stone-700 hover:bg-stone-300 hover:shadow-md transition-all"
            }
            href={`/admin/events/${event.id}/${event.status}`}
          >
            <TableCell>{event.name}</TableCell>
            <TableCell>{event.description}</TableCell>
            <TableCell>{getDateAndTime(event.date.toDate())}</TableCell>
            <TableCell>{event.status}</TableCell>
            <TableCell>{getHowManyRolesAssigned(event)}</TableCell>
            <TableCell>
              <Button
                as={Link}
                color="default"
                href={`/admin/events/${event.id}`}
              >
                <FormattedMessage
                  defaultMessage="Edit"
                  id="events.page.display.edit"
                />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const addNewEventButton = (
    <div className="flex justify-end">
      <Button as={Link} color="success" href="/admin/events/new">
        <FormattedMessage
          defaultMessage="Add New Event"
          id="events.page.display.addNew"
        />
      </Button>
    </div>
  );

  return (
    <div className="w-full flex flex-col justify-center p-3 border-1 space-y-5">
      <div className="w-full flex justify-center">
        <h1 className="text-2xl">{title}</h1>
      </div>
      <div className="w-full flex flex-col space-y-3">
        {addNewEventButton}
        {tableElement}
        {paginationElement}
      </div>
    </div>
  );
};

export default EventsAdminDisplay;
