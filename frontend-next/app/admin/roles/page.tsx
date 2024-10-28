"use client";

import RolesDisplay from "@/components/roles/roles-display";
import { possibleRoles } from "@/data/mock-data";

export default function RolesPage() {
  return (
    <div className="w-full space-y-3">
      <div className="w-full flex justify-center">
        <p className="text-3xl">Roles Page</p>
      </div>
      <RolesDisplay
        canAddNewRole={true}
        rolesList={possibleRoles}
        title={"Rola"}
      />
    </div>
  );
}
