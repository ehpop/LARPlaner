"use client";

import { useIntl } from "react-intl";

import LoadingOverlay from "@/components/common/loading-overlay";
import RolesDisplayAdmin from "@/components/roles/roles-display-admin";
import { useRoles } from "@/services/roles/useRoles";

export default function RolesPage() {
  const intl = useIntl();

  const { data: roles, isLoading, isError, error } = useRoles();

  if (isError) {
    return (
      <div className="w-full flex justify-center">
        <p>{error?.message}</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      <LoadingOverlay
        isLoading={isLoading}
        label={intl.formatMessage({
          id: "admin.roles.page.loading",
          defaultMessage: "Loading roles...",
        })}
      >
        <RolesDisplayAdmin rolesList={roles || []} />
      </LoadingOverlay>
    </div>
  );
}
