"use client";

import {Button, Input, Textarea} from "@nextui-org/react";
import {useState} from "react";

import MultiSelect from "@/components/multi-select";
import ItemCreator from "@/components/scenarios/item-creator";

const roles: string[] = ["mag", "wojownik", "złodziej", "czarodziej", "kapłan"];

const skills: string[] = ["skill1", "skill2", "skill3", "skill4", "skill5"];

const querks: string[] = ["querk1", "querk2", "querk3", "querk4"];

export default function ScenariosPage() {
    const [countRoles, setCountRoles] = useState(2);
    const [showSection, setShowSection] = useState(true);

    return (
        <div className="space-y-10 border-1 p-3 min-h-full">
            <div className="w-full flex justify-center">
                <p className="text-3xl" id="add-event-modal">
                    Dodaj scenariusz
                </p>
            </div>
            <Input
                className="w-full"
                isClearable={true}
                label="Nazwa"
                placeholder="Wprowadź nazwę scenariusza..."
                size="lg"
                variant="underlined"
            />
            <Textarea
                className="w-full"
                label="Opis"
                placeholder="Wprowadź opis scenariusza"
                size="lg"
                variant="underlined"
            />
            <div className="w-full border-1 p-3 space-y-3">
                <p>Dodaj postaci do scenariusza</p>
                <MultiSelect
                    addButtonLabel="Dodaj postać"
                    counterLabel="Liczba postaci"
                    defaultCounterValue="1"
                    minCounterValue={1}
                    options={roles}
                    removeButtonLabel="Usuń postać"
                    selectLabel="Wybierz postać"
                />
            </div>
            <div className="w-full border-1 p-3 space-y-3">
                <div className="w-full flex flex-row justify-between">
                    <p>Dodaj przedmioty do scenariusza</p>
                    <Button
                        size="sm"
                        variant="bordered"
                        onClick={() => setShowSection(!showSection)}
                    >
                        {showSection ? "-" : "+"}
                    </Button>
                </div>
                <div className={showSection ? "" : "hidden"}>
                    <ItemCreator querks={querks} skills={skills}/>
                </div>
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
