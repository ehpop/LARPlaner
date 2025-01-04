"use client";

import { useEffect, useState } from "react";

import LoadingOverlay from "@/components/general/loading-overlay";
import ScenariosService from "@/services/scenarios.service";
import { IScenario } from "@/types/scenario.types";
import ScenariosDisplayAdmin from "@/components/scenarios/scenarios-display-admin";

function ScenariosPage() {
  const [scenariosData, setScenariosData] = useState<IScenario[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const response = await ScenariosService.getAll();

        if (response.success) {
          setScenariosData(response.data);
        } else {
          setError("Failed to fetch scenarios");
        }
      } catch (err) {
        setError("An error occurred while fetching scenarios");
      } finally {
        setLoading(false);
      }
    };

    fetchScenarios().then(() => {});
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
      <LoadingOverlay isLoading={loading} label={"Loading scenarios..."}>
        <ScenariosDisplayAdmin scenariosList={scenariosData || []} />
      </LoadingOverlay>
    </div>
  );
}

export default ScenariosPage;
