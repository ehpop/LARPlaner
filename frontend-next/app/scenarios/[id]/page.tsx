"use client";

import {Button, Select, SelectItem, Input} from "@nextui-org/react";
import {useState} from "react";

const scenarioData = {
    name: "Przykładowy Scenariusz",
    description: "Opis przykładowego scenariusza, który zawiera szczegóły dotyczące fabuły, tła, oraz celu.",
    roles: [
        {name: "mag", count: 1},
        {name: "wojownik", count: 2},
    ],
};

export default function ScenarioDisplayPage() {
    const [scenario, setScenario] = useState(scenarioData);

    return (
        <div className="space-y-10 border-1 p-3">
            <div className="w-full flex justify-center">
                <p id="display-scenario-modal" className="text-3xl">
                    Wyświetl scenariusz
                </p>
            </div>
            <div className="space-y-3">
                <p className="text-xl font-bold">Nazwa scenariusza:</p>
                <p>{scenario.name}</p>
            </div>
            <div className="space-y-3">
                <p className="text-xl font-bold">Opis scenariusza:</p>
                <p>{scenario.description}</p>
            </div>
            <div className="border-1 p-3 space-y-3">
                <p className="text-xl font-bold">Postaci w scenariuszu:</p>
                <div className="w-1/2 space-y-3">
                    {scenario.roles.map((role, index) => (
                        <div key={index} className="flex flex-row space-x-3 items-center">
                            <Select
                                defaultSelectedKeys={[role.name]}
                                isDisabled={true}
                                size="md"
                                variant="underlined"
                                className="w-1/2"
                                label="Rola"
                            >
                                <SelectItem key={role.name} value={role.name}>
                                    {role.name}
                                </SelectItem>
                            </Select>
                            <Input
                                value={role.count.toString()}
                                isDisabled={true}
                                size="md"
                                variant="underlined"
                                className="w-1/4"
                                label="Ilość postaci"
                                type="number"
                                min={1}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-full flex justify-end">
                <div className="flex justify-between space-x-3">
                    <Button color="danger" size="lg">
                        Usuń
                    </Button>
                    <Button color="warning" size="lg">
                        Edytuj
                    </Button>
                </div>
            </div>
        </div>
    );
}
