import {Input, Pagination} from "@nextui-org/react";
import {Event} from "./event";
import {ChangeEvent, useEffect, useState} from "react";
import {SearchIcon} from "@/components/icons";

const EVENTS_PER_PAGE = 3;
const EVENTS_PER_SMALL_PAGE = 1;

export const EventsDisplay = ({list, title}: { list: any[], title: string }) => {
    const getAmountOfPages = (list: any[]) => {
        return Math.ceil(list.length / EVENTS_PER_PAGE);
    };

    const getPages = (list: any[]) => {
        let pages: any[] = [];
        let amountOfPages = getAmountOfPages(list);
        for (let i = 1; i <= amountOfPages; i++) {
            let page = list.slice((i - 1) * EVENTS_PER_PAGE, i * EVENTS_PER_PAGE);
            pages.push(page);
        }

        return pages;
    };

    const [pages, setPages] = useState(getPages(list));
    const [filteredList, setFilteredList] = useState(list);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    useEffect(() => {
        const newFilteredList = searchValue
            ? list.filter((item) => item.title.toLowerCase().includes(searchValue.toLowerCase()))
            : list;

        setFilteredList(newFilteredList);
        setPages(getPages(newFilteredList));
        setCurrentPage(1);
    }, [searchValue, list]);

    const EventsElement = (
        <>
            <div className={`gap-4 grid grid-cols-${EVENTS_PER_SMALL_PAGE} sm:grid-cols-${EVENTS_PER_PAGE}`}>
                {pages[currentPage - 1]?.map((item: any) => (
                    <Event key={Math.random()} event={item}/>
                ))}
            </div>
            <div className="pt-5 flex justify-center align-center">
                <Pagination
                    showControls
                    total={pages.length}
                    initialPage={currentPage}
                    onChange={(page) => setCurrentPage(page)}
                />
            </div>
        </>
    );

    const NoEventsElement = (
        <div className="py-10">
            <p className="text-2xl">No events available</p>
        </div>
    );

    return (
        <div className="w-full border-small px-5 py-5 my-5 rounded-small border-default-200 dark:border-default-100">
            <div className="w-full flex justify-between py-3">
                <p className="text-3xl">{title}</p>
                <Input
                    classNames={{
                        base: "max-w-full sm:max-w-[10rem] h-10",
                        mainWrapper: "h-full",
                        input: "text-small",
                        inputWrapper:
                            "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
                    }}
                    placeholder="Type to search..."
                    size="sm"
                    type="search"
                    value={searchValue}
                    startContent={<SearchIcon className={"text-default-400"}/>}
                    onChange={handleSearch}
                />
            </div>
            {filteredList.length > 0 ? EventsElement : NoEventsElement}
        </div>
    );
};

export default EventsDisplay;