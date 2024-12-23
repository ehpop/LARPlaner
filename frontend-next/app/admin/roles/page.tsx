"use client";

import { useEffect, useState } from "react";

import RolesService from "@/services/roles.service";
import RolesDisplay from "@/components/roles/roles-display";
import LoadingOverlay from "@/components/general/loading-overlay";
import { IRole } from "@/types/roles.types";

export default function RolesPage() {
  const [rolesData, setRolesData] = useState<IRole[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await RolesService.getAll();

        if (response.success) {
          setRolesData(response.data);
        } else {
          setError("Failed to fetch roles");
        }
      } catch (err) {
        setError("An error occurred while fetching roles");
      } finally {
        setLoading(false);
      }
    };

    fetchRoles().then(() => {});
  }, []);

  if (error) {
    return (
      <div className="w-full flex justify-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      <div className="w-full flex justify-center">
        <p className="text-3xl">Roles Page</p>
      </div>
      <LoadingOverlay isLoading={loading} label={"Loading roles..."}>
        <RolesDisplay
          canAddNewRole={true}
          rolesList={rolesData || []}
          title={"Roles"}
        />
      </LoadingOverlay>
    </div>
  );
}
