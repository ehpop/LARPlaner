"use client";

import React from "react";
import { useIntl } from "react-intl";

import ScenarioForm from "@/components/scenarios/scenario-form";
import LoadingOverlay from "@/components/common/loading-overlay";
import { useScenario } from "@/services/scenarios/useScenarios";

export default function ScenarioDisplayPage({ params }: any) {
  const resolvedParams = React.use(params) as { id: string };
  const scenarioId = resolvedParams.id;
  const intl = useIntl();

  const { data: scenario, isLoading, error, isError } = useScenario(scenarioId);

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
          id: "admin.scenario.id.loading",
          defaultMessage: "Loading scenario...",
        })}
      >
        {scenario && <ScenarioForm initialScenario={scenario} />}
      </LoadingOverlay>
    </div>
  );
}
