"use client";

import React from "react";
import { FormattedMessage } from "react-intl";
import { Card, CardBody, CardHeader } from "@heroui/react";

import { IEvent } from "@/types/event.types";
import { IScenario, IScenarioRole } from "@/types/scenario.types";
import { IRole } from "@/types/roles.types";
import UserEventPageWrapper from "@/components/events/wrapper/user-event-page-wrapper";

const UpcomingEventPage = ({ params }: any) => {
  return (
    <UserEventPageWrapper expectedStatus="upcoming" params={params}>
      {({ event, scenario, userRole, userScenarioRole }) => (
        <UpcomingEventDisplay
          event={event}
          scenario={scenario}
          userRole={userRole}
          userScenarioRole={userScenarioRole}
        />
      )}
    </UserEventPageWrapper>
  );
};

const UpcomingEventDisplay = ({
  event,
  scenario,
  userScenarioRole,
  userRole,
}: {
  event: IEvent;
  scenario: IScenario;
  userScenarioRole: IScenarioRole;
  userRole: IRole;
}) => {
  return (
    <div className="w-full flex flex-col items-center space-y-6 p-6">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <div className="w-full flex flex-row items-center justify-between">
            <p className="text-2xl font-bold">
              <FormattedMessage
                defaultMessage="Event: {eventName}"
                id="events.upcoming.title"
                values={{ eventName: event.name }}
              />
            </p>
            <div className="flex flex-row space-x-1 items-center">
              <p>
                <FormattedMessage
                  defaultMessage="Status: "
                  id="events.upcoming.statusLabel"
                />
              </p>
              <p className="font-semibold text-warning">{event.status}</p>
            </div>
          </div>
        </CardHeader>

        <CardBody className="space-y-5 text-center">
          <p className="text-lg text-gray-600">
            <FormattedMessage
              defaultMessage="Scenario: {scenarioName}"
              id="events.upcoming.scenarioName"
              values={{ scenarioName: scenario.name }}
            />
          </p>

          <div className="p-4 rounded-lg">
            <p className="text-lg font-semibold mb-2">
              <FormattedMessage
                defaultMessage="Your Role: {roleName}"
                id="events.upcoming.roleName"
                values={{ roleName: userRole.name }}
              />
            </p>
            <p className="text-md text-gray-500 italic">
              {userScenarioRole.descriptionForOwner}
            </p>
          </div>

          <p className="text-md text-gray-500">
            <FormattedMessage
              defaultMessage="There will be {rolesCount, plural, one {# other role} other {# other roles}} in this scenario."
              id="events.upcoming.rolesCount"
              values={{ rolesCount: Math.max(0, scenario.roles.length - 1) }}
            />
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

export default UpcomingEventPage;
