"use client";

import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import Chat from "@/components/events/chat/chat";
import LoadingOverlay from "@/components/common/loading-overlay";
import { useEvent } from "@/services/events/useEvents";
import { useDetailedGameRoleForUser } from "@/services/game/useGames";

const ActiveEventAdminChatPage = ({ params }: any) => {
  const intl = useIntl();
  const resolvedParams = React.use(params) as { id: string; chatId: string };
  const eventId = resolvedParams.id;
  const chatId = resolvedParams.chatId;

  //Chat id consists of userID at the end
  const idOfUser = chatId.split("-").pop();

  const {
    data: event,
    isLoading: loadingEvent,
    isError: IsErrorEvent,
    error: errorEvent,
  } = useEvent(eventId);

  const {
    data: gameRoleState,
    isLoading: loadingGameRoleState,
    isError: IsErrorGameRoleState,
    error: errorGameRoleState,
  } = useDetailedGameRoleForUser(event?.gameSessionId || undefined, idOfUser);

  const loading = loadingEvent || loadingGameRoleState;
  const allDataLoaded = !loading && event && gameRoleState;

  if (IsErrorEvent)
    return (
      <div className="w-full flex justify-center">
        <p className="text-danger">{errorEvent?.message}</p>
      </div>
    );

  if (IsErrorGameRoleState)
    return (
      <div className="w-full flex justify-center">
        <p className="text-danger">{errorGameRoleState?.message}</p>
      </div>
    );

  return (
    <LoadingOverlay
      isLoading={loading}
      label={intl.formatMessage({
        defaultMessage: "Loading chat...",
        id: "events.active.chat.page.loading",
      })}
    >
      {allDataLoaded ? (
        <Chat chatId={chatId} event={event} userGameRoleState={gameRoleState} />
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

export default ActiveEventAdminChatPage;
