"use client";

import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import ScenarioForm from "@/components/scenarios/scenario-form";
import { IScenario } from "@/types/scenario.types";
import LoadingOverlay from "@/components/general/loading-overlay";
import ScenariosService from "@/services/scenarios.service";

export default function ScenarioDisplayPage({ params }: any) {
  const resolvedParams = React.use(params) as { id: string };
  const scenarioId = resolvedParams.id;
  const intl = useIntl();

  const [scenarioData, setScenarioData] = useState<IScenario>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScenario = async () => {
      if (!scenarioId) {
        setError(
          intl.formatMessage({
            id: "scenarios.id.missing",
            defaultMessage: "Scenario ID is missing",
          }),
        );
        setLoading(false);

        return;
      }
      try {
        const response = await ScenariosService.getById(scenarioId);

        if (response.success) {
          setScenarioData(response.data);
        } else {
          setError(
            response.data ||
              intl.formatMessage({
                id: "scenario.id.error.default",
                defaultMessage: "An error occurred while fetching scenario",
              }),
          );
        }
      } catch (err) {
        setError(
          intl.formatMessage({
            id: "scenario.id.error.default",
            defaultMessage: "An error occurred while fetching scenario",
          }),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchScenario().finally(() => setLoading(false));
  }, [scenarioId]);

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
          id: "loading.scenario",
          defaultMessage: "Loading scenario...",
        })}
      >
        {scenarioData && <ScenarioForm initialScenario={scenarioData} />}
      </LoadingOverlay>
    </div>
  );
}
