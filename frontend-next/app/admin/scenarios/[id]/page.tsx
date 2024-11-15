"use client";

import React, { useEffect, useState } from "react";

import ScenarioForm from "@/components/scenarios/scenario-form";
import { IScenario } from "@/types/scenario.types";
import LoadingOverlay from "@/components/general/loading-overlay";
import ScenariosService from "@/services/scenarios.service";

export default function ScenarioDisplayPage({ params }: any) {
  const [scenarioData, setScenarioData] = useState<IScenario>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScenario = async () => {
      try {
        const response = await ScenariosService.getById(params.id);

        if (response.success) {
          setScenarioData(response.data);
        } else {
          setError("Failed to fetch scenario");
        }
      } catch (err) {
        setError("An error occurred while fetching scenario");
      } finally {
        setLoading(false);
      }
    };

    fetchScenario().then(() => {});
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
      <LoadingOverlay isLoading={loading} label={"Loading scenario..."}>
        {scenarioData && <ScenarioForm initialScenario={scenarioData} />}
      </LoadingOverlay>
    </div>
  );
}
