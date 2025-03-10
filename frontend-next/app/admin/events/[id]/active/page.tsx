"use client";

import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "@heroui/link";

import { IEvent } from "@/types/event.types";
import { IScenario } from "@/types/scenario.types";
import LoadingOverlay from "@/components/general/loading-overlay";
import useEvent from "@/hooks/use-event";

const ActiveEventAdminPage = ({ params }: any) => {
  const intl = useIntl();
  const { event, scenario, loading } = useEvent(params.id);
  const allDataLoaded = event && scenario;

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
          <ActiveEventAdminDisplay event={event} scenario={scenario} />
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

const ActiveEventAdminDisplay = ({
  event,
  scenario,
}: {
  event: IEvent;
  scenario: IScenario;
}) => {
  return (
    <div className="w-full h-full flex flex-col border-1 space-y-3">
      <div className="w-full flex justify-center">
        <h1 className="text-3xl font-bold">
          <FormattedMessage
            defaultMessage="Active event admin page"
            id="admin.events.id.active.page.title"
          />
        </h1>
      </div>
      <div className="w-full flex justify-center">
        <h1 className="text-3xl font-bold">{event.name}</h1>
      </div>
      <div className="w-full flex justify-center">
        <h2 className="text-2xl font-bold">{scenario.name}</h2>
      </div>
      <div className="w-full flex justify-center">
        <Link href={`/admin/events/${event.id}/active/chats`}>
          <h2 className="text-2xl font-bold">
            <FormattedMessage
              defaultMessage="See all chats related to this event"
              id="admin.events.id.active.page.chats"
            />
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default ActiveEventAdminPage;
