"use client";

import {Button, DatePicker, Input, Select, SelectItem, Textarea,} from "@nextui-org/react";
import {useState} from "react";
import {Link} from "@nextui-org/link";

export default function AddEventModal() {
    const scenarios = [
        {key: "scenario1", name: "Scenario 1"},
        {key: "scenario2", name: "Scenario 2"},
        {key: "scenario3", name: "Scenario 3"},
    ];

    const [selectedScenario, setSelectedScenario] = useState();

    const selectScenario = (
        <Select
            className="w-1/2"
            items={scenarios}
            label="Scenariusz"
            placeholder="Wybierz scenariusz..."
            size="lg"
            variant="underlined"
            onSelectionChange={setSelectedScenario}
        >
            {(scenario) => (
                <SelectItem key={scenario.key}>{scenario.name}</SelectItem>
            )}
        </Select>
    );

    return (
        <div className="space-y-10 border-1 p-3">
            <div className="w-full flex justify-center">
                <p className="text-3xl" id="add-event-modal">
                    Dodaj wydarzenie
                </p>
            </div>
            <Input
                className="w-full"
                isClearable={true}
                label="Nazwa"
                placeholder="Wprowadź nazwę wydarzenia..."
                size="lg"
                variant="underlined"
            />
            <div className="w-full">
                <div className="flex justify-between space-x-3">
                    <DatePicker
                        showMonthAndYearPickers
                        className="w-1/2 "
                        label="Data"
                        size="lg"
                        variant="underlined"
                    />
                    <Input
                        className="w-1/2"
                        label="Czas"
                        size="lg"
                        type="time"
                        variant="underlined"
                    />
                </div>
            </div>
            <Textarea
                className="w-full"
                label="Opis"
                placeholder="Wprowadź opis wydarzenia"
                size="lg"
                variant="underlined"
            />
            <Input
                className="w-full"
                isClearable={true}
                label="Max liczba uczestników"
                min="0"
                placeholder="Wprowadź liczbę uczestników..."
                size="lg"
                type="number"
                variant="underlined"
            />
            <div className="w-full flex justify-between items-baseline space-x-3">
                {selectScenario}
                <Button as={Link} color="success" href={"/scenarios/new"}>
                    Dodaj nowy scenariusz
                </Button>
                <Button color="warning" isDisabled={!selectedScenario}>
                    Edytuj scenariusz
                </Button>
            </div>
            <div className="w-full flex justify-end">
                <div className="flex justify-between space-x-3">
                    <Button color="danger" size="lg" variant="bordered">
                        Anuluj
                    </Button>
                    <Button color="success" size="lg">
                        Zapisz
                    </Button>
                </div>
            </div>
        </div>
    );
}
