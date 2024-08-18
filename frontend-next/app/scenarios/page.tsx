"use client";

import {Button, DatePicker, Input, Textarea} from "@nextui-org/react";
import UniqueMultiSelect from "@/components/unique-multi-select";
import MultiSelect from "@/components/multi-select";

const roles: string[] = [
    "mag",
    "wojownik",
    "złodziej",
    "czarodziej",
    "kapłan",
]

function ScenariosPage() {
    return (
        <div className="w-full space-y-3">
            <div className="w-full flex justify-center">
                <p className="text-3xl">Scenarios Page</p>
            </div>
            <div className="space-y-10 border-1 p-3">
                <div className="w-full flex justify-center">
                    <p id="add-event-modal" className="text-3xl">
                        Dodaj scenariusz
                    </p>
                </div>
                <Input
                    isClearable={true}
                    variant="underlined"
                    className="w-full"
                    label="Nazwa"
                    placeholder="Wprowadź nazwę scenariusza..."
                />
                <Textarea
                    variant="underlined"
                    className="w-full"
                    label="Opis"
                    placeholder="Wprowadź opis scenariusza"
                />
                <Input
                    isClearable={true}
                    variant="underlined"
                    className="w-full"
                    label="Max liczba uczestników"
                    placeholder="Wprowadź liczbę uczestników..."
                    type="number"
                    min="0"
                />
                <div className="w-full flex justify-between items-baseline space-x-3">
                    <Button color="success">
                        Dodaj nowy scenariusz
                    </Button>
                    <Button color="warning">
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
        </div>

    )
}

export default ScenariosPage;
