import { Input, Pagination } from "@nextui-org/react";
import { ChangeEvent, useEffect, useState } from "react";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";
import { FormattedMessage, useIntl } from "react-intl";

import { SearchIcon } from "@/components/icons";
import { IScenarioList } from "@/types/scenario.types";

const SCENARIOS_PER_PAGE = 6;

export const ScenariosDisplay = ({
  scenariosList,
  title,
  canAddNewScenario = false,
}: {
  scenariosList: IScenarioList;
  title: string;
  canAddNewScenario?: boolean;
}) => {
  const getAmountOfPages = (list: IScenarioList) => {
    return list.length ? Math.ceil(list.length / SCENARIOS_PER_PAGE) : 1;
  };

  const getPages = (list: IScenarioList) => {
    let pages: IScenarioList[] = [];
    let amountOfPages = getAmountOfPages(list);

    for (let i = 1; i <= amountOfPages; i++) {
      let page = list.slice(
        (i - 1) * SCENARIOS_PER_PAGE,
        i * SCENARIOS_PER_PAGE,
      );

      pages.push(page);
    }

    return pages;
  };

  const [pages, setPages] = useState(getPages(scenariosList));
  const [filteredList, setFilteredList] = useState(scenariosList);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const intl = useIntl();

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    const newFilteredList = searchValue
      ? scenariosList.filter((scenario) =>
          scenario.name.toLowerCase().includes(searchValue.toLowerCase()),
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
            key={scenario.id}
            isBlock
            className="w-full border-1 p-3 space-y-3 text-center"
            href={`/admin/scenarios/${index + 1}`}
          >
            <p className="text-xl">{scenario.name}</p>
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

  const NoScenariosElement = (
    <div className="w-full py-10 text-center">
      <p className="text-2xl">
        <FormattedMessage
          defaultMessage="No scenarios found for the search term: "
          id="scenarios.display.noScenariosFound"
        />
        <span className="font-bold">{searchValue}</span>
      </p>
    </div>
  );

  return (
    <div className="w-full border-small px-5 py-5 space-y-3 rounded-small border-default-200 dark:border-default-100">
      <div className="w-full flex justify-between space-x-3 items-baseline">
        <p className="md:text-3xl text-2xl">{title}</p>
        <Input
          classNames={{
            base: "max-w-full sm:max-w-[10rem] h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder={intl.formatMessage({
            id: "scenarios.display.search",
            defaultMessage: "Search...",
          })}
          size="sm"
          startContent={<SearchIcon className="text-default-400" />}
          type="search"
          value={searchValue}
          onChange={handleSearch}
        />
      </div>
      {filteredList.length > 0 ? ScenariosElement : NoScenariosElement}
      {canAddNewScenario && (
        <div className="w-full flex justify-center">
          <Link href={"/admin/scenarios/new"}>
            <Button color="success" variant="solid">
              <FormattedMessage
                defaultMessage="New"
                id="scenarios.display.addNewScenario"
              />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ScenariosDisplay;
