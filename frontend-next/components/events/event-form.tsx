"use client";

import {
  Button,
  DatePicker,
  Input,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import {
  getLocalTimeZone,
  today,
  ZonedDateTime,
} from "@internationalized/date";
import { Link } from "@heroui/link";
import { useRouter } from "next/navigation";

import {
  emptyEvent,
  getScenarioById,
  possibleScenarios,
} from "@/services/mock/mock-data";
import { ButtonPanel } from "@/components/buttons/button-pannel";
import ConfirmActionModal from "@/components/buttons/confirm-action-modal";
import EventAssignRolesForm from "@/components/events/event-assign-roles-form";
import { IEvent } from "@/types/event.types";
import eventsService from "@/services/events.service";
import LoadingOverlay from "@/components/general/loading-overlay";
import { isValidEventDate, setTimeOnDate } from "@/utils/date-time";
import {
  showErrorToastWithTimeout,
  showSuccessToastWithTimeout,
} from "@/utils/toast";

export default function EventForm({ initialEvent }: { initialEvent?: IEvent }) {
  const intl = useIntl();
  const router = useRouter();

  const isNewEvent = !initialEvent;
  const [event, setEvent] = useState(
    isNewEvent ? emptyEvent : { ...initialEvent },
  );
  const [eventBeforeChanges, setEventBeforeChanges] = useState(event);
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [showAssignRoles, setShowAssignRoles] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
    setIsSaving(true);

    eventsService
      .save(event)
      .then((response) => {
        if (response.success) {
          showSuccessToastWithTimeout("Event saved successfully");
          router.push("/admin/events");
        } else {
          showErrorToastWithTimeout(response.data);
        }
      })
      .catch((error) => {
        showErrorToastWithTimeout(error);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const handleSaveEditedRole = () => {
    if (!event.id) {
      return;
    }

    setIsSaving(true);
    eventsService
      .update(event.id, event)
      .then((response) => {
        if (response.success) {
          showSuccessToastWithTimeout("Event saved successfully");
          setEvent(response.data);
          setEventBeforeChanges(response.data);
          setIsBeingEdited(false);
        } else {
          showErrorToastWithTimeout(response.data);
        }
      })
      .catch((error) => {
        showErrorToastWithTimeout(error);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const handleConfirmCancel = () => {
    setIsBeingEdited(false);
    setEvent(eventBeforeChanges);
  };

  const handleConfirmDelete = () => {
    if (!event.id) {
      return;
    }

    setIsDeleting(true);
    eventsService
      .delete(event.id)
      .then((response) => {
        if (response.success) {
          showSuccessToastWithTimeout("Event deleted successfully");
          router.push("/admin/events");
        } else {
          showErrorToastWithTimeout(response.data);
        }
      })
      .catch((error) => {
        showErrorToastWithTimeout(error);
      })
      .finally(() => {
        setIsDeleting(false);
      });
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
      handleOnConfirm={() => handleConfirmDelete()}
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
      handleOnConfirm={() => handleConfirmCancel()}
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
      value={event?.name}
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

    return date && !isValidEventDate(date);
  };

  const dateTimeElement = (
    <div className="w-full flex justify-between space-x-3">
      <DatePicker
        className="w-1/2"
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
        value={event?.date}
        variant="underlined"
        onChange={(date) => {
          if (date === null) {
            return;
          }
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
        value={event?.date.hour + ":" + event?.date.minute}
        variant="underlined"
        onChange={(e) => {
          handleTouched("date");
          const dateWithNewTime = setTimeOnDate(event.date, e.target.value);

          setEvent({
            ...event,
            date: dateWithNewTime,
          });
        }}
      />
    </div>
  );

  const descriptionElement = (
    <Textarea
      isRequired
      className="w-full"
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
      value={event?.description}
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
        selectedKeys={event?.scenarioId ? [String(event.scenarioId)] : []}
        size="lg"
        variant="underlined"
        onChange={(e) => {
          const scenarioId = e.target.value;
          const scenario = getScenarioById(scenarioId); //TODO: fetch using API

          setEvent({
            ...event,
            scenarioId: scenarioId,
            assignedRoles: scenario.roles.map((role) => ({
              scenarioRoleId: role.id,
              assignedEmail: "",
            })),
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
        onSaveClicked={() => handleSaveEditedRole()}
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

  const form = (
    <div className="w-full flex justify-center">
      <div className="sm:w-4/5 w-full space-y-3 border-1 p-3">
        {titleElement}
        {nameElement}
        {dateTimeElement}
        {descriptionElement}
        {scenarioElement}
        {assignRolesElement}
        {isNewEvent ? saveButton : actionButtons}
      </div>
    </div>
  );

  return (
    <LoadingOverlay
      isLoading={isSaving || isDeleting}
      label={isSaving ? "Saving event..." : "Deleting event..."}
    >
      {form}
    </LoadingOverlay>
  );
}
