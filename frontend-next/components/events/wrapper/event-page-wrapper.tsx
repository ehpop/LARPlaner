import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormattedMessage, useIntl } from "react-intl";

import useEvent from "@/hooks/event/use-event";
import LoadingOverlay from "@/components/common/loading-overlay";
import { IEvent } from "@/types/event.types";
import { IScenario } from "@/types/scenario.types";

type EventStatus = "upcoming" | "active" | "historic";

interface EventPageWrapperProps {
  params: any;
  expectedStatus: EventStatus;
  children: (data: { event: IEvent; scenario: IScenario }) => React.ReactNode;
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
  const { event, scenario, loading } = useEvent(eventId);

  const isDataReady = event && scenario;
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
          id: "events.page.loading",
          defaultMessage: "Loading event...",
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
