"use client";

import { useEffect, useState } from "react";
import React from "react";
import { useIntl } from "react-intl";

import { IRole } from "@/types/roles.types";
import RolesService from "@/services/roles.service";
import RoleForm from "@/components/roles/role-form";
import LoadingOverlay from "@/components/general/loading-overlay";
import { showErrorToastWithTimeout } from "@/utils/toast";

export default function RolePage({ params }: any) {
  const resolvedParams = React.use(params) as { id: string };
  const roleId = resolvedParams.id;
  const intl = useIntl();
  const [roleData, setRoleData] = useState<IRole>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      if (!roleId) {
        setError(
          intl.formatMessage({
            id: "roles.id.missing",
            defaultMessage: "Role ID is missing",
          }),
        );
        setLoading(false);

        return;
      }
      try {
        const response = await RolesService.getById(roleId);

        if (response.success) {
          setRoleData(response.data);
        } else {
          setError(
            response.data ||
              intl.formatMessage({
                id: "roles.id.error.default",
                defaultMessage: "An error occurred while fetching role",
              }),
          );
          showErrorToastWithTimeout(
            intl.formatMessage({
              id: "roles.id.error.default",
              defaultMessage: "An error occurred while fetching role",
            }),
          );
        }
      } catch (err) {
        setError(
          intl.formatMessage({
            id: "roles.id.error.default",
            defaultMessage: "An error occurred while fetching role",
          }),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRole().then(() => {});
  }, [roleId]);

  if (error) {
    return (
      <div className="w-full flex justify-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex justify-center">
      <LoadingOverlay
        isLoading={loading}
        label={intl.formatMessage({
          id: "loading.role",
          defaultMessage: "Loading role...",
        })}
      >
        {roleData && <RoleForm initialRole={roleData} />}
      </LoadingOverlay>
    </div>
  );
}
