"use client";

import React from "react";
import { FormattedMessage } from "react-intl";
import { Card, CardBody, CardHeader } from "@heroui/react";

import { IEvent } from "@/types/event.types";
import { IScenario, IScenarioRole } from "@/types/scenario.types";
import { IRole } from "@/types/roles.types";
import UserEventPageWrapper from "@/components/events/wrapper/user-event-page-wrapper";

const HistoricEventPage = ({ params }: any) => {
  return (
    <UserEventPageWrapper expectedStatus="historic" params={params}>
      {({ event, scenario, userRole, userScenarioRole }) => (
        <HistoricEventDisplay
          event={event}
          scenario={scenario}
          userRole={userRole}
          userScenarioRole={userScenarioRole}
        />
      )}
    </UserEventPageWrapper>
  );
};

const HistoricEventDisplay = ({
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
                id="events.historic.title"
                values={{ eventName: event.name }}
              />
            </p>
            <div className="flex flex-row space-x-1 items-center">
              <p>
                <FormattedMessage
                  defaultMessage="Status: "
                  id="events.historic.statusLabel"
                />
              </p>
              <p className="font-semibold text-gray-500">{event.status}</p>
            </div>
          </div>
        </CardHeader>
        <CardBody className="space-y-5 text-center">
          <p className="text-lg">
            <FormattedMessage
              defaultMessage="Scenario: {scenarioName}"
              id="events.historic.scenarioName"
              values={{ scenarioName: scenario.name }}
            />
          </p>

          <div className="p-4 rounded-lg">
            <p className="text-lg font-semibold mb-2">
              <FormattedMessage
                defaultMessage="Your Role Was: {roleName}"
                id="events.historic.roleName"
                values={{ roleName: userRole.name }}
              />
            </p>
            <p className="text-md italic">
              <FormattedMessage
                defaultMessage="Your final description was: {description}"
                id="events.historic.roleDescription"
                values={{ description: userScenarioRole.descriptionForOwner }}
              />
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default HistoricEventPage;
