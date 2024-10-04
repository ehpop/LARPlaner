"use client";

import {
  Button,
  DatePicker,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { getLocalTimeZone, now } from "@internationalized/date";
import { FormattedMessage, useIntl } from "react-intl"; // Import FormattedMessage and useIntl

export default function EventPage({ params }: any) {
  const intl = useIntl();

  const event = {
    id: params.id,
    title: `Wydarzenie #${params.id}`,
    date: now(getLocalTimeZone()),
    time: "12:00",
    description: "Przykładowy opis wydarzenia.",
    maxParticipants: 20,
    scenario: "scenario1",
    scenarios: [
      { key: "scenario1", name: "Scenario 1" },
      { key: "scenario2", name: "Scenario 2" },
      { key: "scenario3", name: "Scenario 3" },
    ],
  };

  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(event.scenario);

  useEffect(() => {
    setSelectedScenario(event.scenario);
  }, [event]);

  const selectScenario = (
    <Select
      className="w-1/2"
      defaultSelectedKeys={[selectedScenario]}
      isDisabled={!isBeingEdited}
      label={intl.formatMessage({
        id: "events.page.display.scenario",
        defaultMessage: "Scenario",
      })}
      placeholder={intl.formatMessage({
        id: "events.page.display.selectScenario",
        defaultMessage: "Select a scenario...",
      })}
      size="lg"
      variant="underlined"
    >
      {event.scenarios.map((scenario) => (
        <SelectItem key={scenario.key} value={scenario.name}>
          {scenario.name}
        </SelectItem>
      ))}
    </Select>
  );

  return (
    <div className="w-full items-center">
      <div className="space-y-10 border-1 p-3">
        <div className="w-full flex justify-center">
          <p className="text-3xl" id="view-event-modal">
            {event.title}
          </p>
        </div>
        <Input
          className="w-full"
          defaultValue={event.title}
          isDisabled={!isBeingEdited}
          label={intl.formatMessage({
            id: "events.page.display.name",
            defaultMessage: "Name",
          })}
          size="lg"
          variant="underlined"
        />
        <div className="w-full">
          <div className="flex justify-between space-x-3">
            <DatePicker
              className="w-1/2"
              defaultValue={event.date}
              granularity="day"
              isDisabled={!isBeingEdited}
              label={intl.formatMessage({
                id: "events.page.display.date",
                defaultMessage: "Date",
              })}
              size="lg"
              variant="underlined"
            />
            <Input
              className="w-1/2"
              defaultValue={event.time}
              isDisabled={!isBeingEdited}
              label={intl.formatMessage({
                id: "events.page.display.time",
                defaultMessage: "Time",
              })}
              size="lg"
              type="time"
              variant="underlined"
            />
          </div>
        </div>
        <Textarea
          className="w-full"
          defaultValue={event.description}
          isDisabled={!isBeingEdited}
          label={intl.formatMessage({
            id: "events.page.display.description",
            defaultMessage: "Description",
          })}
          size="lg"
          variant="underlined"
        />
        <Input
          className="w-full"
          defaultValue={event.maxParticipants.toString()}
          isDisabled={!isBeingEdited}
          label={intl.formatMessage({
            id: "events.page.display.maxParticipants",
            defaultMessage: "Max participants",
          })}
          size="lg"
          type="number"
          variant="underlined"
        />
        <div className="w-full flex justify-between items-baseline space-x-3">
          {selectScenario}
          <Button
            color="success"
            href={"/admin/scenarios/new"}
            isDisabled={!isBeingEdited}
          >
            <FormattedMessage
              defaultMessage="Add new scenario"
              id="events.page.display.addScenario"
            />
          </Button>
          <Button color="warning" isDisabled={!isBeingEdited}>
            <FormattedMessage
              defaultMessage="Edit scenario"
              id="events.page.display.editScenario"
            />
          </Button>
        </div>
        <div className="w-full flex justify-end">
          <div className="flex justify-between space-x-3">
            <Button color="danger" size="lg">
              <FormattedMessage
                defaultMessage="Delete"
                id="events.page.display.delete"
              />
            </Button>
            <Button
              color="warning"
              size="lg"
              onClick={() => setIsBeingEdited(true)}
            >
              <FormattedMessage
                defaultMessage="Edit"
                id="events.page.display.edit"
              />
            </Button>
            {isBeingEdited && (
              <Button
                color="success"
                size="lg"
                onClick={() => setIsBeingEdited(false)}
              >
                <FormattedMessage
                  defaultMessage="Save"
                  id="events.page.display.save"
                />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}