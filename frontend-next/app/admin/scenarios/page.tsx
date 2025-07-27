"use client";

import { useIntl } from "react-intl";

import LoadingOverlay from "@/components/common/loading-overlay";
import ScenariosDisplayAdmin from "@/components/scenarios/scenarios-display-admin";
import { useScenarios } from "@/services/scenarios/useScenarios";

function ScenariosPage() {
  const intl = useIntl();

  const { data: scenarios, isLoading, error, isError } = useScenarios();

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
          id: "admin.scenarios.loading",
          defaultMessage: "Loading scenarios...",
        })}
      >
        <ScenariosDisplayAdmin scenariosList={scenarios || []} />
      </LoadingOverlay>
    </div>
  );
}

export default ScenariosPage;
