"use client";

import React from "react";

import ScenarioForm from "@/components/scenarios/scenario-form";

export default function ScenarioDisplayPage({ params }: any) {
  return (
    <div className="w-full h-full flex justify-center">
      <ScenarioForm scenarioId={params.id} />
    </div>
  );
}
