import { Input } from "@heroui/react";
import { ChangeEvent, useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useTheme } from "next-themes";

import { SearchIcon } from "@/components/icons";
import { IEvent, IEventStatus } from "@/types/event.types";
import Event from "@/components/events/event";

export const EventsDisplay = ({
  list,
  title,
  eventStatus,
}: {
  list: IEvent[];
  title: string;
  eventStatus: IEventStatus;
}) => {
  const userEvents = list.filter((event) => event.status === eventStatus);
  const [filteredList, setFilteredList] = useState(userEvents);
  const [searchValue, setSearchValue] = useState("");
  const intl = useIntl();
  const theme = useTheme();

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
  }, [searchValue]);

  const SearchElement = (
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
  );

  const NoEventsElement = (
    <div className="w-full min-h-[284px] flex justify-center items-center">
      <p className="text-2xl">
        <FormattedMessage
          defaultMessage="No events found"
          id="events.display.noEvents"
        />
      </p>
    </div>
  );

  const EventsElement = (
    <div className="w-full flex flex-row justify-center">
      <Swiper
        navigation
        centeredSlides={true}
        grabCursor={true}
        keyboard={{
          enabled: true,
        }}
        modules={[Navigation, Pagination, Scrollbar]}
        pagination={{
          clickable: true,
        }}
        rewind={true}
        scrollbar={{ draggable: true }}
        slidesPerView="auto"
        style={{
          // @ts-ignore
          "--swiper-navigation-color": theme.theme === "dark" ? "#fff" : "#000",
          "--swiper-pagination-color": theme.theme === "dark" ? "#fff" : "#000",
          "--swiper-pagination-bullet-inactive-color":
            theme.theme === "dark" ? "#fff" : "#000",
        }}
      >
        {filteredList.map((event: IEvent) => (
          <SwiperSlide key={event.id} className="text-center">
            {(_) => <Event event={event} />}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );

  return (
    <div className="flex flex-col justify-between w-full border-small px-5 py-5 space-y-3 rounded-small border-default-200 dark:border-default-100">
      <div className="flex flex-col justify-between">
        {SearchElement}
        <div className="w-full flex justify-center mt-5">
          {filteredList.length > 0 ? EventsElement : NoEventsElement}
        </div>
      </div>
    </div>
  );
};

export default EventsDisplay;
