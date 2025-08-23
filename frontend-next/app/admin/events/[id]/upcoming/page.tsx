"use client";

import { FormattedMessage, useIntl } from "react-intl";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@heroui/react";
import React from "react";
import { useRouter } from "next/navigation";

import { IEvent, IEventPersisted } from "@/types/event.types";
import { IScenarioDetailedPersisted } from "@/types/scenario.types";
import {
  showErrorToastWithTimeout,
  showSuccessToastWithTimeout,
} from "@/utils/toast";
import DownloadAllItemsQrCodes from "@/components/scenarios/download-all-items-qr-codes";
import EventPageWrapper from "@/components/events/wrapper/event-page-wrapper";
import LoadingOverlay from "@/components/common/loading-overlay";
import { useUpdateEventStatus } from "@/services/events/useEvents";
import { useAllUserEmails } from "@/services/admin/useUsers";
import { getErrorMessage } from "@/utils/error";

const UpcomingEventAdminPage = ({ params }: any) => {
  return (
    <EventPageWrapper expectedStatus="upcoming" params={params}>
      {({ event, scenario }) => (
        <UpcomingEventContent event={event} scenario={scenario} />
      )}
    </EventPageWrapper>
  );
};

const UpcomingEventContent = ({
  event,
  scenario,
}: {
  event: IEventPersisted;
  scenario: IScenarioDetailedPersisted;
}) => {
  const intl = useIntl();
  const router = useRouter();

  const {
    data: emails,
    isLoading: loadingEmails,
    error,
    isError,
  } = useAllUserEmails();

  const updateEventStatus = useUpdateEventStatus();

  const handleStartEvent = () => {
    updateEventStatus.mutate(
      { id: event.id, status: "active" },
      {
        onSuccess: () => {
          showSuccessToastWithTimeout(
            intl.formatMessage({
              id: "components.events.events-display-admin.successfully-transitioned-to-active",
              defaultMessage: "Event status changed to: ACTIVE",
            }),
          );
          router.push(`/admin/events/${event.id}/active`);
        },
        onError: (error) => {
          showErrorToastWithTimeout(getErrorMessage(error));
        },
      },
    );
  };

  if (isError) {
    return (
      <div className="w-full flex justify-center p-6">
        <p className="text-red-600 dark:text-red-400">{error?.message}</p>
      </div>
    );
  }

  return (
    <LoadingOverlay isLoading={loadingEmails}>
      {emails && (
        <UpcomingEventAdminDisplay
          emails={new Set(emails)}
          event={event}
          isPending={updateEventStatus.isPending}
          scenario={scenario}
          onStartEvent={handleStartEvent}
        />
      )}
    </LoadingOverlay>
  );
};

const UpcomingEventAdminDisplay = ({
  emails,
  event,
  scenario,
  onStartEvent,
  isPending,
}: {
  emails: Set<string>;
  event: IEvent;
  scenario: IScenarioDetailedPersisted;
  onStartEvent: () => void;
  isPending?: boolean;
}) => {
  const intl = useIntl();

  const canActivateEvent = event.assignedRoles.every(
    (assignment) =>
      assignment.assignedEmail && emails.has(assignment.assignedEmail),
  );

  return (
    <div className="w-full flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-3xl shadow-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <CardHeader className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              <FormattedMessage
                defaultMessage="Event Preparations"
                id="admin.events.id.upcoming.page.title"
              />
            </h1>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">
                <FormattedMessage
                  defaultMessage="Status:"
                  id="events.id.upcoming.status"
                />
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-900/50 px-3 py-1 font-medium text-amber-800 dark:text-amber-300">
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
                    id="admin.events.id.upcoming.page.displayEvent"
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
                    id="admin.events.id.upcoming.page.displayScenario"
                  />
                </Button>
              </div>
            </div>
          </div>

          {/* Assigned Roles Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              <FormattedMessage
                defaultMessage="Assigned Roles"
                id="admin.events.id.upcoming.page.assignedRolesTitle"
              />
            </h2>
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg divide-y divide-zinc-200 dark:divide-zinc-800">
              {scenario.roles.map((scenarioRole) => {
                const assignment = event.assignedRoles.find(
                  (a) => a.scenarioRoleId === scenarioRole.id,
                );

                return (
                  <div
                    key={scenarioRole.role.id}
                    className="flex justify-between items-center p-3"
                  >
                    <p className="font-medium text-zinc-800 dark:text-zinc-200">
                      {scenarioRole.role.name}
                    </p>
                    <AssignedEmail
                      email={assignment?.assignedEmail}
                      isEmailValid={emails.has(
                        assignment?.assignedEmail as string,
                      )}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </CardBody>

        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-zinc-200 dark:border-zinc-800">
          <DownloadAllItemsQrCodes scenario={scenario} />
          <Tooltip
            content={intl.formatMessage({
              defaultMessage:
                "Event cannot be activated because some roles are not assigned or are assigned to users who do not exist.",
              id: "events.upcoming.page.display.cannotActivateEvents.hint",
            })}
            isDisabled={canActivateEvent}
            placement="top-end"
          >
            {/* Wrapper div is required for Tooltip to work on a disabled button */}
            <div>
              <Button
                color="success"
                isDisabled={!canActivateEvent || isPending}
                isLoading={isPending}
                onPress={onStartEvent}
              >
                <FormattedMessage
                  defaultMessage="Activate Event"
                  id="admin.events.id.upcoming.page.activateEvent"
                />
              </Button>
            </div>
          </Tooltip>
        </CardFooter>
      </Card>
    </div>
  );
};

const AssignedEmail = ({
  email,
  isEmailValid,
}: {
  email: string | undefined;
  isEmailValid: boolean;
}) => {
  if (!email) {
    return (
      <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
        <span className="font-medium">
          <FormattedMessage
            defaultMessage="Not assigned ❌"
            id="admin.events.id.upcoming.page.notAssigned"
          />
        </span>
      </div>
    );
  }

  if (!isEmailValid) {
    return (
      <Popover placement="top">
        <PopoverTrigger className="cursor-pointer">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <span className="font-medium">{email}⚠️</span>
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <p className="text-sm">
            <FormattedMessage
              defaultMessage="No user account exists for this email address."
              id="admin.events.id.upcoming.page.emailHasNoAccount"
            />
          </p>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
      <span className="font-medium">{email} ✅</span>
    </div>
  );
};

export default UpcomingEventAdminPage;
