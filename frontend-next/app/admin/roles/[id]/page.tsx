"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/react";
import { toast } from "react-toastify";

import { IRole } from "@/types/roles.types";
import RolesService from "@/services/roles.service";
import RoleForm from "@/components/roles/role-form";

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
          toast(response.data, {
            type: "error",
          });
        }
      } catch (err) {
        setError("An error occurred while fetching role");
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex justify-center">
        <Spinner label={"Loading..."} size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex justify-center">
        <p>{error}</p>
      </div>
    );
  }

  return <div>{roleData && <RoleForm initialRole={roleData} />}</div>;
}
