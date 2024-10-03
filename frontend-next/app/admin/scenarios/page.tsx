"use client";

import ScenariosDisplay from "@/components/scenarios/scenarios-display";

const scenarios: string[] = [
  "Scenario 1",
  "Scenario 2",
  "Scenario 3",
  "Scenario 4",
  "Scenario 5",
  "Scenario 6",
  "Scenario 7",
  "Scenario 8",
  "Scenario 9",
  "Scenario 10",
];

function ScenariosPage() {
  return (
    <div className="w-full space-y-3">
      <div className="w-full flex justify-center">
        <p className="text-3xl">Scenarios Page</p>
      </div>
      <ScenariosDisplay
        canAddNewScenario={true}
        scenariosList={scenarios}
        title={"Scenarios"}
      />
    </div>
  );
}

export default ScenariosPage;
