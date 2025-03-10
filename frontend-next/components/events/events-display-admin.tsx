import { Button } from "@heroui/button";
import { FormattedMessage } from "react-intl";
import { useRouter } from "next/navigation";

import { IEvent } from "@/types/event.types";
import { getDateAndTime } from "@/utils/date-time";
import { usePagination } from "@/hooks/use-pagination";
import { AdminTableDisplay } from "@/components/table/admin-table-display";
import PaginationControl from "@/components/table/pagination-control";

const EventsDisplayAdmin = ({ eventsList }: { eventsList: IEvent[] }) => {
  const itemsPerPage = 10;
  const router = useRouter();
  const { currentList, currentPage, totalPages, setCurrentPage } =
    usePagination(eventsList, itemsPerPage);

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
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "date", label: "Date" },
    { key: "status", label: "Status" },
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

  const addNewEventButton = (
    <div className="flex justify-end">
      <Button color="success" variant="bordered" onPress={handleAddNewEvent}>
        <FormattedMessage
          defaultMessage="Add New Event"
          id="events.page.display.addNew"
        />
      </Button>
    </div>
  );

  return (
    <div className="w-full h-[80vh] flex flex-col justify-top p-3 border-1 space-y-5">
      <div className="w-full flex justify-center">
        <h1 className="text-2xl">
          <FormattedMessage defaultMessage="Events" id="events.title" />
        </h1>
      </div>
      <div className="w-full h-full flex flex-col justify-between space-y-3">
        <div className="flex flex-col space-y-3">
          {addNewEventButton}
          <AdminTableDisplay
            columns={columns}
            rows={rows}
            onRowClick={handleRowClick}
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
