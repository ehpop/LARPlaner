"use client";

import {Button, DatePicker, Input, Textarea} from "@nextui-org/react";

export default function Home() {
    return <div className="w-full items-center">
        <div
            className="border-small px-5 py-5 my-5 rounded-small border-default-200 dark:border-default-100">
            <p>
                Welcome to the <strong>LARPlaner</strong> app!
            </p>
            <div className="space-y-10">
                <p id="add-event-modal" className="text-3xl">
                    Dodaj wydarzenie
                </p>
                <Input
                    isClearable={true}
                    variant="underlined"
                    className="w-full"
                    label="Nazwa"
                    placeholder="Wprowadź nazwę wydarzenia..."
                />
                <div className="w-full">
                    <div className="flex justify-between space-x-3">
                        <Input
                            variant="underlined"
                            className="w-1/2"
                            label="Czas"
                            type="time"
                        />
                        <DatePicker
                            variant="underlined"
                            className="w-1/2"
                            labelPlacement="inside"
                            label="Data"
                        />
                    </div>
                </div>
                <Textarea
                    variant="underlined"
                    className="w-full"
                    label="Opis"
                    placeholder="Wprowadź opis wydarzenia"
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
    </div>

}
