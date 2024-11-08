"use client";

import {
  Button,
  DatePicker,
  Input,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import {
  fromDate,
  getLocalTimeZone,
  today,
  ZonedDateTime,
} from "@internationalized/date";
import { Link } from "@nextui-org/link";

import {
  emptyEvent,
  getEvent,
  possibleScenarios,
} from "@/services/mock/mock-data";
import { ButtonPanel } from "@/components/buttons/button-pannel";
import ConfirmActionModal from "@/components/buttons/confirm-action-modal";
import EventAssignRolesForm from "@/components/events/event-assign-roles-form";
import { IEvent } from "@/types/event.types";

export default function EventForm({ eventId }: { eventId?: number }) {
  const intl = useIntl();

  const isNewEvent = !eventId;
  const [event, setEvent] = useState(
    !isNewEvent ? getEvent(eventId) : emptyEvent,
  );
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [showAssignRoles, setShowAssignRoles] = useState(true);

  const [touched, setTouched] = useState({
    name: false,
    description: false,
    scenarioId: false,
    date: false,
  });

  const handleTouched = (key: keyof typeof touched) => {
    if (touched[key]) {
      return;
    }
    setTouched({ ...touched, [key]: true });
  };

  const isInvalidProperty = (name: keyof typeof touched) => {
    if (!touched[name]) {
      return false;
    }

    return (
      event[name as keyof IEvent] === undefined ||
      event[name as keyof IEvent] === "" ||
      event[name as keyof IEvent] === null
    );
  };

  const handleSave = () => {
    alert("Saving event: " + JSON.stringify(event));
  };

  const {
    onOpen: onOpenDelete,
    isOpen: isOpenDelete,
    onOpenChange: onOpenChangeDelete,
  } = useDisclosure();
  const {
    onOpen: onOpenCancel,
    isOpen: isOpenCancel,
    onOpenChange: onOpenChangeCancel,
  } = useDisclosure();

  const confirmDelete = (
    <ConfirmActionModal
      handleOnConfirm={() => {
        alert("Event will be deleted");
      }}
      isOpen={isOpenDelete}
      prompt={intl.formatMessage({
        id: "events.id.page.delete",
        defaultMessage:
          "Are you sure you want to delete this event? This action will not be reversible.",
      })}
      title={intl.formatMessage({
        id: "events.id.page.deleteTitle",
        defaultMessage: "Do you want to delete this event?",
      })}
      onOpenChange={onOpenChangeDelete}
    />
  );

  const confirmCancel = (
    <ConfirmActionModal
      handleOnConfirm={() => {
        setIsBeingEdited(false);
      }}
      isOpen={isOpenCancel}
      prompt={intl.formatMessage({
        id: "events.id.page.cancelEdit",
        defaultMessage:
          "Are you sure you want to cancel your changes? This action will not be reversible.",
      })}
      title={intl.formatMessage({
        id: "event.id.page.cancelEditTitle",
        defaultMessage: "Do you want to cancel added changes?",
      })}
      onOpenChange={onOpenChangeCancel}
    />
  );

  const nameElement = (
    <Input
      isRequired
      className="w-full"
      defaultValue={event?.name}
      errorMessage={intl.formatMessage({
        id: "events.page.display.nameError",
        defaultMessage: "Name cannot be empty",
      })}
      isDisabled={!(isNewEvent || isBeingEdited)}
      isInvalid={isInvalidProperty("name")}
      label={intl.formatMessage({
        id: "events.page.display.name",
        defaultMessage: "Name",
      })}
      size="lg"
      variant="underlined"
      onChange={(e) => {
        handleTouched("name");

        setEvent({
          ...event,
          name: e.target.value,
        });
      }}
    />
  );

  const isInvalidDate = (date: ZonedDateTime | undefined) => {
    if (!touched.date) {
      return false;
    }

    if (
      date === undefined ||
      date.hour === undefined ||
      date.minute === undefined ||
      date.day === undefined ||
      date.month === undefined ||
      date.year === undefined
    ) {
      return true;
    }

    return date.compare(fromDate(new Date(), date.timeZone)) < 0;
  };

  const dateTimeElement = (
    <div className="w-full flex justify-between space-x-3">
      <DatePicker
        className="w-1/2"
        defaultValue={event?.date}
        errorMessage={intl.formatMessage({
          id: "events.page.display.dateError",
          defaultMessage: "Date cannot be empty and must be in the future",
        })}
        granularity="day"
        isDisabled={!(isNewEvent || isBeingEdited)}
        isInvalid={isInvalidDate(event?.date)}
        label={intl.formatMessage({
          id: "events.page.display.date",
          defaultMessage: "Date",
        })}
        minValue={today(getLocalTimeZone())}
        size="lg"
        variant="underlined"
        onChange={(date) => {
          handleTouched("date");

          const newDate = event.date.set({
            year: date.year,
            month: date.month,
            day: date.day,
          });

          setEvent({
            ...event,
            date: newDate,
          });
        }}
      />
      <Input
        className="w-1/2"
        defaultValue={event?.date.hour + ":" + event?.date.minute}
        errorMessage={intl.formatMessage({
          id: "events.page.display.timeError",
          defaultMessage: "Time cannot be empty and must be in the future",
        })}
        isDisabled={!(isNewEvent || isBeingEdited)}
        isInvalid={isInvalidDate(event?.date)}
        label={intl.formatMessage({
          id: "events.page.display.time",
          defaultMessage: "Time",
        })}
        size="lg"
        type="time"
        variant="underlined"
        onChange={(e) => {
          handleTouched("date");
          const time = e.target.value;
          const [hour, minute] = !time.match(/^[0-9]{2}:[0-9]{2}$/)
            ? [0, 0]
            : time.split(":");
          const newDate = event.date.set({
            hour: Number(hour),
            minute: Number(minute),
          });

          setEvent({
            ...event,
            date: newDate,
          });
        }}
      />
    </div>
  );

  const descriptionElement = (
    <Textarea
      isRequired
      className="w-full"
      defaultValue={event?.description}
      errorMessage={intl.formatMessage({
        id: "events.page.display.descriptionError",
        defaultMessage: "Description cannot be empty",
      })}
      isDisabled={!(isNewEvent || isBeingEdited)}
      isInvalid={isInvalidProperty("description")}
      label={intl.formatMessage({
        id: "events.page.display.description",
        defaultMessage: "Description",
      })}
      size="lg"
      variant="underlined"
      onChange={(e) => {
        handleTouched("description");

        setEvent({
          ...event,
          description: e.target.value,
        });
      }}
    />
  );

  const scenarioElement = (
    <div className="w-full flex flex-row items-baseline space-x-3">
      <Select
        isRequired
        defaultSelectedKeys={
          event?.scenarioId ? [String(event.scenarioId)] : []
        }
        errorMessage={intl.formatMessage({
          id: "events.page.display.scenarioError",
          defaultMessage: "Scenario cannot be empty",
        })}
        isDisabled={!(isNewEvent || isBeingEdited)}
        isInvalid={isInvalidProperty("scenarioId")}
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
        onChange={(e) => {
          const scenarioId =
            e.target.value !== "" ? Number(e.target.value) : null;

          setEvent({
            ...event,
            scenarioId: scenarioId,
            assignedRoles: [],
          });
          setTouched({
            ...touched,
            scenarioId: true,
          });
        }}
      >
        {possibleScenarios.map((scenario) => (
          <SelectItem key={String(scenario.id)}>{scenario.name}</SelectItem>
        ))}
      </Select>
      <div className="flex flex-row sm:space-x-3 space-x-1">
        <Button
          as={Link}
          color="success"
          href={"/admin/scenarios/new"}
          isDisabled={!(isNewEvent || isBeingEdited)}
        >
          <FormattedMessage
            defaultMessage="New"
            id="events.page.display.addScenario"
          />
        </Button>
        <Button
          as={Link}
          color="warning"
          href={`/admin/scenarios/${event.scenarioId}`}
          isDisabled={!((isNewEvent || isBeingEdited) && event.scenarioId)}
        >
          <FormattedMessage
            defaultMessage="Edit"
            id="events.page.display.editScenario"
          />
        </Button>
      </div>
    </div>
  );

  const actionButtons = (
    <div className="w-full flex justify-end">
      <ButtonPanel
        isBeingEdited={isBeingEdited}
        onCancelEditClicked={() => {
          onOpenCancel();
        }}
        onDeleteClicked={() => {
          onOpenDelete();
        }}
        onEditClicked={() => {
          setIsBeingEdited(true);
        }}
        onSaveClicked={() => {
          handleSave();
          setIsBeingEdited(false);
        }}
      />
      {confirmCancel}
      {confirmDelete}
    </div>
  );

  const saveButton = (
    <div className="w-full flex justify-end">
      <Button
        color="success"
        size="lg"
        onPress={() => {
          handleSave();
        }}
      >
        <FormattedMessage
          defaultMessage="Save"
          id="events.page.new.addEvent.save"
        />
      </Button>
    </div>
  );

  const assignRolesElement = (
    <div className="w-full flex flex-col p-3 border-1">
      <div className="w-full flex flex-row justify-between">
        <p className="text-xl">
          <FormattedMessage
            defaultMessage="Assign roles"
            id="events.page.display.tags"
          />
        </p>
        <Button
          size="sm"
          variant="bordered"
          onPress={() => setShowAssignRoles(!showAssignRoles)}
        >
          {showAssignRoles ? "-" : "+"}
        </Button>
      </div>
      {showAssignRoles && (
        <EventAssignRolesForm
          event={event}
          isBeingEdited={isNewEvent || isBeingEdited}
          setEvent={setEvent}
        />
      )}
    </div>
  );

  const titleElement = (
    <div className="w-full flex justify-center">
      <p className="text-3xl" id="view-event-modal">
        {event.id ? (
          <FormattedMessage
            defaultMessage='Event "{eventName}"'
            id="event.form.title.edit"
            values={{ eventName: event.name }}
          />
        ) : (
          <FormattedMessage
            defaultMessage="Add Event"
            id="event.form.title.add.new"
          />
        )}
      </p>
    </div>
  );

  return (
    <div className="sm:w-4/5 w-full space-y-10 border-1 p-3">
      {titleElement}
      {nameElement}
      {dateTimeElement}
      {descriptionElement}
      {scenarioElement}
      {assignRolesElement}
      {isNewEvent ? saveButton : actionButtons}
    </div>
  );
}
