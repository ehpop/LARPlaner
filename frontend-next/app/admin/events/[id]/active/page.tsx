"use client";

import { FormattedMessage, useIntl } from "react-intl";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
  useDisclosure,
} from "@heroui/react";
import React from "react";
import { useRouter } from "next/navigation";

import { IEventPersisted } from "@/types/event.types";
import { IScenarioDetailedPersisted } from "@/types/scenario.types";
import {
  showErrorToastWithTimeout,
  showSuccessToastWithTimeout,
} from "@/utils/toast";
import ConfirmActionModal from "@/components/buttons/confirm-action-modal";
import EventPageWrapper from "@/components/events/wrapper/event-page-wrapper";
import { useUpdateEventStatus } from "@/services/events/useEvents";
import { getErrorMessage } from "@/utils/error";

const ActiveEventAdminPage = ({ params }: any) => {
  return (
    <EventPageWrapper expectedStatus="active" params={params}>
      {({ event, scenario }) => (
        <ActiveEventContent event={event} scenario={scenario} />
      )}
    </EventPageWrapper>
  );
};

const ActiveEventContent = ({
  event,
  scenario,
}: {
  event: IEventPersisted;
  scenario: IScenarioDetailedPersisted;
}) => {
  const intl = useIntl();
  const router = useRouter();

  const {
    onOpen: onOpenArchive,
    isOpen: isOpenArchive,
    onOpenChange: onOpenArchiveChange,
  } = useDisclosure();

  const updateEventStatus = useUpdateEventStatus();

  const handleArchiveEvent = () => {
    updateEventStatus.mutate(
      { id: event.id, status: "historic" },
      {
        onSuccess: () => {
          showSuccessToastWithTimeout(
            intl.formatMessage({
              id: "components.events.events-display-admin.successfully-transitioned-to-historic",
              defaultMessage: "Event status changed to: HISTORIC",
            }),
          );

          router.push(`/admin/events/${event.id}/historic`);
        },
        onError: (error) => {
          showErrorToastWithTimeout(getErrorMessage(error));
        },
      },
    );
  };

  return (
    <div className="w-full flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-3xl shadow-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <CardHeader className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              <FormattedMessage
                defaultMessage="Event Management"
                id="admin.events.id.active.page.title"
              />
            </h1>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">
                <FormattedMessage
                  defaultMessage="Status:"
                  id="events.id.active.status"
                />
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-900/50 px-3 py-1 font-medium text-green-800 dark:text-green-300">
                {event.status}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardBody className="space-y-6 p-6">
          {/* Event Details Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              <FormattedMessage defaultMessage="Details" id="global.details" />
            </h2>
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border-y border-zinc-200 dark:border-zinc-800">
              <div className="flex justify-between items-center p-3">
                <span className="text-zinc-600 dark:text-zinc-400">
                  {event.name}
                </span>
                <Button
                  as={Link}
                  href={`/admin/events/${event.id}`}
                  size="sm"
                  variant="bordered"
                >
                  <FormattedMessage
                    defaultMessage="Display event"
                    id="admin.events.id.active.page.displayEvent"
                  />
                </Button>
              </div>
              <div className="flex justify-between items-center p-3">
                <span className="text-zinc-600 dark:text-zinc-400">
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
                    id="admin.events.id.active.page.displayScenario"
                  />
                </Button>
              </div>
              <div className="flex justify-between items-center p-3">
                <span className="text-zinc-600 dark:text-zinc-400">
                  <FormattedMessage
                    defaultMessage="Characters in game:"
                    id="admin.events.id.active.page.charactersInGame"
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
            isDisabled={event.status === "historic"}
            isLoading={updateEventStatus.isPending}
            variant="bordered"
            onPress={onOpenArchive}
          >
            <FormattedMessage
              defaultMessage="Archive event"
              id="admin.events.id.active.page.archiveEvent"
            />
          </Button>
          <div className="flex items-center gap-3">
            <Button
              as={Link}
              href={`/admin/events/${event.id}/active/chats`}
              variant="light"
            >
              <FormattedMessage
                defaultMessage="Go to chats"
                id="admin.events.id.active.page.chats"
              />
            </Button>
            <Button
              as={Link}
              color="primary"
              href={`/admin/game/${event.gameSessionId}`}
            >
              <FormattedMessage
                defaultMessage="Go to game page"
                id="admin.events.id.active.page.goToGame"
              />
            </Button>
          </div>
        </CardFooter>
      </Card>

      <ConfirmActionModal
        handleOnConfirm={handleArchiveEvent}
        isOpen={isOpenArchive}
        prompt={intl.formatMessage({
          defaultMessage:
            "Are you sure you want to archive this event? This action will stop the game and it cannot be reversed.",
          id: "admin.events.id.active.page.archiveEvent.prompt",
        })}
        title={intl.formatMessage({
          defaultMessage: "Archive active event",
          id: "admin.events.id.active.page.archiveEvent.title",
        })}
        onOpenChange={onOpenArchiveChange}
      />
    </div>
  );
};

export default ActiveEventAdminPage;
