import {Input, Pagination} from "@nextui-org/react";
import {ChangeEvent, useEffect, useState} from "react";
import {Link} from "@nextui-org/link";
import {Button} from "@nextui-org/button";

import {SearchIcon} from "@/components/icons";

const ROLES_PER_PAGE = 6;

export const RolesDisplay = ({
                                 rolesList,
                                 title,
                                 canAddNewRole = false,
                             }: {
    rolesList: string[];
    title: string;
    canAddNewRole?: boolean;
}) => {
    const [searchValue, setSearchValue] = useState("");
    const getAmountOfPages = (list: string[]) => {
        return Math.ceil(list.length / ROLES_PER_PAGE);
    };
    const getPages = (list: string[]) => {
        let pages: string[][] = [];
        let amountOfPages = getAmountOfPages(list);

        for (let i = 1; i <= amountOfPages; i++) {
            let page = list.slice((i - 1) * ROLES_PER_PAGE, i * ROLES_PER_PAGE);

            pages.push(page);
        }

        return pages;
    };
    const [pages, setPages] = useState(getPages(rolesList));
    const [filteredList, setFilteredList] = useState(rolesList);
    const [currentPage, setCurrentPage] = useState(1);

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    useEffect(() => {
        const newFilteredList = searchValue
            ? rolesList.filter((role) =>
                role.toLowerCase().includes(searchValue.toLowerCase()),
            )
            : rolesList;

        setFilteredList(newFilteredList);
        setPages(getPages(newFilteredList));
        setCurrentPage(1);
    }, [searchValue, rolesList]);

    const RolesElement = (
        <>
            <div className="gap-4 grid sm:grid-cols-2 grid-cols-1">
                {pages[currentPage - 1]?.map((role) => (
                    <Link
                        key={role}
                        isBlock
                        className="w-full border-1 p-3 space-y-3 text-center"
                        href={`/roles/${role.replace(/\s/g, "-").toLowerCase()}`}
                    >
                        <p className="text-xl">{role}</p>
                    </Link>
                ))}
            </div>
            <div className="pt-5 flex justify-center align-center">
                <Pagination
                    showControls
                    initialPage={currentPage}
                    total={pages.length}
                    onChange={(page) => setCurrentPage(page)}
                />
            </div>
        </>
    );

    const NoRolesElement = (
        <div className="w-full py-10 text-center">
            <p className="text-2xl">No roles available</p>
        </div>
    );

    return (
        <div
            className="w-full border-small px-5 py-5 space-y-3 rounded-small border-default-200 dark:border-default-100">
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
                    startContent={<SearchIcon className="text-default-400"/>}
                    type="search"
                    value={searchValue}
                    onChange={handleSearch}
                />
            </div>
            {filteredList.length > 0 ? RolesElement : NoRolesElement}
            {canAddNewRole && (
                <div className="w-full flex justify-center">
                    <Link href="/roles/new">
                        <Button color="success" variant="solid">
                            Dodaj nową rolę
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default RolesDisplay;
