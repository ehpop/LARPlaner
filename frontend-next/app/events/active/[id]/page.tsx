"use client";

import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "@nextui-org/link";

import useUserEventData from "@/hooks/use-user-data";
import LoadingOverlay from "@/components/general/loading-overlay";
import { IEvent } from "@/types/event.types";
import { IScenario, IScenarioRole } from "@/types/scenario.types";
import { IRole } from "@/types/roles.types";

const HistoricEventPage = ({ params }: Params) => {
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
          <ActiveEventDisplay
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

export default HistoricEventPage;

const ActiveEventDisplay = ({
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
      <p>Active event page</p>
      <div className="flex-col space-y-5 border-1 p-3">
        <h1>{event.name}</h1>
        <p>{scenario.name}</p>
        <p>{userRole.name}</p>
        <p>{userScenarioRole.descriptionForOwner}</p>
      </div>
      <div>
        <Link href={`/events/active/${event.id}/chat`}>
          <p>Write to admins</p>
        </Link>
      </div>
    </div>
  );
};
