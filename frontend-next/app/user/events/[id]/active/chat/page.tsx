"use client";

import { FormattedMessage, useIntl } from "react-intl";

import { useAuth } from "@/providers/firebase-provider";
import Chat from "@/components/events/chat/chat";
import useUserEventData from "@/hooks/use-user-data";
import LoadingOverlay from "@/components/general/loading-overlay";

const ActiveEventChatPage = ({ params }: any) => {
  const auth = useAuth();
  const intl = useIntl();
  const eventId = params.id;
  const chatId = `${eventId}-${auth.user?.uid}`;

  const { loading, userRole } = useUserEventData({ id: params.id });

  return (
    <LoadingOverlay
      isLoading={auth.loading || loading}
      label={intl.formatMessage({
        defaultMessage: "Loading chat...",
        id: "events.page.display.loading",
      })}
    >
      {userRole ? (
        <Chat chatId={chatId} eventId={eventId} />
      ) : (
        <div className="w-full flex justify-center">
          <FormattedMessage
            defaultMessage="Cannot load event data or user is not assigned to this event."
            id="events.page.display.cannotLoad"
          />
        </div>
      )}
    </LoadingOverlay>
  );
};

export default ActiveEventChatPage;
