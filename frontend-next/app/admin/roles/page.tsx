"use client";

import { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import RolesService from "@/services/roles.service";
import LoadingOverlay from "@/components/general/loading-overlay";
import { IRole } from "@/types/roles.types";
import RolesDisplayAdmin from "@/components/roles/roles-display-admin";

export default function RolesPage() {
  const intl = useIntl();
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
          setError(
            intl.formatMessage({
              id: "roles.page.failed.to.fetch.roles",
              defaultMessage: "Failed to fetch roles",
            }),
          );
        }
      } catch (err) {
        setError(
          intl.formatMessage({
            id: "roles.page.an.error.occurred.while.fetching.roles",
            defaultMessage: "An error occurred while fetching roles",
          }),
        );
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
      <LoadingOverlay isLoading={loading} label={"Loading roles..."}>
        <RolesDisplayAdmin rolesList={rolesData || []} />
      </LoadingOverlay>
    </div>
  );
}
