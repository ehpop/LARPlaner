"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormattedMessage, useIntl } from "react-intl";

import useUserEventData from "@/hooks/use-user-data";
import LoadingOverlay from "@/components/common/loading-overlay";
import { IEvent, IEventStatus } from "@/types/event.types";
import { IScenario, IScenarioRole } from "@/types/scenario.types";
import { IRole } from "@/types/roles.types";

interface UserEventData {
  event: IEvent;
  scenario: IScenario;
  userScenarioRole: IScenarioRole;
  userRole: IRole;
}

interface UserEventPageWrapperProps {
  params: any;
  expectedStatus: IEventStatus;
  children: (data: UserEventData) => React.ReactNode;
}

const UserEventPageWrapper = ({
  params,
  expectedStatus,
  children,
}: UserEventPageWrapperProps) => {
  const resolvedParams = React.use(params) as { id: string };
  const eventId = resolvedParams.id;

  const router = useRouter();
  const intl = useIntl();

  const { event, scenario, userRole, userScenarioRole, loading } =
    useUserEventData(eventId);

  const allDataLoaded = event && scenario && userRole && userScenarioRole;

  useEffect(() => {
    if (event && event.status !== expectedStatus) {
      router.push(`/user/events/${event.id}/${event.status}`);
    }
  }, [event, router, expectedStatus]);

  return (
    <div className="w-full min-h-screen flex justify-center">
      <LoadingOverlay
        isLoading={loading}
        label={intl.formatMessage({
          id: "events.user.page.loading",
          defaultMessage: "Loading event details...",
        })}
      >
        {allDataLoaded ? (
          children({ event, scenario, userRole, userScenarioRole })
        ) : (
          <div className="w-full flex justify-center p-6 text-center">
            <p className="text-lg text-danger-600">
              <FormattedMessage
                defaultMessage="Cannot load event data. You may not be assigned to this event or the event does not exist."
                id="events.user.page.cannotLoad"
              />
            </p>
          </div>
        )}
      </LoadingOverlay>
    </div>
  );
};

export default UserEventPageWrapper;
