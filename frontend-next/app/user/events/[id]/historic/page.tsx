"use client";

import { FormattedMessage, useIntl } from "react-intl";
import React from "react";

import useUserEventData from "@/hooks/use-user-data";
import LoadingOverlay from "@/components/general/loading-overlay";
import { IEvent } from "@/types/event.types";
import { IScenario, IScenarioRole } from "@/types/scenario.types";
import { IRole } from "@/types/roles.types";

const HistoricEventPage = ({ params }: any) => {
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
          defaultMessage: "Loading event data...",
          id: "events.page.display.loading",
        })}
      >
        {allDataLoaded ? (
          <HistoricEventDisplay
            event={event}
            scenario={scenario}
            userRole={userRole}
            userScenarioRole={userScenarioRole}
          />
        ) : (
          <div className="w-full flex justify-center">
            <FormattedMessage
              defaultMessage="Cannot load event data or user is not assigned to this event."
              id="events.historic.page.display.cannotLoad"
            />
          </div>
        )}
      </LoadingOverlay>
    </div>
  );
};

export default HistoricEventPage;

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
    <div className="w-full flex-col justify-center">
      <p>Historic event page</p>
      <div className="flex-col space-y-5 border-1 p-3">
        <h1>{event.name}</h1>
        <p>{scenario.name}</p>
        <p>{userRole.name}</p>
        <p>{userScenarioRole.descriptionForOwner}</p>
      </div>
    </div>
  );
};
