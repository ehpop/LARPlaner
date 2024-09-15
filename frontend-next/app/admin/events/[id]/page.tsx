"use client";

import {Button, DatePicker, Input, Select, SelectItem, Textarea,} from "@nextui-org/react";
import {useEffect, useState} from "react";
import {getLocalTimeZone, now} from "@internationalized/date";

export default function EventPage({params}: any) {
    const event = {
        id: params.id,
        title: `Wydarzenie #${params.id}`,
        date: now(getLocalTimeZone()),
        time: "12:00",
        description: "Przykładowy opis wydarzenia.",
        maxParticipants: 20,
        scenario: "scenario1",
        scenarios: [
            {key: "scenario1", name: "Scenario 1"},
            {key: "scenario2", name: "Scenario 2"},
            {key: "scenario3", name: "Scenario 3"},
        ],
    };

    const [isBeingEdited, setIsBeingEdited] = useState(false);
    const [selectedScenario, setSelectedScenario] = useState(event.scenario);

    useEffect(() => {
        setSelectedScenario(event.scenario);
    }, [event]);

    const selectScenario = (
        <Select
            className="w-1/2"
            defaultSelectedKeys={[selectedScenario]}
            isDisabled={!isBeingEdited}
            label="Scenariusz"
            placeholder="Wybierz scenariusz..."
            size="lg"
            variant="underlined"
        >
            {event.scenarios.map((scenario) => (
                <SelectItem key={scenario.key} value={scenario.name}>
                    {scenario.name}
                </SelectItem>
            ))}
        </Select>
    );

    return (
        <div className="w-full items-center">
            <div className="space-y-10 border-1 p-3">
                <div className="w-full flex justify-center">
                    <p className="text-3xl" id="view-event-modal">
                        {event.title}
                    </p>
                </div>
                <Input
                    className="w-full"
                    defaultValue={event.title}
                    isDisabled={!isBeingEdited}
                    label="Nazwa"
                    size="lg"
                    variant="underlined"
                />
                <div className="w-full">
                    <div className="flex justify-between space-x-3">
                        <DatePicker
                            className="w-1/2"
                            defaultValue={event.date}
                            granularity="day"
                            isDisabled={!isBeingEdited}
                            label="Data"
                            size="lg"
                            variant="underlined"
                        />
                        <Input
                            className="w-1/2"
                            defaultValue={event.time}
                            isDisabled={!isBeingEdited}
                            label="Czas"
                            size="lg"
                            type="time"
                            variant="underlined"
                        />
                    </div>
                </div>
                <Textarea
                    className="w-full"
                    defaultValue={event.description}
                    isDisabled={!isBeingEdited}
                    label="Opis"
                    size="lg"
                    variant="underlined"
                />
                <Input
                    className="w-full"
                    defaultValue={event.maxParticipants.toString()}
                    isDisabled={!isBeingEdited}
                    label="Max liczba uczestników"
                    size="lg"
                    type="number"
                    variant="underlined"
                />
                <div className="w-full flex justify-between items-baseline space-x-3">
                    {selectScenario}
                    <Button
                        color="success"
                        href={"/scenarios/new"}
                        isDisabled={!isBeingEdited}
                    >
                        Dodaj nowy scenariusz
                    </Button>
                    <Button color="warning" isDisabled={!isBeingEdited}>
                        Edytuj scenariusz
                    </Button>
                </div>
                <div className="w-full flex justify-end">
                    <div className="flex justify-between space-x-3">
                        <Button color="danger" size="lg">
                            Usuń
                        </Button>
                        <Button
                            color="warning"
                            size="lg"
                            onClick={() => setIsBeingEdited(true)}
                        >
                            Edytuj
                        </Button>
                        {isBeingEdited && (
                            <Button
                                color="success"
                                size="lg"
                                onClick={() => setIsBeingEdited(false)}
                            >
                                Zapisz
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
