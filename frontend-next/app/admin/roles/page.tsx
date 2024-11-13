"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/react";

import RolesService from "@/services/roles.service";
import { IRoleList } from "@/types/roles.types";
import RolesDisplay from "@/components/roles/roles-display";

export default function RolesPage() {
  const [rolesData, setRolesData] = useState<IRoleList | null>(null);
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

    fetchRoles();
  }, []);

  const rolesElement = () => {
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

    return (
      rolesData && (
        <RolesDisplay
          canAddNewRole={true}
          rolesList={rolesData}
          title={"Rola"}
        />
      )
    );
  };

  return (
    <div className="w-full space-y-3">
      <div className="w-full flex justify-center">
        <p className="text-3xl">Roles Page</p>
      </div>
      {rolesElement()}
    </div>
  );
}
