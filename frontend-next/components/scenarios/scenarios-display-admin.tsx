import { Button } from "@heroui/button";
import { FormattedMessage } from "react-intl";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { Input } from "@heroui/input";
import { SortDescriptor } from "@react-types/shared";

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

  const [filterText, setFilterText] = useState("");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor | null>(
    null,
  );

  const filteredScenarios = useMemo(() => {
    let filtered = [...scenariosList];

    if (filterText) {
      filtered = filtered.filter(
        (scenario) =>
          scenario.name.toLowerCase().includes(filterText.toLowerCase()) ||
          scenario.description.toLowerCase().includes(filterText.toLowerCase()),
      );
    }

    return filtered;
  }, [scenariosList, filterText]);

  const sortedScenarios = useMemo(() => {
    if (!sortDescriptor) {
      return filteredScenarios;
    }

    return [...filteredScenarios].sort((a, b) => {
      const aValue = sortDescriptor.column?.toString().endsWith("Count")
        ? ((a as any)[sortDescriptor.column.toString().replace("Count", "s")]
            ?.length ?? 0)
        : (a as any)[sortDescriptor.column as keyof IScenario];
      const bValue = sortDescriptor.column?.toString().endsWith("Count")
        ? ((b as any)[sortDescriptor.column.toString().replace("Count", "s")]
            ?.length ?? 0)
        : (b as any)[sortDescriptor.column as keyof IScenario];

      let cmp = 0;

      if (typeof aValue === "number" && typeof bValue === "number") {
        cmp = aValue - bValue;
      } else if (typeof aValue === "string" && typeof bValue === "string") {
        cmp = aValue.localeCompare(bValue);
      } else {
        if (aValue < bValue) cmp = -1;
        else if (aValue > bValue) cmp = 1;
        else cmp = 0;
      }

      if (sortDescriptor.direction === "descending") {
        cmp *= -1;
      }

      return cmp;
    });
  }, [filteredScenarios, sortDescriptor]);

  const { currentList, currentPage, totalPages, setCurrentPage } =
    usePagination(sortedScenarios, itemsPerPage);

  const columns = [
    { key: "name", label: "Name", allowsSorting: true },
    { key: "description", label: "Description", allowsSorting: true },
    { key: "rolesCount", label: "Roles", allowsSorting: true },
    { key: "itemsCount", label: "Items", allowsSorting: true },
    { key: "actionsCount", label: "Actions", allowsSorting: true },
  ];

  const rows = currentList.map((scenario: IScenario) => ({
    id: scenario.id,
    name: scenario.name,
    description: scenario.description,
    rolesCount: scenario.roles.length,
    itemsCount: scenario.items.length,
    actionsCount: scenario.actions.length,
  }));

  const handleRowClick = (row: { id: string } & Record<string, any>) => {
    const originalScenario = scenariosList.find((s) => s.id === row.id);

    if (originalScenario) {
      router.push(`/admin/scenarios/${originalScenario.id}`);
    } else {
      router.push(`/admin/scenarios/${row.id}`);
    }
  };

  const handleAddNewScenario = () => {
    router.push("/admin/scenarios/new");
  };

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name or description..."
            value={filterText}
            onClear={() => setFilterText("")}
            onValueChange={setFilterText}
          />
          <div className="flex gap-3">
            <Button
              color="success"
              variant="bordered"
              onPress={handleAddNewScenario}
            >
              <FormattedMessage
                defaultMessage="Add New Scenario"
                id="scenarios.add"
              />
            </Button>
          </div>
        </div>
      </div>
    );
  }, [filterText, handleAddNewScenario]);

  return (
    <div className="w-full h-[80vh] flex flex-col justify-top p-3 border-1 space-y-5">
      <div className="w-full flex justify-center">
        <h1 className="text-2xl">
          <FormattedMessage defaultMessage="Scenarios" id="scenarios.title" />
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

export default ScenariosDisplayAdmin;
