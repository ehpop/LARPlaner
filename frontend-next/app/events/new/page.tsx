"use client";

import {Button, DatePicker, Input, Select, SelectItem, Textarea} from "@nextui-org/react";
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
            size="lg"
            items={scenarios}
            label="Scenariusz"
            placeholder="Wybierz scenariusz..."
            variant="underlined"
            className="w-1/2"
            onSelectionChange={setSelectedScenario}
        >
            {(scenario) => <SelectItem key={scenario.key}>{scenario.name}</SelectItem>}
        </Select>
    );

    return (
        <div className="space-y-10 border-1 p-3">
            <div className="w-full flex justify-center">
                <p id="add-event-modal" className="text-3xl">
                    Dodaj wydarzenie
                </p>
            </div>
            <Input
                size="lg"
                isClearable={true}
                variant="underlined"
                className="w-full"
                label="Nazwa"
                placeholder="Wprowadź nazwę wydarzenia..."
            />
            <div className="w-full">
                <div className="flex justify-between space-x-3">
                    <DatePicker
                        size="lg"
                        variant="underlined"
                        className="w-1/2 "
                        label="Data"
                        showMonthAndYearPickers
                    />
                    <Input
                        size="lg"
                        variant="underlined"
                        className="w-1/2"
                        label="Czas"
                        type="time"
                    />
                </div>
            </div>
            <Textarea
                size="lg"
                variant="underlined"
                className="w-full"
                label="Opis"
                placeholder="Wprowadź opis wydarzenia"
            />
            <Input
                size="lg"
                isClearable={true}
                variant="underlined"
                className="w-full"
                label="Max liczba uczestników"
                placeholder="Wprowadź liczbę uczestników..."
                type="number"
                min="0"
            />
            <div className="w-full flex justify-between items-baseline space-x-3">
                {selectScenario}
                <Button color="success" href={"/scenarios/new"} as={Link}>
                    Dodaj nowy scenariusz
                </Button>
                <Button color="warning" isDisabled={!selectedScenario}>
                    Edytuj scenariusz
                </Button>
            </div>
            <div className="w-full flex justify-end">
                <div className="flex justify-between space-x-3">
                    <Button color="danger" variant="bordered" size="lg">
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
