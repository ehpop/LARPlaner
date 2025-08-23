import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormattedMessage, useIntl } from "react-intl";

import useEventAndScenario from "@/hooks/event/use-event";
import LoadingOverlay from "@/components/common/loading-overlay";
import { IEventPersisted, IEventStatus } from "@/types/event.types";
import { IScenarioDetailedPersisted } from "@/types/scenario.types";

interface EventPageWrapperProps {
  params: any;
  expectedStatus: IEventStatus;
  children: (data: {
    event: IEventPersisted;
    scenario: IScenarioDetailedPersisted;
  }) => React.ReactNode;
}

const EventPageWrapper = ({
  params,
  expectedStatus,
  children,
}: EventPageWrapperProps) => {
  const resolvedParams = React.use(params) as { id: string };
  const eventId = resolvedParams.id;

  const router = useRouter();
  const intl = useIntl();
  const { event, scenario, loading } = useEventAndScenario(eventId);

  const isDataReady = event && scenario && !loading;
  const isStatusCorrect = isDataReady && event.status === expectedStatus;

  useEffect(() => {
    if (isDataReady && !isStatusCorrect) {
      router.push(`/admin/events/${event.id}/${event.status}`);
    }
  }, [isDataReady, isStatusCorrect, event, router]);

  return (
    <div className="w-full min-h-screen flex justify-center">
      <LoadingOverlay
        isLoading={loading}
        label={intl.formatMessage({
          id: "events.page.wrapper.loading",
          defaultMessage: "Loading event and scenario...",
        })}
      >
        {isStatusCorrect ? (
          children({ event, scenario })
        ) : (
          <div className="p-6 text-center">
            <p className="text-lg text-danger-600">
              <FormattedMessage
                defaultMessage="Event data could not be loaded or the status is incorrect."
                id="events.page.wrapper.error"
              />
            </p>
          </div>
        )}
      </LoadingOverlay>
    </div>
  );
};

export default EventPageWrapper;
