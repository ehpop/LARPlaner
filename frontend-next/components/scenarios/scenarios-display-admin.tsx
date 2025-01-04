import { Button } from "@nextui-org/button";
import { FormattedMessage } from "react-intl";
import { useRouter } from "next/navigation";

import { IScenario } from "@/types/scenario.types";
import { usePagination } from "@/hooks/use-pagination";
import { AdminTableDisplay } from "@/components/table/admin-table-display";
import PaginationControl from "@/components/table/pagination-control";

const ScenariosDisplayAdmin = ({
  scenariosList,
}: {
  scenariosList: IScenario[];
}) => {
  const itemsPerPage = 10;
  const router = useRouter();
  const { currentList, currentPage, totalPages, setCurrentPage } =
    usePagination(scenariosList, itemsPerPage);

  const columns = [
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "rolesCount", label: "Roles" },
    { key: "itemsCount", label: "Items" },
    { key: "actionsCount", label: "Actions" },
    { key: "tagsCount", label: "Tags" },
  ];

  const rows = currentList.map((scenario: IScenario) => ({
    id: scenario.id,
    name: scenario.name,
    description: scenario.description,
    rolesCount: scenario.roles.length,
    itemsCount: scenario.items.length,
    actionsCount: scenario.actions.length,
    tagsCount: scenario.tags.length,
  }));

  const handleRowClick = (scenario: IScenario) => {
    router.push(`/admin/scenarios/${scenario.id}`);
  };

  const handleAddNewScenario = () => {
    router.push("/admin/scenarios/new");
  };

  const addNewScenarioButton = (
    <div className="w-full flex justify-end">
      <Button color="success" variant="bordered" onClick={handleAddNewScenario}>
        <FormattedMessage
          defaultMessage="Add New Scenario"
          id="scenarios.add"
        />
      </Button>
    </div>
  );

  return (
    <div className="w-full h-[80vh] flex flex-col justify-center p-3 border-1 space-y-5">
      <div className="w-full flex justify-center">
        <h1 className="text-2xl">
          <FormattedMessage defaultMessage="Scenarios" id="scenarios.title" />
        </h1>
      </div>
      <div className="w-full h-full flex flex-col justify-between space-y-3">
        <div className="flex flex-col space-y-3">
          {addNewScenarioButton}
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

export default ScenariosDisplayAdmin;
