"use client";

import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { IEvent } from "@/types/event.types";
import LoadingOverlay from "@/components/general/loading-overlay";
import { IScenario, IScenarioRole } from "@/types/scenario.types";
import { IRole } from "@/types/roles.types";
import useUserEventData from "@/hooks/use-user-data";

const UpcomingEventPage = ({ params }: any) => {
  const resolvedParams = React.use(params) as { id: string };
  const eventId = resolvedParams.id;

  const intl = useIntl();
  const { scenario, loading, event, userScenarioRole, userRole } =
    useUserEventData({ id: eventId });

  const allDataLoaded = event && scenario && userScenarioRole && userRole;

  return (
    <div className="w-full min-h-screen flex justify-center">
      <LoadingOverlay
        isLoading={loading}
        label={intl.formatMessage({
          defaultMessage: "Loading upcoming event...",
          id: "events.page.upcoming.display.loading",
        })}
      >
        {allDataLoaded ? (
          <UpcomingEventDisplay
            event={event}
            scenario={scenario}
            userRole={userRole}
            userScenarioRole={userScenarioRole}
          />
        ) : (
          <div className="w-full flex justify-center">
            <FormattedMessage
              defaultMessage="Cannot load event data or user is not assigned to this event."
              id="events.upcoming.page.display.cannotLoad"
            />
          </div>
        )}
      </LoadingOverlay>
    </div>
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
    <div className="w-full flex-col justify-center">
      <p>
        <FormattedMessage
          defaultMessage="Upcoming Event Page"
          id="events.page.upcoming.title"
        />
      </p>
      <div className="flex-col space-y-5 border-1 p-3">
        <div>
          <p>
            <FormattedMessage
              defaultMessage="Event: "
              id="events.page.upcoming.event"
            />
          </p>
          <p>{event.name}</p>
        </div>
        <div>
          <p>
            <FormattedMessage
              defaultMessage="Scenario: "
              id="events.page.upcoming.scenario"
            />
          </p>
          <p>{scenario.name}</p>
        </div>
        <div>
          <p>
            <FormattedMessage
              defaultMessage="User Scenario Role: "
              id="events.page.upcoming.userScenarioRole"
            />
          </p>
          <p>{userScenarioRole.descriptionForOwner}</p>
        </div>
        <div>
          <p>
            <FormattedMessage
              defaultMessage="User Role: "
              id="events.page.upcoming.userRole"
            />
          </p>
          <p>{userRole.name}</p>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEventPage;
