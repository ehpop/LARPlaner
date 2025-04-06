import { useRouter } from "next/navigation";
import { FormattedMessage } from "react-intl";
import { Button } from "@heroui/button";
import React, { useState, useMemo } from "react";
import { Input } from "@heroui/input";
import { SortDescriptor } from "@react-types/shared";

import { IRole } from "@/types/roles.types";
import { AdminTableDisplay } from "@/components/table/admin-table-display";
import PaginationControl from "@/components/table/pagination-control";
import { usePagination } from "@/hooks/use-pagination";

const RolesDisplayAdmin = ({ rolesList }: { rolesList: IRole[] }) => {
  const itemsPerPage = 10;
  const router = useRouter();

  const [filterText, setFilterText] = useState("");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor | null>(
    null,
  );

  const filteredRoles = useMemo(() => {
    let filtered = [...rolesList];

    if (filterText) {
      const lowerFilter = filterText.toLowerCase();

      filtered = filtered.filter(
        (role) =>
          role.name.toLowerCase().includes(lowerFilter) ||
          role.description.toLowerCase().includes(lowerFilter) ||
          role.tags.some((tag) =>
            tag.value.toLowerCase().includes(lowerFilter),
          ),
      );
    }

    return filtered;
  }, [rolesList, filterText]);

  const sortedRoles = useMemo(() => {
    if (!sortDescriptor) {
      return filteredRoles;
    }

    return [...filteredRoles].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof IRole] as any;
      const second = b[sortDescriptor.column as keyof IRole] as any;

      let cmp = first < second ? -1 : 1;

      if (typeof first === "string" && typeof second === "string") {
        cmp = first.localeCompare(second);
      }

      if (sortDescriptor.direction === "descending") {
        cmp *= -1;
      }

      return cmp;
    });
  }, [filteredRoles, sortDescriptor]);

  const { currentList, currentPage, totalPages, setCurrentPage } =
    usePagination(sortedRoles, itemsPerPage);

  const columns = [
    { key: "name", label: "Name", allowsSorting: true },
    { key: "description", label: "Description", allowsSorting: true },
    { key: "tags", label: "Tags" },
  ];

  const rows = currentList.map((role: IRole) => ({
    id: role.id,
    name: role.name,
    description: role.description,
    tags: role.tags.map((tag) => tag.value).join(", "),
  }));

  const handleRowClick = (role: IRole) => {
    const originalRole = rolesList.find((r) => r.id === role.id) ?? role;

    router.push(`/admin/roles/${originalRole.id}`);
  };

  const handleAddNewRole = () => {
    router.push("/admin/roles/new");
  };

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name, description, or tag..."
            value={filterText}
            onClear={() => setFilterText("")}
            onValueChange={setFilterText}
          />
          <div className="flex gap-3">
            <Button
              color="success"
              variant="bordered"
              onPress={handleAddNewRole}
            >
              <FormattedMessage
                defaultMessage="Add New Role"
                id="roles.add-new"
              />
            </Button>
          </div>
        </div>
      </div>
    );
  }, [filterText, handleAddNewRole]);

  return (
    <div className="w-full h-[80vh] flex flex-col justify-top p-3 border-1 space-y-5">
      <div className="w-full flex justify-center">
        <h1 className="text-2xl">
          <FormattedMessage defaultMessage="Roles" id="roles.title" />
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

export default RolesDisplayAdmin;
