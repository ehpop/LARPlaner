"use client";

import {Link} from "@nextui-org/link";
import {Button} from "@nextui-org/react";
import RolesDisplay from "@/components/roles/roles-display";

const roles = [
    "mag",
    "wojownik",
    "złodziej",
    "czarodziej",
    "kapłan",
    "łucznik",
    "tancerz ostrzy",
    "druid",
    "bard",
    "szaman",
];

export default function RolesPage() {
    return (
        <div className="w-full space-y-3">
            <div className="w-full flex justify-center">
                <p className="text-3xl">Roles Page</p>
            </div>
            <RolesDisplay rolesList={roles} title={"Rola"} canAddNewRole={true}/>
        </div>
    );
}
