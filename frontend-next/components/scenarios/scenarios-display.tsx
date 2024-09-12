import { Input, Pagination } from "@nextui-org/react";
import { useEffect, useState, ChangeEvent } from "react";
import { SearchIcon } from "@/components/icons";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";

const SCENARIOS_PER_PAGE = 6;

export const ScenariosDisplay = ({ scenariosList, title, canAddNewScenario = false }: {
    scenariosList: string[],
    title: string,
    canAddNewScenario?: boolean
}) => {
    const getAmountOfPages = (list: string[]) => {
        return Math.ceil(list.length / SCENARIOS_PER_PAGE);
    };

    const getPages = (list: string[]) => {
        let pages: string[][] = [];
        let amountOfPages = getAmountOfPages(list);
        for (let i = 1; i <= amountOfPages; i++) {
            let page = list.slice((i - 1) * SCENARIOS_PER_PAGE, i * SCENARIOS_PER_PAGE);
            pages.push(page);
        }

        return pages;
    };

    const [pages, setPages] = useState(getPages(scenariosList));
    const [filteredList, setFilteredList] = useState(scenariosList);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    useEffect(() => {
        const newFilteredList = searchValue
            ? scenariosList.filter((scenario) =>
                scenario.toLowerCase().includes(searchValue.toLowerCase())
            )
            : scenariosList;

        setFilteredList(newFilteredList);
        setPages(getPages(newFilteredList));
        setCurrentPage(1);
    }, [searchValue, scenariosList]);

    const ScenariosElement = (
        <>
            <div className="gap-4 grid sm:grid-cols-2 grid-cols-1">
                {pages[currentPage - 1]?.map((scenario, index) => (
                    <Link
                        href={`/scenarios/${index + 1}`}
                        key={scenario}
                        isBlock
                        className="w-full border-1 p-3 space-y-3 text-center"
                    >
                        <p className="text-xl">{scenario}</p>
                    </Link>
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

    const NoScenariosElement = (
        <div className="w-full py-10 text-center">
            <p className="text-2xl">No scenarios available</p>
        </div>
    );

    return (
        <div className="w-full border-small px-5 py-5 space-y-3 rounded-small border-default-200 dark:border-default-100">
            <div className="w-full flex justify-between">
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
                    startContent={<SearchIcon className="text-default-400" />}
                    onChange={handleSearch}
                />
            </div>
            {filteredList.length > 0 ? ScenariosElement : NoScenariosElement}
            {canAddNewScenario && (
                <div className="w-full flex justify-center">
                    <Link href={"/scenarios/new"}>
                        <Button variant="solid" color="success">
                            Dodaj nowy scenariusz
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ScenariosDisplay;
