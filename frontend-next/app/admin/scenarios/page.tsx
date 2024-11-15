"use client";

import { FormattedMessage } from "react-intl";
import { useEffect, useState } from "react";

import ScenariosDisplay from "@/components/scenarios/scenarios-display";
import LoadingOverlay from "@/components/general/loading-overlay";
import { IScenarioList } from "@/types/scenario.types";
import ScenariosService from "@/services/scenarios.service";

function ScenariosPage() {
  const [scenariosData, setScenariosData] = useState<IScenarioList | null>(
    null,
  );
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
      <div className="w-full flex justify-center">
        <p className="text-3xl">
          <FormattedMessage defaultMessage="Scenarios" id="scenarios.title" />
        </p>
      </div>
      <LoadingOverlay isLoading={loading} label={"Loading scenarios..."}>
        <ScenariosDisplay
          canAddNewScenario={true}
          scenariosList={scenariosData || []}
          title={"Scenarios"}
        />
      </LoadingOverlay>
    </div>
  );
}

export default ScenariosPage;
