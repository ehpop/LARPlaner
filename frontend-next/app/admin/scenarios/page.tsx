"use client";

import { FormattedMessage } from "react-intl";

import ScenariosDisplay from "@/components/scenarios/scenarios-display";
import { scenarios } from "@/data/mock-data";

function ScenariosPage() {
  return (
    <div className="w-full space-y-3">
      <div className="w-full flex justify-center">
        <p className="text-3xl">
          <FormattedMessage defaultMessage="Scenarios" id="scenarios.title" />
        </p>
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
