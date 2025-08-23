"use client";

import { FormattedMessage } from "react-intl";
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
} from "@heroui/react";
import React from "react";

import { IEvent } from "@/types/event.types";
import { IScenarioDetailedPersisted } from "@/types/scenario.types";
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
  scenario: IScenarioDetailedPersisted;
  userRole: IRole;
}) => {
  const otherRoles = scenario.roles.filter(
    (role) => role.role.id !== userRole.id,
  );

  return (
    <div className="w-full min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-3xl shadow-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <CardHeader className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              <FormattedMessage
                defaultMessage="Event: {eventName}"
                id="events.id.active.title"
                values={{ eventName: event.name }}
              />
            </h1>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">
                <FormattedMessage
                  defaultMessage="Status:"
                  id="events.id.active.status"
                />
              </span>
              {/* Styled status badge for "active" */}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-900/50 px-3 py-1 font-medium text-green-800 dark:text-green-300">
                {event.status}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardBody className="space-y-6 p-6">
          {/* Scenario Information */}
          <div>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              <FormattedMessage
                defaultMessage="Scenario: {scenarioName}"
                id="events.id.active.scenarioName"
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
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              <FormattedMessage
                defaultMessage="Your Role: {roleName}"
                id="events.id.active.roleName"
                values={{ roleName: userRole.name }}
              />
            </h2>
          </div>

          {/* Other Roles Section */}
          {otherRoles.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-zinc-800 dark:text-zinc-200">
                <FormattedMessage
                  defaultMessage="{rolesCount, plural, one {# other role} other {# other roles}} in this scenario"
                  id="events.upcoming.rolesCount"
                  values={{ rolesCount: otherRoles.length }}
                />
              </h3>
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

        <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 p-4 border-t border-zinc-200 dark:border-zinc-800">
          <Button
            as={Link}
            href={`/user/events/${event.id}/active/chat`}
            variant="light"
          >
            <FormattedMessage
              defaultMessage="Write to admins"
              id="events.id.active.writeToAdmins"
            />
          </Button>
          <Button
            as={Link}
            color="primary"
            href={`/user/game/${event.gameSessionId}`}
          >
            <FormattedMessage
              defaultMessage="Go to game page"
              id="events.id.active.goToGame"
            />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ActiveEventPage;
