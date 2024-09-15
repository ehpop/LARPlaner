"use client";

import {Button, DatePicker, Input, Textarea} from "@nextui-org/react";

export default function Home() {
    return (
        <div className="w-full items-center">
            <div className="border-small px-5 py-5 my-5 rounded-small border-default-200 dark:border-default-100">
                <p>
                    Welcome to the <strong>LARPlaner</strong> app!
                </p>
                <div className="space-y-10">
                    <p className="text-3xl" id="add-event-modal">
                        Dodaj wydarzenie
                    </p>
                    <Input
                        className="w-full"
                        isClearable={true}
                        label="Nazwa"
                        placeholder="Wprowadź nazwę wydarzenia..."
                        variant="underlined"
                    />
                    <div className="w-full">
                        <div className="flex justify-between space-x-3">
                            <Input
                                className="w-1/2"
                                label="Czas"
                                type="time"
                                variant="underlined"
                            />
                            <DatePicker
                                className="w-1/2"
                                label="Data"
                                labelPlacement="inside"
                                variant="underlined"
                            />
                        </div>
                    </div>
                    <Textarea
                        className="w-full"
                        label="Opis"
                        placeholder="Wprowadź opis wydarzenia"
                        variant="underlined"
                    />
                    <Input
                        className="w-full"
                        isClearable={true}
                        label="Max liczba uczestników"
                        min="0"
                        placeholder="Wprowadź liczbę uczestników..."
                        type="number"
                        variant="underlined"
                    />
                    <div className="w-full flex justify-between items-baseline space-x-3">
                        <Button color="success">Dodaj nowy scenariusz</Button>
                        <Button color="warning">Edytuj scenariusz</Button>
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
            </div>
        </div>
    );
}
