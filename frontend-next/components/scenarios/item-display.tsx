import {Button, Input, Select, SelectItem} from "@nextui-org/react";
import React from "react";

const Item = ({item}: any) => {
    const [showItem, setShowItem] = React.useState(true);

    return <div className="w-full flex flex-col border-1 p-3 space-y-3">
        <div className="w-full flex flex-row justify-between">
            <Input
                size="sm"
                variant="underlined"
                className="w-1/4"
                label="Nazwa przedmiotu"
                value={item.name}
                isDisabled={true}
            />
            <Button
                onClick={() => setShowItem(!showItem)}
                size="sm"
                variant="bordered"
            >
                {showItem ? "-" : "+"}
            </Button>
        </div>
        {showItem && (
            <>
                <Input
                    size="sm"
                    variant="underlined"
                    className="w-full"
                    label="Opis przedmiotu"
                    value={item.description}
                    isDisabled={true}
                />
                <div className="w-full border-1 p-3 space-y-3">
                    <p>Umiejętności wymagane do użycia przedmiotu</p>
                    {
                        item.skills.map((skill: any, index: number) => (
                            <div className="w-1/2 flex flex-row space-x-3 items-baseline">
                                <Select
                                    key={index}
                                    className="w-3/4"
                                    label="Umiejętność"
                                    placeholder="Wybierz umiejętność"
                                    variant="underlined"
                                    isDisabled={true}
                                    defaultSelectedKeys={[skill.name]}
                                >
                                    <SelectItem key={skill.name} value={skill.name}>
                                        {skill.name}
                                    </SelectItem>
                                </Select>
                                <Input
                                    value={skill.level}
                                    size="sm"
                                    isDisabled={true}
                                    className="w-1/4"
                                    label="Poziom"
                                    type="number"
                                    variant="underlined"
                                    min="1"
                                    max="10"
                                />
                            </div>
                        ))
                    }
                </div>
                {item.querks && (
                    <div className="w-full border-1 p-3 space-y-3">
                        <p>Wymagane querki</p>
                        <div className="w-1/2">
                            <Select
                                className="w-3/4"
                                placeholder="Wybierz querki"
                                isDisabled={true}
                                defaultSelectedKeys={item.querks}
                                selectionMode="multiple"
                                variant="underlined"
                            >
                                {item.querks.map((querk: string) => (
                                    <SelectItem key={querk} value={querk}>
                                        {querk}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                    </div>
                )}
            </>
        )}
    </div>
}

const ItemDisplay = ({items}: any) => {
    return (
        <>
            {
                items.map((item: any, index: number) => (
                    <Item key={index} item={item}/>
                ))
            }
        </>
    );
};

export default ItemDisplay;
