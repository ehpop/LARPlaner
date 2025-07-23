"use client";

import { FormattedMessage } from "react-intl";
import { Link } from "@heroui/link";
import { Card, CardFooter } from "@heroui/react";
import { CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import React from "react";

import { IEvent } from "@/types/event.types";
import { IScenario } from "@/types/scenario.types";
import { IRole } from "@/types/roles.types";
import UserEventPageWrapper from "@/components/events/wrapper/user-event-page-wrapper";

const ActiveEventPage = ({ params }: any) => {
  return (
    <UserEventPageWrapper expectedStatus="active" params={params}>
      {({ event, scenario, userRole }) => (
        <ActiveEventDisplay
          event={event}
          scenario={scenario}
          userRole={userRole}
        />
      )}
    </UserEventPageWrapper>
  );
};

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
        <CardFooter className="flex flex-row justify-between">
          <Link href={`/user/game/${event.gameSessionId}`}>
            <Button variant="bordered">
              <FormattedMessage
                defaultMessage="Go to game page"
                id="events.id.active.goToGame"
              />
            </Button>
          </Link>
          <Link href={`/user/events/${event.id}/active/chat`}>
            <Button variant="bordered">
              <FormattedMessage
                defaultMessage="Write to admins"
                id="events.id.active.writeToAdmins"
              />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ActiveEventPage;
