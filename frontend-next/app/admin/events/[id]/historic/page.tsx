"use client";

import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
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
          if (!event?.id) return;

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
            isPending={deleteEventMutation.isPending}
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
  isPending,
}: {
  event: IEvent;
  scenario: IScenario;
  onDeleteEvent: () => void;
  isPending?: boolean;
}) => {
  const intl = useIntl();

  const {
    onOpen: onOpenDelete,
    isOpen: isOpenDelete,
    onOpenChange: onOpenDeleteChange,
  } = useDisclosure();

  return (
    <div className="w-full flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-3xl shadow-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <CardHeader className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              <FormattedMessage
                defaultMessage="Archived Event: {eventName}"
                id="admin.events.id.historic.page.title"
                values={{ eventName: event.name }}
              />
            </h1>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">
                <FormattedMessage
                  defaultMessage="Status:"
                  id="events.id.historic.status"
                />
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 font-medium text-zinc-700 dark:text-zinc-300">
                {event.status}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardBody className="space-y-6 p-6">
          {/* Details Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              <FormattedMessage defaultMessage="Details" id="global.details" />
            </h2>
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border-y border-zinc-200 dark:border-zinc-800">
              <div className="flex justify-between items-center p-3">
                <span className="text-zinc-600 dark:text-zinc-400">
                  <FormattedMessage
                    defaultMessage="Scenario:"
                    id="admin.events.id.historic.page.scenarioLabel"
                  />
                </span>
                <div className="flex items-center gap-4">
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    {scenario.name}
                  </span>
                  <Button
                    as={Link}
                    href={`/admin/scenarios/${scenario.id}`}
                    size="sm"
                    variant="bordered"
                  >
                    <FormattedMessage
                      defaultMessage="Display scenario"
                      id="admin.events.id.historic.page.displayScenario"
                    />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center p-3">
                <span className="text-zinc-600 dark:text-zinc-400">
                  <FormattedMessage
                    defaultMessage="Characters in game:"
                    id="admin.events.id.historic.page.charactersInGame"
                  />
                </span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  {scenario.roles.length}
                </span>
              </div>
            </div>
          </div>
        </CardBody>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-zinc-200 dark:border-zinc-800">
          <Button
            color="danger"
            isDisabled={isPending}
            isLoading={isPending}
            variant="bordered"
            onPress={onOpenDelete}
          >
            <FormattedMessage
              defaultMessage="Delete Event"
              id="admin.events.id.historic.page.deleteEvent"
            />
          </Button>
          <div className="flex items-center gap-3">
            <Button
              as={Link}
              href={`/admin/events/${event.id}/historic/chats`}
              variant="light"
            >
              <FormattedMessage
                defaultMessage="Review Chats"
                id="admin.events.id.historic.page.reviewChats"
              />
            </Button>
            <Button
              as={Link}
              color="primary"
              href={`/admin/game/${event.gameSessionId}`}
            >
              <FormattedMessage
                defaultMessage="Review Game"
                id="admin.events.id.historic.page.reviewGame"
              />
            </Button>
          </div>
        </CardFooter>
      </Card>
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
    </div>
  );
};

export default HistoricEventAdminPage;
