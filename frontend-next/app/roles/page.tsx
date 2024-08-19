"use client";

import {Link} from "@nextui-org/link";
import {Button} from "@nextui-org/react";

const roles = [
    "mag",
    "wojownik",
    "złodziej",
    "czarodziej",
    "kapłan",
]

export default function RolesPage() {
    return (
        <div className="w-full space-y-3">
            <div className="w-full flex justify-center">
                <p className="text-3xl">Roles Page</p>
            </div>
            <div className="space-y-10 border-1 p-3">
                <div className="w-full flex flex-col space-y-3">
                    <p id="add-event-modal" className="text-3xl">
                        Role:
                    </p>
                    <div className="w-full flex flex-col items-center space-y-3">
                        {
                            roles.map((role) => {
                                return (
                                    <Link href={"/roles/1"} isBlock className="w-1/2 border-1 p-3 space-y-3">
                                        <p>{role}</p>
                                    </Link>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <div className="w-full flex justify-center">
                <Link href={"/roles/new"}>
                    <Button color="success" size="lg">
                        Dodaj nowa role
                    </Button>
                </Link>
            </div>
        </div>
    );
}
