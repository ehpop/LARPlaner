"use client";

import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "@heroui/link";
import { Card } from "@heroui/react";
import { CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";

import useUserEventData from "@/hooks/use-user-data";
import LoadingOverlay from "@/components/general/loading-overlay";
import { IEvent } from "@/types/event.types";
import { IScenario } from "@/types/scenario.types";
import { IRole } from "@/types/roles.types";

const ActiveEventPage = ({ params }: any) => {
  const intl = useIntl();
  const { scenario, loading, event, userRole } = useUserEventData({
    id: params.id,
  });

  const allDataLoaded = event && scenario && userRole;

  return (
    <div className="w-full min-h-screen flex justify-center">
      <LoadingOverlay
        isLoading={loading}
        label={intl.formatMessage({
          defaultMessage: "Loading event data...",
          id: "events.page.display.loading",
        })}
      >
        {allDataLoaded ? (
          <ActiveEventDisplay
            event={event}
            scenario={scenario}
            userRole={userRole}
          />
        ) : (
          <div className="w-full flex justify-center">
            <FormattedMessage
              defaultMessage="Cannot load event data or user is not assigned to this event."
              id="events.page.display.cannotLoad"
            />
          </div>
        )}
      </LoadingOverlay>
    </div>
  );
};

export default ActiveEventPage;

const ActiveEventDisplay = ({
  event,
  scenario,
  userRole,
}: {
  event: IEvent;
  scenario: IScenario;
  userRole: IRole;
}) => {
  return (
    <div className="w-full flex flex-col items-center space-y-6 p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="w-full flex flex-row items-center justify-between">
            <p className="text-2xl font-bold text-center">
              <FormattedMessage
                defaultMessage="Event: {eventName}"
                id="events.id.active.title"
                values={{ eventName: event.name }}
              />
            </p>
            <div className="flex flex-row space-x-1">
              <p>
                <FormattedMessage
                  defaultMessage="Status: "
                  id="events.id.active.status"
                />
              </p>
              <p className="text-success">{event.status}</p>
            </div>
          </div>
        </CardHeader>
        <CardBody className="space-y-4 text-center">
          <p className="text-lg text-gray-600">
            <FormattedMessage
              defaultMessage="Scenario: {scenarioName}"
              id="events.id.active.scenarioName"
              values={{ scenarioName: scenario.name }}
            />
          </p>
          <p className="text-lg font-semibold">
            <FormattedMessage
              defaultMessage="Your role: {roleName}"
              id="events.id.active.roleName"
              values={{ roleName: userRole.name }}
            />
          </p>
          <p className="text-lg text-gray-600">
            <FormattedMessage
              defaultMessage="Other roles: {rolesCount}"
              id="events.id.active.rolesCount"
              values={{ rolesCount: scenario.roles.length - 1 }}
            />
          </p>
        </CardBody>
      </Card>
      <div className="w-3/5 flex flex-row justify-between">
        <Link href={`/game/${event.gameSessionId}`}>
          <Button variant="bordered">
            <FormattedMessage
              defaultMessage="Go to game page"
              id="events.id.active.goToGame"
            />
          </Button>
        </Link>
        <Link href={`/events/${event.id}/active/chat`}>
          <Button variant="bordered">
            <FormattedMessage
              defaultMessage="Write to admins"
              id="events.id.active.writeToAdmins"
            />
          </Button>
        </Link>
      </div>
    </div>
  );
};
