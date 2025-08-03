"use client";

import { FormattedMessage, useIntl } from "react-intl";
import React from "react";

import { useAuth } from "@/providers/firebase-provider";
import LoadingOverlay from "@/components/common/loading-overlay";
import useUserEventData from "@/hooks/use-user-data";
import Chat from "@/components/events/chat/chat";

const ActiveEventChatPage = ({ params }: any) => {
  const resolvedParams = React.use(params) as { id: string };
  const eventId = resolvedParams.id;

  const auth = useAuth();
  const intl = useIntl();
  const chatId = `${eventId}-${auth.user?.uid}`;

  const { loading, userRole, event } = useUserEventData(eventId);

  const allDataLoaded = event && userRole && !loading;

  return (
    <LoadingOverlay
      isLoading={auth.loading || loading}
      label={intl.formatMessage({
        defaultMessage: "Loading chat...",
        id: "events.active.chat.page.loading",
      })}
    >
      {allDataLoaded ? (
        <Chat chatId={chatId} event={event} userRole={userRole} />
      ) : (
        <div className="w-full flex justify-center">
          <FormattedMessage
            defaultMessage="Cannot load event data or user is not assigned to this event."
            id="events.chat.page.display.cannotLoad"
          />
        </div>
      )}
    </LoadingOverlay>
  );
};

export default ActiveEventChatPage;
