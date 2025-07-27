"use client";

import React from "react";
import { useIntl } from "react-intl";

import RoleForm from "@/components/roles/role-form";
import LoadingOverlay from "@/components/common/loading-overlay";
import { useRole } from "@/services/roles/useRoles";

export default function RolePage({ params }: any) {
  const resolvedParams = React.use(params) as { id: string };
  const roleId = resolvedParams.id;

  const intl = useIntl();

  const { data: role, isLoading, isError, error } = useRole(roleId);

  if (isError) {
    return (
      <div className="w-full flex justify-center">
        <p className="text-danger">{error?.message}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex justify-center">
      <LoadingOverlay
        isLoading={isLoading}
        label={intl.formatMessage({
          id: "loading.role",
          defaultMessage: "Loading role...",
        })}
      >
        {role && <RoleForm initialRole={role} />}
      </LoadingOverlay>
    </div>
  );
}
