"use client";

import React from "react";
import { FormattedMessage } from "react-intl";
import {
  Accordion,
  AccordionItem,
  Card,
  CardBody,
  CardHeader,
} from "@heroui/react";

import { IEvent } from "@/types/event.types";
import {
  IScenarioDetailedPersisted,
  IScenarioRole,
} from "@/types/scenario.types";
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
  scenario: IScenarioDetailedPersisted;
  userScenarioRole: IScenarioRole;
  userRole: IRole;
}) => {
  const otherRoles = scenario.roles.filter(
    (role) => role.id !== userScenarioRole.id,
  );

  return (
    <div className="w-full min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-3xl shadow-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <CardHeader className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              <FormattedMessage
                defaultMessage="Event: {eventName}"
                id="events.upcoming.title"
                values={{ eventName: event.name }}
              />
            </h1>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">
                <FormattedMessage
                  defaultMessage="Status:"
                  id="events.upcoming.statusLabel"
                />
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 font-medium text-zinc-700 dark:text-zinc-300">
                {event.status}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardBody className="space-y-6 p-6">
          {/* Scenario Information */}
          <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
            <p className="text-lg">
              <FormattedMessage
                defaultMessage="Scenario: {scenarioName}"
                id="events.upcoming.scenarioName"
                values={{
                  scenarioName: (
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">
                      {scenario.name}
                    </span>
                  ),
                }}
              />
            </p>
          </div>

          <hr className="border-zinc-200 dark:border-zinc-800" />

          {/* User's Role Section */}
          <div className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                <FormattedMessage
                  defaultMessage="Your Role: {roleName}"
                  id="events.upcoming.roleName"
                  values={{ roleName: userRole.name }}
                />
              </h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {userScenarioRole.descriptionForOwner}
            </p>
          </div>

          {/* Other Roles Section */}
          {otherRoles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-medium text-zinc-800 dark:text-zinc-200">
                  <FormattedMessage
                    defaultMessage="{rolesCount, plural, one {# other role} other {# other roles}} in this scenario"
                    id="events.upcoming.rolesCount"
                    values={{ rolesCount: otherRoles.length }}
                  />
                </h3>
              </div>

              <Accordion className="space-y-2">
                {otherRoles.map((role) => (
                  <AccordionItem key={role.id} title={role.role.name}>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      {role.descriptionForOthers}
                    </p>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default UpcomingEventPage;
