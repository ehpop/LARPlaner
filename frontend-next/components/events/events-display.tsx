import { Input } from "@nextui-org/react";
import { ChangeEvent, useEffect, useState } from "react";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";
import { FormattedMessage, useIntl } from "react-intl";

import { Event } from "./event";

import { SearchIcon } from "@/components/icons";
import { IEvent, IEventStatus } from "@/types/event.types";
import { usePagination } from "@/hooks/use-pagination";
import PaginationControl from "@/components/table/pagination-control";

const EVENTS_PER_PAGE = 3;

export const EventsDisplay = ({
  list,
  title,
  canAddNewEvent = false,
  eventStatus,
}: {
  list: IEvent[];
  title: string;
  canAddNewEvent?: boolean;
  isAdmin?: boolean;
  eventStatus: IEventStatus;
}) => {
  const [filteredList, setFilteredList] = useState(list);
  const [searchValue, setSearchValue] = useState("");
  const intl = useIntl();

  const { currentList, currentPage, totalPages, setCurrentPage } =
    usePagination(filteredList, EVENTS_PER_PAGE);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    const newFilteredList = searchValue
      ? list.filter((item) =>
          item.name.toLowerCase().includes(searchValue.toLowerCase()),
        )
      : list;

    setFilteredList(newFilteredList);
  }, [searchValue, list]);

  const EventsElement = (
    <>
      <div className={`gap-4 grid sm:grid-cols-3 grid-cols-1`}>
        {currentList.map((event) => (
          <a
            key={event.id}
            className="transition duration-500 hover:scale-105 hover:shadow-lg"
            href={`/events/${event.id}/${event.status}`}
          >
            <Event event={event} eventStatus={eventStatus} />
          </a>
        ))}
      </div>
      <div className="pt-5 flex justify-center align-center">
        <PaginationControl
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      </div>
    </>
  );

  const NoEventsElement = (
    <div className="w-full py-10 text-center">
      <p className="text-2xl">
        <FormattedMessage
          defaultMessage="No events found"
          id="events.display.noEvents"
        />
      </p>
    </div>
  );

  return (
    <div className="w-full border-small px-5 py-5 space-y-3 rounded-small border-default-200 dark:border-default-100">
      <div className="w-full flex justify-between space-x-3 items-baseline">
        <p className="md:text-3xl whitespace-nowrap">{title}</p>
        <Input
          classNames={{
            base: "max-w-full sm:max-w-[10rem] h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder={intl.formatMessage({
            id: "events.display.search.placeholder",
            defaultMessage: "Type to search...",
          })}
          size="sm"
          startContent={<SearchIcon className={"text-default-400"} />}
          type="search"
          value={searchValue}
          onChange={handleSearch}
        />
      </div>
      {filteredList.length > 0 ? EventsElement : NoEventsElement}
      {canAddNewEvent && (
        <div className="w-full flex justify-center">
          <Link href={"/admin/events/new"}>
            <Button color="success" variant="solid">
              <FormattedMessage
                defaultMessage="Add new event"
                id="events.display.addEvent"
              />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default EventsDisplay;
