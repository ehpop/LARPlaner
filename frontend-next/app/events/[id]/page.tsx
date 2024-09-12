"use client";

import {Input, DatePicker, Textarea, Button, Select, SelectItem, CalendarDate} from "@nextui-org/react";
import { useEffect, useState } from "react";
import {getLocalTimeZone, now, parseAbsoluteToLocal} from "@internationalized/date";

export default function EventPage({ params }: any) {
    const event = {
        id: params.id,
        title: `Wydarzenie #${params.id}`,
        date: now(getLocalTimeZone()),
        time: "12:00",
        description: "Przykładowy opis wydarzenia.",
        maxParticipants: 20,
        scenario: "scenario1",
        scenarios: [
            { key: "scenario1", name: "Scenario 1" },
            { key: "scenario2", name: "Scenario 2" },
            { key: "scenario3", name: "Scenario 3" },
        ],
    };

    const [isBeingEdited, setIsBeingEdited] = useState(false);
    const [selectedScenario, setSelectedScenario] = useState(event.scenario);

    useEffect(() => {
        setSelectedScenario(event.scenario);
    }, [event]);

    const selectScenario = (
        <Select
            size="lg"
            variant="underlined"
            label="Scenariusz"
            placeholder="Wybierz scenariusz..."
            className="w-1/2"
            isDisabled={!isBeingEdited}
            defaultSelectedKeys={[selectedScenario]}
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
                    <p id="view-event-modal" className="text-3xl">
                        {event.title}
                    </p>
                </div>
                <Input
                    size="lg"
                    variant="underlined"
                    className="w-full"
                    label="Nazwa"
                    defaultValue={event.title}
                    isDisabled={!isBeingEdited}
                />
                <div className="w-full">
                    <div className="flex justify-between space-x-3">
                        <DatePicker
                            size="lg"
                            granularity="day"
                            variant="underlined"
                            className="w-1/2"
                            label="Data"
                            defaultValue={event.date}
                            isDisabled={!isBeingEdited}
                        />
                        <Input
                            size="lg"
                            variant="underlined"
                            className="w-1/2"
                            label="Czas"
                            type="time"
                            defaultValue={event.time}
                            isDisabled={!isBeingEdited}
                        />
                    </div>
                </div>
                <Textarea
                    size="lg"
                    variant="underlined"
                    className="w-full"
                    label="Opis"
                    defaultValue={event.description}
                    isDisabled={!isBeingEdited}
                />
                <Input
                    size="lg"
                    variant="underlined"
                    className="w-full"
                    label="Max liczba uczestników"
                    defaultValue={event.maxParticipants.toString()}
                    type="number"
                    isDisabled={!isBeingEdited}
                />
                <div className="w-full flex justify-between items-baseline space-x-3">
                    {selectScenario}
                    <Button color="success" href={"/scenarios/new"} isDisabled={!isBeingEdited}>
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
                        <Button color="warning" size="lg" onClick={() => setIsBeingEdited(true)}>
                            Edytuj
                        </Button>
                        {
                            isBeingEdited && (
                                <Button color="success" size="lg" onClick={() => setIsBeingEdited(false)}>
                                    Zapisz
                                </Button>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
