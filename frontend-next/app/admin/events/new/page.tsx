"use client";

import {
  Button,
  DatePicker,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { useState } from "react";
import { Link } from "@nextui-org/link";
import { FormattedMessage, useIntl } from "react-intl";

export default function NewEventPage() {
  const intl = useIntl();

  const scenarios = [
    { key: "scenario1", name: "Scenario 1" },
    { key: "scenario2", name: "Scenario 2" },
    { key: "scenario3", name: "Scenario 3" },
  ];

  const [selectedScenario, setSelectedScenario] = useState();

  const nameInput = (
    <Input
      className="w-full"
      isClearable={true}
      label={intl.formatMessage({
        id: "events.page.new.addEvent.name",
        defaultMessage: "Name",
      })}
      placeholder={intl.formatMessage({
        id: "events.page.new.addEvent.namePlaceholder",
        defaultMessage: "Enter event name...",
      })}
      size="lg"
      variant="underlined"
    />
  );

  const dateInput = (
    <DatePicker
      showMonthAndYearPickers
      className="w-1/2"
      label={intl.formatMessage({
        id: "events.page.new.addEvent.date",
        defaultMessage: "Date",
      })}
      size="lg"
      variant="underlined"
    />
  );

  const timeInput = (
    <Input
      className="w-1/2"
      label={intl.formatMessage({
        id: "events.page.new.addEvent.time",
        defaultMessage: "Time",
      })}
      size="lg"
      type="time"
      variant="underlined"
    />
  );
  const descriptionInput = (
    <Textarea
      className="w-full"
      label={intl.formatMessage({
        id: "events.page.new.addEvent.description",
        defaultMessage: "Description",
      })}
      placeholder={intl.formatMessage({
        id: "events.page.new.addEvent.descriptionPlaceholder",
        defaultMessage: "Enter event description...",
      })}
      size="lg"
      variant="underlined"
    />
  );

  const participantsInput = (
    <Input
      className="sm:w-1/2 w-full"
      isClearable={true}
      label={intl.formatMessage({
        id: "events.page.new.addEvent.maxParticipants",
        defaultMessage: "Max participants",
      })}
      min="0"
      placeholder={intl.formatMessage({
        id: "events.page.new.addEvent.maxParticipantsPlaceholder",
        defaultMessage: "Number of participants...",
      })}
      size="lg"
      type="number"
      variant="underlined"
    />
  );

  const selectScenario = (
    <Select
      className="sm:w-1/2 w-1/4"
      items={scenarios}
      label={intl.formatMessage({
        id: "events.page.new.addEvent.scenario",
        defaultMessage: "Scenario",
      })}
      placeholder={intl.formatMessage({
        id: "events.page.new.addEvent.selectScenario",
        defaultMessage: "Select a scenario...",
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
    <div className="w-full h-full flex justify-center">
      <div className="space-y-10 border-1 p-3 sm:w-3/4 w-full">
        <div className="w-full flex justify-center">
          <p className="text-3xl" id="add-event-modal">
            <FormattedMessage
              defaultMessage="Add Event"
              id="events.page.new.addEvent.title"
            />
          </p>
        </div>
        {nameInput}
        <div className="w-full">
          <div className="flex justify-between space-x-3">
            {dateInput}
            {timeInput}
          </div>
        </div>
        {descriptionInput}
        {participantsInput}
        <div className="sm:w-11/12 w-full flex justify-start space-x-3 items-baseline">
          {selectScenario}
          <div className="sm:space-x-3 space-x-1">
            <Button as={Link} color="success" href={"/admin/scenarios/new"}>
              <FormattedMessage
                defaultMessage="New"
                id="events.page.new.addEvent.addScenario"
              />
            </Button>
            <Button color="warning" isDisabled={!selectedScenario}>
              <FormattedMessage
                defaultMessage="Edit"
                id="events.page.new.addEvent.editScenario"
              />
            </Button>
          </div>
        </div>
        <div className="w-full flex justify-end">
          <div className="flex justify-between space-x-3">
            <Button color="success" size="lg">
              <FormattedMessage
                defaultMessage="Save"
                id="events.page.new.addEvent.save"
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
