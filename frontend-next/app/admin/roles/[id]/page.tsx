"use client";

import {Button, Input, Select, SelectItem} from "@nextui-org/react";
import {useState} from "react";

export default function RoleDisplayPage({params}: any) {
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
                <p className="text-3xl">{`Postać ${params.id}`}</p>
            </div>

            <div className="space-y-3">
                <Input
                    isDisabled={true}
                    label="Nazwa"
                    size="lg"
                    value={role.name}
                    variant="underlined"
                />
            </div>

            <div className="space-y-3">
                <Input
                    isDisabled={true}
                    label="Opis"
                    size="lg"
                    value={role.description}
                    variant="underlined"
                />
            </div>

            <div className="border-1 p-3 space-y-3">
                <p className="text-xl font-bold">Atrybuty:</p>
                {role.attributes.map((attribute, index) => (
                    <div
                        key={index}
                        className="lg:w-1/2 w-full flex flex-row space-x-3 items-baseline"
                    >
                        <Select
                            key={index}
                            className="lg:w-3/4 w-full"
                            defaultSelectedKeys={[attribute.name]}
                            isDisabled={true}
                            label="Atrybut"
                            variant="underlined"
                        >
                            <SelectItem key={attribute.name} value={attribute.name}>
                                {attribute.name}
                            </SelectItem>
                        </Select>
                        <Input
                            className="lg:w-1/4 w-1/2"
                            isDisabled={true}
                            label="Wartość"
                            size="sm"
                            type="number"
                            value={attribute.value.toString()}
                            variant="underlined"
                        />
                    </div>
                ))}
            </div>

            <div className="border-1 p-3 space-y-3">
                <p className="text-xl font-bold">Querki postaci:</p>
                <div className="lg:w-1/2 w-full">
                    <Select
                        className="lg:w-3/4 w-full"
                        defaultSelectedKeys={role.querks}
                        isDisabled={true}
                        placeholder="Wybierz querki"
                        selectionMode="multiple"
                        variant="underlined"
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
