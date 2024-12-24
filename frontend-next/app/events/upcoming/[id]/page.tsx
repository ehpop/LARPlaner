"use client";

import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { IEvent } from "@/types/event.types";
import LoadingOverlay from "@/components/general/loading-overlay";
import { IScenario, IScenarioRole } from "@/types/scenario.types";
import { IRole } from "@/types/roles.types";
import useUserEventData from "@/hooks/use-user-data";

const UpcomingEventPage = ({ params }: any) => {
  const intl = useIntl();
  const { scenario, loading, event, userScenarioRole, userRole } =
    useUserEventData({ id: params.id });

  const allDataLoaded = event && scenario && userScenarioRole && userRole;

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
              id="events.page.display.cannotLoad"
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
      <p>Upcoming Event Page</p>
      <div className="flex-col space-y-5 border-1 p-3">
        <div>
          <p>Event: </p>
          <p>{event.name}</p>
        </div>
        <div>
          <p>Scenario: </p>
          <p>{scenario.name}</p>
        </div>
        <div>
          <p>User Scenario Role: </p>
          <p>{userScenarioRole.descriptionForOwner}</p>
        </div>
        <div>
          <p>User Role: </p>
          <p>{userRole.name}</p>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEventPage;
