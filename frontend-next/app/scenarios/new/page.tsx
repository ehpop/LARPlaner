"use client";

import {Button, Input, Select, SelectItem, Textarea} from "@nextui-org/react";
import {useState} from "react";
import MultiSelect from "@/components/multi-select";
import ItemCreator from "@/components/scenarios/item-creator";

const roles: string[] = [
    "mag",
    "wojownik",
    "złodziej",
    "czarodziej",
    "kapłan",
]

const skills: string[] = [
    "skill1",
    "skill2",
    "skill3",
    "skill4",
    "skill5",
]

const querks: string[] = [
    "querk1",
    "querk2",
    "querk3",
    "querk4",
]

export default function ScenariosPage() {
    const [countRoles, setCountRoles] = useState(2);
    const [showSection, setShowSection] = useState(true);

    return (
        <div className="space-y-10 border-1 p-3 min-h-full">
            <div className="w-full flex justify-center">
                <p id="add-event-modal" className="text-3xl">
                    Dodaj scenariusz
                </p>
            </div>
            <Input
                size="lg"
                isClearable={true}
                variant="underlined"
                className="w-full"
                label="Nazwa"
                placeholder="Wprowadź nazwę scenariusza..."
            />
            <Textarea
                size="lg"
                variant="underlined"
                className="w-full"
                label="Opis"
                placeholder="Wprowadź opis scenariusza"
            />
            <div className="w-full border-1 p-3 space-y-3">
                <p>Dodaj postaci do scenariusza</p>
                <MultiSelect
                    options={roles}
                    addButtonLabel="Dodaj postać"
                    removeButtonLabel="Usuń postać"
                    selectLabel="Wybierz postać"
                    counterLabel="Liczba postaci"
                    minCounterValue={1}
                    defaultCounterValue="1"
                />
            </div>
            <div className="w-full border-1 p-3 space-y-3">
                <div className="w-full flex flex-row justify-between">
                    <p>Dodaj przedmioty do scenariusza</p>
                    <Button
                        onClick={() => setShowSection(!showSection)}
                        size="sm"
                        variant="bordered"
                    >
                        {
                            showSection ? "-" : "+"
                        }
                    </Button>
                </div>
                <div className={showSection ? "" : "hidden"}>
                    <ItemCreator skills={skills} querks={querks}/>
                </div>
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
    )
}
