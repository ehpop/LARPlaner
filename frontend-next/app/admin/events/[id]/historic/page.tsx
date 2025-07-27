"use client";

import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useRouter } from "next/navigation";
import { Link } from "@heroui/link";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  useDisclosure,
} from "@heroui/react";

import ConfirmActionModal from "@/components/buttons/confirm-action-modal";
import { IEvent } from "@/types/event.types";
import { IScenario } from "@/types/scenario.types";
import { getErrorMessage } from "@/utils/error";
import {
  showErrorToastWithTimeout,
  showSuccessToastWithTimeout,
} from "@/utils/toast";
import EventPageWrapper from "@/components/events/wrapper/event-page-wrapper";
import { useDeleteEvent } from "@/services/events/useEvents";

const HistoricEventAdminPage = ({ params }: any) => {
  const intl = useIntl();
  const router = useRouter();
  const deleteEventMutation = useDeleteEvent();

  return (
    <EventPageWrapper expectedStatus="historic" params={params}>
      {({ event, scenario }) => {
        const handleDeleteEvent = async () => {
          if (!event || !event.id) return;

          deleteEventMutation.mutate(event.id, {
            onSuccess: () => {
              showSuccessToastWithTimeout(
                intl.formatMessage({
                  id: "admin.events.id.historic.page.successfully-deleted",
                  defaultMessage: "Event has been permanently deleted.",
                }),
              );
              router.push(`/admin/events`);
            },
            onError: (error) => {
              showErrorToastWithTimeout(getErrorMessage(error));
            },
          });
        };

        return (
          <HistoricEventAdminDisplay
            event={event}
            scenario={scenario}
            onDeleteEvent={handleDeleteEvent}
          />
        );
      }}
    </EventPageWrapper>
  );
};

const HistoricEventAdminDisplay = ({
  event,
  scenario,
  onDeleteEvent,
}: {
  event: IEvent;
  scenario: IScenario;
  onDeleteEvent: () => void;
}) => {
  const intl = useIntl();

  const {
    onOpen: onOpenDelete,
    isOpen: isOpenDelete,
    onOpenChange: onOpenDeleteChange,
  } = useDisclosure();

  return (
    <div className="w-full flex flex-col items-center p-6">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <div className="w-full flex flex-row items-center justify-between">
            <p className="text-2xl font-bold">
              <FormattedMessage
                defaultMessage="Event: {eventName}"
                id="admin.events.id.historic.page.eventName"
                values={{ eventName: event.name }}
              />
            </p>
            <div className="flex flex-row space-x-1 items-center">
              <p>
                <FormattedMessage
                  defaultMessage="Status: "
                  id="events.id.historic.status"
                />
              </p>
              <p className="font-semibold text-gray-500">{event.status}</p>
            </div>
          </div>
        </CardHeader>
        <CardBody className="w-full flex flex-col items-center space-y-5">
          <div className="w-4/5 flex flex-row justify-between items-center">
            <p className="text-lg">Scenario: {scenario.name}</p>
            <Link href={`/admin/scenarios/${scenario.id}`}>
              <Button variant="bordered">
                <FormattedMessage
                  defaultMessage="Display scenario"
                  id="admin.events.id.historic.page.displayScenario"
                />
              </Button>
            </Link>
          </div>
          <div className="w-4/5 flex flex-row justify-between items-center">
            <p className="text-lg">
              <FormattedMessage
                defaultMessage="Characters in game:"
                id="admin.events.id.historic.page.charactersInGame"
              />
            </p>
            <p className="text-lg font-mono">{scenario.roles.length}</p>
          </div>
        </CardBody>
        <CardFooter className="mt-5 flex flex-row justify-between">
          <Button color="danger" variant="bordered" onPress={onOpenDelete}>
            <FormattedMessage
              defaultMessage="Delete Event"
              id="admin.events.id.historic.page.deleteEvent"
            />
          </Button>
          <div className="flex flex-row space-x-2">
            <Link href={`/admin/game/${event.gameSessionId}`}>
              <Button color="primary" variant="bordered">
                <FormattedMessage
                  defaultMessage="Review Game"
                  id="admin.events.id.historic.page.reviewGame"
                />
              </Button>
            </Link>
            <Link href={`/admin/events/${event.id}/historic/chats`}>
              <Button variant="bordered">
                <FormattedMessage
                  defaultMessage="Review Chats"
                  id="admin.events.id.historic.page.reviewChats"
                />
              </Button>
            </Link>
          </div>
        </CardFooter>
        <ConfirmActionModal
          handleOnConfirm={onDeleteEvent}
          isOpen={isOpenDelete}
          prompt={intl.formatMessage({
            defaultMessage:
              "Are you sure you want to permanently delete this event and all its associated data? This action cannot be reversed.",
            id: "admin.events.id.historic.page.deleteEvent.prompt",
          })}
          title={intl.formatMessage({
            defaultMessage: "Delete Historic Event",
            id: "admin.events.id.historic.page.deleteEvent.title",
          })}
          onOpenChange={onOpenDeleteChange}
        />
      </Card>
    </div>
  );
};

export default HistoricEventAdminPage;
