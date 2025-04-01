"use client";

import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "@heroui/link";
import { Button, Card, CardFooter } from "@heroui/react";
import { CardBody, CardHeader } from "@heroui/card";
import React from "react";

import { IEvent } from "@/types/event.types";
import { IScenario } from "@/types/scenario.types";
import LoadingOverlay from "@/components/general/loading-overlay";
import useEvent from "@/hooks/use-event";

const ActiveEventAdminPage = ({ params }: any) => {
  const resolvedParams = React.use(params) as { id: string };
  const eventId = resolvedParams.id;
  const intl = useIntl();
  const { event, scenario, loading } = useEvent(eventId);
  const allDataLoaded = event && scenario;

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
          <ActiveEventAdminDisplay event={event} scenario={scenario} />
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

const ActiveEventAdminDisplay = ({
  event,
  scenario,
}: {
  event: IEvent;
  scenario: IScenario;
}) => {
  return (
    <div className="w-full flex flex-col items-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="w-full flex flex-row justify-between">
            <p>
              <FormattedMessage
                defaultMessage="Event: {eventName}"
                id="admin.events.id.active.page.eventName"
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
        <CardBody className="w-full items-center space-y-5">
          <div className="w-3/5 flex flex-row justify-between items-center">
            <p className="text-xl">{event.name}</p>
            <Link href={`/admin/events/${event.id}`}>
              <Button variant="bordered">
                <FormattedMessage
                  defaultMessage="Display event"
                  id="admin.events.id.active.page.displayEvent"
                />
              </Button>
            </Link>
          </div>
          <div className="w-3/5 flex flex-row justify-between items-center">
            <p className="text-xl">{scenario.name}</p>
            <Link href={`/admin/scenarios/${scenario.id}`}>
              <Button variant="bordered">
                <FormattedMessage
                  defaultMessage="Display scenario"
                  id="admin.events.id.active.page.displayScenario"
                />
              </Button>
            </Link>
          </div>
          <div className="w-3/5 flex flex-row justify-between items-center">
            <p className="text-xl">
              <FormattedMessage
                defaultMessage="Characters in game:"
                id="admin.events.id.active.page.charactersInGame"
              />
            </p>
            <p className="text-xl">{scenario.roles.length}</p>
          </div>
        </CardBody>
        <CardFooter className="flex flex-row justify-between">
          <Link href={`/admin/game/${event.gameSessionId}`}>
            <Button variant="bordered">
              <FormattedMessage
                defaultMessage="Go to game page"
                id="admin.events.id.active.page.goToGame"
              />
            </Button>
          </Link>
          <Link href={`/admin/events/${event.id}/active/chats`}>
            <Button variant="bordered">
              <FormattedMessage
                defaultMessage="Go to chats"
                id="admin.events.id.active.page.chats"
              />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ActiveEventAdminPage;
