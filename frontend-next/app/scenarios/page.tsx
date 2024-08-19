"use client";

import {Button, DatePicker, Input, Textarea} from "@nextui-org/react";
import UniqueMultiSelect from "@/components/unique-multi-select";
import MultiSelect from "@/components/multi-select";
import {Link} from "@nextui-org/link";

const scenarios: string[] = [
    "Scenario 1",
    "Scenario 2",
    "Scenario 3",
    "Scenario 4",
]

function ScenariosPage() {
    return (
        <div className="w-full space-y-3">
            <div className="w-full flex justify-center">
                <p className="text-3xl">Scenarios Page</p>
            </div>
            <div className="space-y-10 border-1 p-3">
                <div className="w-full flex flex-col space-y-3">
                    <p id="add-event-modal" className="text-3xl">
                        Scenariusze:
                    </p>
                    <div className="w-full flex flex-col items-center space-y-3">
                        {
                            scenarios.map((scenario) => {
                                return (
                                    <div key={scenario} className="w-1/2 border-1 p-3 space-y-3">
                                        <p>{scenario}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <div className="w-full flex justify-center">
                <Link href={"/scenarios/new"}>
                    <Button color="success" size="lg">
                        Dodaj nowy scenariusz
                    </Button>
                </Link>
            </div>
        </div>

    )
}

export default ScenariosPage;
