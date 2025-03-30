"use client";

import { useEffect, useState } from "react";

import { IRole } from "@/types/roles.types";
import RolesService from "@/services/roles.service";
import RoleForm from "@/components/roles/role-form";
import LoadingOverlay from "@/components/general/loading-overlay";
import { showErrorToastWithTimeout } from "@/utils/toast";

export default function RolePage({ params }: any) {
  const [roleData, setRoleData] = useState<IRole>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await RolesService.getById(params.id);

        if (response.success) {
          setRoleData(response.data);
        } else {
          setError("Failed to fetch role");
          showErrorToastWithTimeout("Failed to fetch role");
        }
      } catch (err) {
        setError("An error occurred while fetching role");
      } finally {
        setLoading(false);
      }
    };

    fetchRole().then(() => {});
  }, []);

  if (error) {
    return (
      <div className="w-full flex justify-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex justify-center">
      <LoadingOverlay isLoading={loading} label={"Loading role..."}>
        {roleData && <RoleForm initialRole={roleData} />}
      </LoadingOverlay>
    </div>
  );
}
