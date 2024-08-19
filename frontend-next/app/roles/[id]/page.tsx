"use client";

import {Button} from "@nextui-org/react";
import {useState} from "react";

export default function RoleDisplayPage() {
    // Assuming this state represents the role details captured from the form
    const [role, setRole] = useState({
        name: "Example Role Name",
        description: "This is a description of the role.",
        attributes: [
            {key: "Strength", value: 75},
            {key: "Agility", value: 60}
        ],
        querks: ["Brave", "Impulsive"]
    });

    return (
        <div className="space-y-10 border-1 p-3">
            <div className="w-full flex justify-center">
                <p className="text-3xl">Wyświetl postać</p>
            </div>
            <div className="space-y-3">
                <p className="text-xl font-bold">Nazwa:</p>
                <p>{role.name}</p>
            </div>
            <div className="space-y-3">
                <p className="text-xl font-bold">Opis:</p>
                <p>{role.description}</p>
            </div>
            <div className="border-1 p-3 space-y-3">
                <p className="text-xl font-bold">Atrybuty:</p>
                <ul className="list-disc list-inside">
                    {role.attributes.map((attribute, index) => (
                        <li key={index}>
                            <span className="font-semibold">{attribute.key}: </span>
                            <span>{attribute.value}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="border-1 p-3 space-y-3">
                <p className="text-xl font-bold">Querki postaci:</p>
                <ul className="list-disc list-inside">
                    {role.querks.map((querk, index) => (
                        <li key={index}>{querk}</li>
                    ))}
                </ul>
            </div>
            <div className="w-full flex justify-end">
                <div className="flex justify-between space-x-3">
                    <Button color="danger" size="lg">
                        Usuń
                    </Button>
                    <Button color="warning" size="lg">
                        Edytuj
                    </Button>
                </div>
            </div>
        </div>
    );
}
