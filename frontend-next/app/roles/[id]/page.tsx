"use client";

import {Button, Input, Select, SelectItem} from "@nextui-org/react";
import {useState} from "react";

export default function RoleDisplayPage() {
    const [role, setRole] = useState({
        name: "Example Role Name",
        description: "This is a description of the role.",
        attributes: [
            {name: "Strength", value: 75},
            {name: "Agility", value: 60},
        ],
        querks: ["Brave", "Impulsive"],
    });

    return (
        <div className="space-y-10 border-1 p-3">
            <div className="w-full flex justify-center">
                <p className="text-3xl">Wyświetl postać</p>
            </div>

            <div className="space-y-3">
                <Input
                    label="Nazwa"
                    value={role.name}
                    size="lg"
                    isDisabled={true}
                    variant="underlined"
                />
            </div>

            <div className="space-y-3">
                <Input
                    label="Opis"
                    value={role.description}
                    size="lg"
                    isDisabled={true}
                    variant="underlined"
                />
            </div>

            <div className="border-1 p-3 space-y-3">
                <p className="text-xl font-bold">Atrybuty:</p>
                {role.attributes.map((attribute, index) => (
                    <div
                        key={index}
                        className="w-1/2 flex flex-row space-x-3 items-baseline"
                    >
                        <Select
                            key={index}
                            defaultSelectedKeys={[attribute.name]}
                            isDisabled={true}
                            variant="underlined"
                            className="w-3/4"
                            label="Atrybut"
                        >
                            <SelectItem key={attribute.name} value={attribute.name}>
                                {attribute.name}
                            </SelectItem>
                        </Select>
                        <Input
                            value={attribute.value.toString()}
                            isDisabled={true}
                            label="Wartość"
                            size="sm"
                            variant="underlined"
                            type="number"
                            className="w-1/4"
                        />
                    </div>
                ))}
            </div>

            <div className="border-1 p-3 space-y-3">
                <p className="text-xl font-bold">Querki postaci:</p>
                <div className="w-1/2">
                    <Select
                        placeholder="Wybierz querki"
                        isDisabled={true}
                        variant="underlined"
                        defaultSelectedKeys={role.querks}
                        selectionMode="multiple"
                        className="w-3/4"
                    >
                        {role.querks.map((querk) => (
                            <SelectItem key={querk} value={querk}>
                                {querk}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
            </div>

            <div className="w-full flex justify-end space-x-3">
                <Button color="danger" size="lg">
                    Usuń
                </Button>
                <Button color="warning" size="lg">
                    Edytuj
                </Button>
            </div>
        </div>
    );
}
