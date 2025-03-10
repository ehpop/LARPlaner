import { useRouter } from "next/navigation";
import { FormattedMessage } from "react-intl";
import { Button } from "@heroui/button";

import { IRole } from "@/types/roles.types";
import { AdminTableDisplay } from "@/components/table/admin-table-display";
import PaginationControl from "@/components/table/pagination-control";
import { usePagination } from "@/hooks/use-pagination";

const RolesDisplayAdmin = ({ rolesList }: { rolesList: IRole[] }) => {
  const itemsPerPage = 10;
  const router = useRouter();
  const { currentList, currentPage, totalPages, setCurrentPage } =
    usePagination(rolesList, itemsPerPage);

  const columns = [
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "tags", label: "Tags" },
  ];

  const rows = currentList.map((role: IRole) => ({
    id: role.id,
    name: role.name,
    description: role.description,
    tags: role.tags.map((tag) => tag.value).join(", "),
  }));

  const handleRowClick = (role: IRole) => {
    router.push(`/admin/roles/${role.id}`);
  };

  const handleAddNewRole = () => {
    router.push("/admin/roles/new");
  };

  const addNewRoleButton = (
    <div className="flex justify-end">
      <Button color="success" variant="bordered" onPress={handleAddNewRole}>
        <FormattedMessage defaultMessage="Add New Role" id="roles.add-new" />
      </Button>
    </div>
  );

  return (
    <div className="w-full h-[80vh] flex flex-col justify-top p-3 border-1 space-y-5">
      <div className="w-full flex justify-center">
        <h1 className="text-2xl">
          <FormattedMessage defaultMessage="Roles" id="roles.title" />
        </h1>
      </div>
      <div className="w-full h-full flex flex-col justify-between space-y-3">
        <div className="flex flex-col space-y-3">
          {addNewRoleButton}
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

export default RolesDisplayAdmin;
