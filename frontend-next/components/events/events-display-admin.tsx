import { Button } from "@heroui/button";
import { FormattedMessage } from "react-intl";
import { useRouter } from "next/navigation";
import React, { useState, useMemo } from "react";
import { Input } from "@heroui/input";
import { SortDescriptor } from "@react-types/shared";

import { IEvent } from "@/types/event.types";
import { getDateAndTime } from "@/utils/date-time";
import { usePagination } from "@/hooks/use-pagination";
import { AdminTableDisplay } from "@/components/table/admin-table-display";
import PaginationControl from "@/components/table/pagination-control";

const EventsDisplayAdmin = ({ eventsList }: { eventsList: IEvent[] }) => {
  const itemsPerPage = 10;
  const router = useRouter();

  const [filterText, setFilterText] = useState("");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor | null>(
    null,
  );

  const filteredEvents = useMemo(() => {
    let filtered = [...eventsList];

    if (filterText) {
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(filterText.toLowerCase()) ||
          event.description.toLowerCase().includes(filterText.toLowerCase()) ||
          event.status.toLowerCase().includes(filterText.toLowerCase()),
      );
    }

    return filtered;
  }, [eventsList, filterText]);

  const sortedEvents = useMemo(() => {
    if (!sortDescriptor) {
      return filteredEvents;
    }

    return [...filteredEvents].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof IEvent] as any;
      const second = b[sortDescriptor.column as keyof IEvent] as any;
      let cmp =
        (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

      if (sortDescriptor.direction === "descending") {
        cmp *= -1;
      }

      return cmp;
    });
  }, [filteredEvents, sortDescriptor]);

  const { currentList, currentPage, totalPages, setCurrentPage } =
    usePagination(sortedEvents, itemsPerPage);

  const getHowManyRolesAssigned = (event: IEvent) => {
    const allRoles = event.assignedRoles;
    const assignedRoles = allRoles.filter((role) => role.assignedEmail);

    return `${assignedRoles.length}/${allRoles.length}`;
  };

  const handleRowClick = (event: IEvent) => {
    router.push(`/admin/events/${event.id}/${event.status}`);
  };

  const handleEditClick = (event: IEvent) => {
    router.push(`/admin/events/${event.id}`);
  };

  const handleAddNewEvent = () => {
    router.push("/admin/events/new");
  };

  const columns = [
    { key: "name", label: "Name", allowsSorting: true },
    { key: "description", label: "Description", allowsSorting: true },
    { key: "date", label: "Date", allowsSorting: true },
    { key: "status", label: "Status", allowsSorting: true },
    { key: "assignedRoles", label: "Assigned Roles" },
    { key: "actions", label: "Actions" },
  ];

  const rows = currentList.map((event: IEvent) => ({
    id: event.id,
    name: event.name,
    description: event.description,
    date: getDateAndTime(event.date.toDate()),
    status: event.status,
    assignedRoles: getHowManyRolesAssigned(event),
    actions: (
      <Button
        color="default"
        size="sm"
        variant="bordered"
        onPress={() => handleEditClick(event)}
      >
        <FormattedMessage defaultMessage="Edit" id="events.page.display.edit" />
      </Button>
    ),
  }));

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name, description, or status..."
            value={filterText}
            onClear={() => setFilterText("")}
            onValueChange={setFilterText}
          />
          <div className="flex gap-3">
            <Button
              color="success"
              variant="bordered"
              onPress={handleAddNewEvent}
            >
              <FormattedMessage
                defaultMessage="Add New Event"
                id="events.page.display.addNew"
              />
            </Button>
          </div>
        </div>
      </div>
    );
  }, [filterText, handleAddNewEvent]);

  return (
    <div className="w-full h-[80vh] flex flex-col justify-top p-3 border-1 space-y-5">
      <div className="w-full flex justify-center">
        <h1 className="text-2xl">
          <FormattedMessage defaultMessage="Events" id="events.title" />
        </h1>
      </div>
      <div className="w-full h-full flex flex-col justify-between space-y-3">
        <div className="flex flex-col space-y-3">
          <AdminTableDisplay
            columns={columns}
            rows={rows}
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            onRowClick={handleRowClick}
            onSortChange={setSortDescriptor}
          />
        </div>
        <PaginationControl
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default EventsDisplayAdmin;
