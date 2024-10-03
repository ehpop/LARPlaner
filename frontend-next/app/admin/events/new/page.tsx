"use client";

import { Button, DatePicker, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { useState } from "react";
import { Link } from "@nextui-org/link";
import { FormattedMessage, useIntl } from "react-intl";

export default function NewEventPage() {
  const intl = useIntl();

  const scenarios = [
    { key: "scenario1", name: "Scenario 1" },
    { key: "scenario2", name: "Scenario 2" },
    { key: "scenario3", name: "Scenario 3" }
  ];

  const [selectedScenario, setSelectedScenario] = useState();

  const selectScenario = (
    <Select
      className="w-1/2"
      items={scenarios}
      label={intl.formatMessage({
        id: "events.page.new.addEvent.scenario",
        defaultMessage: "Scenario"
      })}
      placeholder={intl.formatMessage({
        id: "events.page.new.addEvent.selectScenario",
        defaultMessage: "Select a scenario..."
      })}
      size="lg"
      variant="underlined"
      onSelectionChange={setSelectedScenario}
    >
      {(scenario) => (
        <SelectItem key={scenario.key}>{scenario.name}</SelectItem>
      )}
    </Select>
  );

  return (
    <div className="space-y-10 border-1 p-3">
      <div className="w-full flex justify-center">
        <p className="text-3xl" id="add-event-modal">
          <FormattedMessage
            defaultMessage="Add Event"
            id="events.page.new.addEvent.title"
          />
        </p>
      </div>
      <Input
        className="w-full"
        isClearable={true}
        label={intl.formatMessage({
          id: "events.page.new.addEvent.name",
          defaultMessage: "Name"
        })}
        placeholder={intl.formatMessage({
          id: "events.page.new.addEvent.namePlaceholder",
          defaultMessage: "Enter event name..."
        })}
        size="lg"
        variant="underlined"
      />
      <div className="w-full">
        <div className="flex justify-between space-x-3">
          <DatePicker
            showMonthAndYearPickers
            className="w-1/2"
            label={intl.formatMessage({
              id: "events.page.new.addEvent.date",
              defaultMessage: "Date"
            })}
            size="lg"
            variant="underlined"
          />
          <Input
            className="w-1/2"
            label={intl.formatMessage({
              id: "events.page.new.addEvent.time",
              defaultMessage: "Time"
            })}
            size="lg"
            type="time"
            variant="underlined"
          />
        </div>
      </div>
      <Textarea
        className="w-full"
        label={intl.formatMessage({
          id: "events.page.new.addEvent.description",
          defaultMessage: "Description"
        })}
        placeholder={intl.formatMessage({
          id: "events.page.new.addEvent.descriptionPlaceholder",
          defaultMessage: "Enter event description..."
        })}
        size="lg"
        variant="underlined"
      />
      <Input
        className="w-full"
        isClearable={true}
        label={intl.formatMessage({
          id: "events.page.new.addEvent.maxParticipants",
          defaultMessage: "Max participants"
        })}
        min="0"
        placeholder={intl.formatMessage({
          id: "events.page.new.addEvent.maxParticipantsPlaceholder",
          defaultMessage: "Enter number of participants..."
        })}
        size="lg"
        type="number"
        variant="underlined"
      />
      <div className="w-full flex justify-between items-baseline space-x-3">
        {selectScenario}
        <Button as={Link} color="success" href={"/admin/scenarios/new"}>
          <FormattedMessage
            defaultMessage="Add new scenario"
            id="events.page.new.addEvent.addScenario"
          />
        </Button>
        <Button color="warning" isDisabled={!selectedScenario}>
          <FormattedMessage
            defaultMessage="Edit scenario"
            id="events.page.new.addEvent.editScenario"
          />
        </Button>
      </div>
      <div className="w-full flex justify-end">
        <div className="flex justify-between space-x-3">
          <Button color="danger" size="lg" variant="bordered">
            <FormattedMessage
              defaultMessage="Cancel"
              id="events.page.new.addEvent.cancel"
            />
          </Button>
          <Button color="success" size="lg">
            <FormattedMessage
              defaultMessage="Save"
              id="events.page.new.addEvent.save"
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
