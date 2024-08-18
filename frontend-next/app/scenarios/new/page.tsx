"use client";

import {Button, Input, Select, SelectItem, Textarea} from "@nextui-org/react";
import {useState} from "react";
import MultiSelect from "@/components/multi-select";

const roles: string[] = [
    "mag",
    "wojownik",
    "złodziej",
    "czarodziej",
    "kapłan",
]

export default function ScenariosPage() {
    const [countRoles, setCountRoles] = useState(2);

    return (
        <div className="space-y-10 border-1 p-3">
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
            <div className="w-full border-1 p-3 h-1/2 space-y-3">
                <p>Dodaj postaci do scenariusza</p>
                <MultiSelect roles={roles}/>
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
