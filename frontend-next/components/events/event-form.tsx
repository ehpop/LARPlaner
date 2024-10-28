"use client";

import {
  Autocomplete,
  AutocompleteItem,
  Button,
  DatePicker,
  Input,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import React, { Key, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
  emptyEvent,
  getEvent,
  getRole,
  getScenario,
  possibleScenarios,
  userEmails,
} from "@/data/mock-data";
import { ButtonPanel } from "@/components/buttons/button-pannel";
import ConfirmActionModal from "@/components/buttons/confirm-action-modal";

export default function EventForm({ eventId }: { eventId?: number }) {
  const intl = useIntl();

  const isNewEvent = !eventId;
  const [event, setEvent] = useState(
    !isNewEvent ? getEvent(eventId) : emptyEvent,
  );

  const [isBeingEdited, setIsBeingEdited] = useState(false);
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

  const assignNewRoleOrUpdateOldOne = (
    assignedRoles: any,
    roleId: number,
    email: string,
  ) => {
    const newAssignedRoles = assignedRoles.filter(
      (assignedRole: any) => assignedRole.scenarioRoleId !== roleId,
    );

    newAssignedRoles.push({ scenarioRoleId: roleId, assignedEmail: email });

    return newAssignedRoles;
  };
  const handleRoleAssignment = (roleId: number, key: Key | null) => {
    if (key !== null) {
      setEvent({
        ...event,
        assignedRoles: assignNewRoleOrUpdateOldOne(
          event.assignedRoles,
          roleId,
          key as string,
        ),
      });
    } else {
      setEvent({
        ...event,
        assignedRoles: event.assignedRoles.filter(
          (assignedRole) => assignedRole.scenarioRoleId !== roleId,
        ),
      });
    }
  };

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
      className="w-full"
      defaultValue={event?.title}
      isDisabled={!(isNewEvent || isBeingEdited)}
      label={intl.formatMessage({
        id: "events.page.display.name",
        defaultMessage: "Name",
      })}
      size="lg"
      variant="underlined"
    />
  );

  const dateTimeElement = (
    <div className="w-full flex justify-between space-x-3">
      <DatePicker
        className="w-1/2"
        defaultValue={event?.date}
        granularity="day"
        isDisabled={!(isNewEvent || isBeingEdited)}
        label={intl.formatMessage({
          id: "events.page.display.date",
          defaultMessage: "Date",
        })}
        size="lg"
        variant="underlined"
      />
      <Input
        className="w-1/2"
        defaultValue={event?.date.hour + ":" + event?.date.minute}
        isDisabled={!(isNewEvent || isBeingEdited)}
        label={intl.formatMessage({
          id: "events.page.display.time",
          defaultMessage: "Time",
        })}
        size="lg"
        type="time"
        variant="underlined"
      />
    </div>
  );

  const locationElement = (
    <div className="w-full flex flex-col space-y-3 justify-center border-1 p-3">
      <p className="text-xl">
        <FormattedMessage
          defaultMessage="Location"
          id="events.page.display.location"
        />
      </p>
      <Input
        className="w-full"
        defaultValue={event?.location.name}
        isDisabled={!(isNewEvent || isBeingEdited)}
        label={intl.formatMessage({
          id: "events.page.display.location.name",
          defaultMessage: "Name of location",
        })}
        size="lg"
        variant="underlined"
      />
      <Input
        className="w-full"
        defaultValue={event?.location.address}
        isDisabled={!(isNewEvent || isBeingEdited)}
        label={intl.formatMessage({
          id: "events.page.display.location.address",
          defaultMessage: "Address",
        })}
        size="lg"
        variant="underlined"
      />
      <div className="w-full flex justify-center">
        {event && (
          <Button
            color="primary"
            onPress={() => {
              window.open(
                `https://www.google.com/maps/search/?api=1&query=${event.location.name}`,
              );
            }}
          >
            <FormattedMessage
              defaultMessage="Open in Google Maps"
              id="events.page.display.location.openInMaps"
            />
          </Button>
        )}
      </div>
    </div>
  );
  const descriptionElement = (
    <Textarea
      className="w-full"
      defaultValue={event?.description}
      isDisabled={!(isNewEvent || isBeingEdited)}
      label={intl.formatMessage({
        id: "events.page.display.description",
        defaultMessage: "Description",
      })}
      size="lg"
      variant="underlined"
    />
  );

  const scenarioElement = (
    <div className="w-full flex flex-row items-baseline space-x-3">
      <Select
        defaultSelectedKeys={
          event?.scenarioId ? [String(event.scenarioId)] : []
        }
        isDisabled={!(isNewEvent || isBeingEdited)}
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
          setEvent({ ...event, scenarioId: Number(e.target.value) });
        }}
      >
        {possibleScenarios.map((scenario) => (
          <SelectItem key={String(scenario.id)}>{scenario.name}</SelectItem>
        ))}
      </Select>
      <div className="flex flex-row sm:space-x-3 space-x-1">
        <Button
          color="success"
          href={"/admin/scenarios/new"}
          isDisabled={!(isNewEvent || isBeingEdited)}
        >
          <FormattedMessage
            defaultMessage="New"
            id="events.page.display.addScenario"
          />
        </Button>
        <Button color="warning" isDisabled={!(isNewEvent || isBeingEdited)}>
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
          setIsBeingEdited(false);
        }}
      />
      {confirmCancel}
      {confirmDelete}
    </div>
  );

  const saveButton = (
    <div className="w-full flex justify-end">
      <Button color="success" size="lg">
        <FormattedMessage
          defaultMessage="Save"
          id="events.page.new.addEvent.save"
        />
      </Button>
    </div>
  );

  const assignRolesElement = (
    <div className="w-full flex flex-col p-3 border-1">
      <div className="w-full flex justify-start">
        <p className="text-xl">
          <FormattedMessage
            defaultMessage="Assign roles"
            id="events.page.display.tags"
          />
        </p>
      </div>
      <div className="w-full flex flex-col">
        {event.scenarioId ? (
          getScenario(event?.scenarioId as number)
            .roles.map((scenarioRole) => getRole(scenarioRole.roleId as number))
            .map((role) => (
              <div
                key={role.id}
                className="w-full flex flex-row space-x-3 items-baseline"
              >
                <Input
                  isDisabled
                  className="w-1/2"
                  defaultValue={role.name}
                  label={intl.formatMessage({
                    id: "events.page.display.roles",
                    defaultMessage: "Role",
                  })}
                  size="lg"
                  variant="underlined"
                />
                <Autocomplete
                  key={role.id}
                  className="max-w-xs"
                  defaultItems={userEmails}
                  disabledKeys={event.assignedRoles.map(
                    (role) => role.assignedEmail,
                  )}
                  isDisabled={!(isNewEvent || isBeingEdited)}
                  label={intl.formatMessage({
                    id: "events.page.display.assignEmail",
                    defaultMessage: "Assign email",
                  })}
                  placeholder={intl.formatMessage({
                    id: "events.page.display.selectEmail",
                    defaultMessage: "Select an email...",
                  })}
                  selectedKey={
                    event.assignedRoles
                      .filter(
                        (assignedRole) =>
                          assignedRole.scenarioRoleId === role.id,
                      )
                      .map((assignedRole) => assignedRole.assignedEmail)
                      .at(0) || null
                  }
                  variant="underlined"
                  onSelectionChange={(key) => {
                    handleRoleAssignment(role.id as number, key);
                  }}
                >
                  {(item) => (
                    <AutocompleteItem key={item.value}>
                      {item.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </div>
            ))
        ) : (
          <div className="w-full flex justify-center p-3">
            <p className="text-large">
              <FormattedMessage
                defaultMessage="Select scenario to assign roles"
                id="events.page.display.selectScenarioToAssignRoles"
              />
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const titleElement = (
    <div className="w-full flex justify-center">
      <p className="text-3xl" id="view-event-modal">
        {event ? (
          event.title
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
      {locationElement}
      {descriptionElement}
      {scenarioElement}
      {assignRolesElement}
      {isNewEvent ? saveButton : actionButtons}
    </div>
  );
}
