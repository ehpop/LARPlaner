"use client";

import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "@heroui/link";
import {
  Button,
  Card,
  CardFooter,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@heroui/react";
import { CardBody, CardHeader } from "@heroui/card";
import React from "react";
import { useRouter } from "next/navigation";

import { IEvent } from "@/types/event.types";
import { IScenario } from "@/types/scenario.types";
import { IRole } from "@/types/roles.types";
import eventsService from "@/services/events.service";
import {
  showErrorToastWithTimeout,
  showSuccessToastWithTimeout,
} from "@/utils/toast";
import DownloadAllItemsQrCodes from "@/components/scenarios/download-all-items-qr-codes";
import EventPageWrapper from "@/components/events/wrapper/event-page-wrapper";
import useAllRoles from "@/hooks/roles/use-all-roles";
import useAllUserEmails from "@/hooks/admin/use-all-user-emails";
import LoadingOverlay from "@/components/common/loading-overlay";

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
  event: IEvent;
  scenario: IScenario;
}) => {
  const intl = useIntl();
  const router = useRouter();

  const { roles, loading: loadingRoles } = useAllRoles();
  const { emails, isLoading: loadingEmails } = useAllUserEmails();

  const handleStartEvent = () => {
    eventsService
      .updateEventStatus(event.id, "active")
      .then((res) => {
        if (res.success) {
          showSuccessToastWithTimeout(
            intl.formatMessage({
              id: "components.events.events-display-admin.successfully-transitioned-to-active",
              defaultMessage: "Event status changed to: ACTIVE",
            }),
          );
          router.push(`/admin/events/${event.id}/active`);
        } else {
          showErrorToastWithTimeout(res.data);
        }
      })
      .catch((error) => showErrorToastWithTimeout(error));
  };

  const emailSet: Set<string> = new Set(emails);

  return (
    <LoadingOverlay isLoading={loadingRoles || loadingEmails}>
      <UpcomingEventAdminDisplay
        emails={emailSet}
        event={event}
        roles={roles}
        scenario={scenario}
        onStartEvent={handleStartEvent}
      />
    </LoadingOverlay>
  );
};

const UpcomingEventAdminDisplay = ({
  emails,
  event,
  scenario,
  roles,
  onStartEvent,
}: {
  emails: Set<string>;
  event: IEvent;
  scenario: IScenario;
  roles: IRole[];
  onStartEvent: () => void;
}) => {
  const intl = useIntl();

  const canActivateEvent = event.assignedRoles.every(
    (assignment) =>
      assignment.assignedEmail && emails.has(assignment.assignedEmail),
  );

  return (
    <div className="w-full flex flex-col items-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="w-full flex flex-row justify-between">
            <p>
              <FormattedMessage
                defaultMessage="Event: {eventName}"
                id="admin.events.id.upcoming.page.eventName"
                values={{ eventName: event.name }}
              />
            </p>
            <div className="flex flex-row space-x-1">
              <p>
                <FormattedMessage
                  defaultMessage="Status: "
                  id="events.id.upcoming.status"
                />
              </p>
              <p className="text-warning">{event.status}</p>
            </div>
          </div>
        </CardHeader>
        <CardBody className="w-full items-center space-y-6">
          <div className="w-4/5 flex flex-row justify-between items-center">
            <p className="text-xl">{event.name}</p>
            <Link href={`/admin/events/${event.id}`}>
              <Button variant="bordered">
                <FormattedMessage
                  defaultMessage="Display event"
                  id="admin.events.id.upcoming.page.displayEvent"
                />
              </Button>
            </Link>
          </div>
          <div className="w-4/5 flex flex-row justify-between items-center">
            <p className="text-xl">{scenario.name}</p>
            <Link href={`/admin/scenarios/${scenario.id}`}>
              <Button variant="bordered">
                <FormattedMessage
                  defaultMessage="Display scenario"
                  id="admin.events.id.upcoming.page.displayScenario"
                />
              </Button>
            </Link>
          </div>

          <div className="w-4/5 space-y-3 pt-4">
            <h3 className="text-lg font-semibold">
              <FormattedMessage
                defaultMessage="Assigned Roles"
                id="admin.events.id.upcoming.page.assignedRolesTitle"
              />
            </h3>
            <div className="space-y-2">
              {scenario.roles.map((role) => {
                const assignment = event.assignedRoles.find(
                  (a) => a.scenarioRoleId === role.id,
                );

                return (
                  <div
                    key={role.roleId}
                    className="flex justify-between items-center p-2 rounded-md bg-default-100"
                  >
                    <p className="font-medium">
                      {roles.find((r) => r.id === role.roleId)?.name || "N/A"}
                    </p>
                    <AssignedEmail
                      email={assignment?.assignedEmail}
                      isEmailAssigned={emails.has(
                        assignment?.assignedEmail as string,
                      )}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </CardBody>
        <CardFooter className="flex flex-row justify-between">
          <DownloadAllItemsQrCodes scenario={scenario} />
          <Tooltip
            content={intl.formatMessage({
              defaultMessage:
                "Event cannot be activated, because there are problems with emails assigned to roles, please review and fix them before proceeding",
              id: "events.upcoming.page.display.cannotActivateEvents.hint",
            })}
            isDisabled={canActivateEvent}
            placement="bottom-start"
          >
            <div>
              <Button
                color="success"
                isDisabled={!canActivateEvent}
                variant="bordered"
                onPress={() => onStartEvent()}
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
  isEmailAssigned,
}: {
  email: string | undefined;
  isEmailAssigned: boolean;
}) => {
  if (!email) {
    return (
      <p className="text-danger">
        <FormattedMessage
          defaultMessage="Not assigned"
          id="admin.events.id.upcoming.page.notAssigned"
        />
      </p>
    );
  }

  if (!isEmailAssigned) {
    return (
      <Popover>
        <PopoverTrigger className="cursor-pointer">
          <div className="flex flex-row space-x-1">
            <p className="text-warning">{email} ℹ️</p>
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <FormattedMessage
            defaultMessage="Account for this email hasn't been set up yet"
            id="admin.events.id.upcoming.page.emailHasNoAccount"
          />
        </PopoverContent>
      </Popover>
    );
  }

  return <p className="text-foreground">{email} ✅</p>;
};

export default UpcomingEventAdminPage;
