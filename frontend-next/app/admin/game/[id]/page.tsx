"use client";

import { FormattedMessage, useIntl } from "react-intl";
import { Card, CardBody, CardHeader } from "@heroui/react";
import React from "react";

import { IGameSession } from "@/types/game.types";
import { useGameSession } from "@/services/game/useGames";
import useEventAndScenario from "@/hooks/event/use-event";
import {
  StompClientProvider,
  useStomp,
} from "@/providers/stomp-client-provider";
import LoadingOverlay from "@/components/common/loading-overlay";
import AdminGameHistory from "@/components/game/admin/admin-game-history";
import ManageCharacters from "@/components/game/admin/manage-characters/manage-characters";

const ActiveAdminGamePage = ({ params }: any) => {
  const resolvedParams = React.use(params) as { id: string };
  const gameId = resolvedParams.id;

  const intl = useIntl();
  const { data: game, isLoading, isError, error } = useGameSession(gameId);

  const isGameDataReady = game && !isLoading;

  if (isError) {
    return (
      <div className="w-full min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center p-4 sm:p-6 lg:p-8">
        <p className="text-red-600 dark:text-red-400">{error?.message}</p>
      </div>
    );
  }

  return (
    <StompClientProvider>
      <LoadingOverlay
        isLoading={isLoading}
        label={intl.formatMessage({
          defaultMessage: "Loading game...",
          id: "game.admin.id.page.display.loading",
        })}
      >
        {isGameDataReady ? (
          <AdminStompConnectionGate game={game} />
        ) : (
          <p className="text-zinc-500 dark:text-zinc-400">
            <FormattedMessage
              defaultMessage="Cannot load game data or user is not an admin for this game."
              id="game.admin.id.page.display.cannotLoad"
            />
          </p>
        )}
      </LoadingOverlay>
    </StompClientProvider>
  );
};

const AdminStompConnectionGate = ({ game }: { game: IGameSession }) => {
  const { isConnected } = useStomp();
  const intl = useIntl();

  if (!isConnected) {
    return (
      <LoadingOverlay
        isLoading={true}
        label={intl.formatMessage({
          defaultMessage: "Connecting to game server...",
          id: "game.id.page.display.isConnecting",
        })}
      >
        <ActiveAdminGameDisplay isConnecting game={game} />
      </LoadingOverlay>
    );
  }

  return <ActiveAdminGameDisplay game={game} />;
};

const ActiveAdminGameDisplay = ({
  game,
  isConnecting = false,
}: {
  game: IGameSession;
  isConnecting?: boolean;
}) => {
  const {
    event,
    scenario,
    loading: isEventLoading,
  } = useEventAndScenario(game.eventId);

  if (!event || !scenario || isEventLoading) {
    return (
      <div className="w-full max-w-3xl text-center p-6 text-zinc-500 dark:text-zinc-400">
        <FormattedMessage
          defaultMessage="Loading event details..."
          id="admin.game.id.page.display.loadingEvent"
        />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-3xl shadow-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <CardHeader className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="w-full flex flex-col 2xs:flex-row items-start 2xs:items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              <FormattedMessage
                defaultMessage="Game Management"
                id="game.admin.id.active.title"
              />
            </h1>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">
                <FormattedMessage
                  defaultMessage="Status:"
                  id="events.id.active.status"
                />
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-900/50 px-3 py-1 font-medium text-green-800 dark:text-green-300">
                {event.status}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardBody className="space-y-6 p-6">
          {/* Game Context Information */}
          <div className="space-y-2">
            <p className="text-zinc-600 dark:text-zinc-400">
              <FormattedMessage
                defaultMessage="Event: {eventName}"
                id="events.id.active.eventName"
                values={{
                  eventName: (
                    <span
                      key={crypto.randomUUID()}
                      className="font-medium text-zinc-800 dark:text-zinc-200"
                    >
                      {event.name}
                    </span>
                  ),
                }}
              />
            </p>
            <p className="text-zinc-600 dark:text-zinc-400">
              <FormattedMessage
                defaultMessage="Scenario: {scenarioName}"
                id="events.id.active.scenarioName"
                values={{
                  scenarioName: (
                    <span
                      key={crypto.randomUUID()}
                      className="font-medium text-zinc-800 dark:text-zinc-200"
                    >
                      {scenario.name}
                    </span>
                  ),
                }}
              />
            </p>
          </div>

          <hr className="border-zinc-200 dark:border-zinc-800" />

          {/* Admin Actions Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              <FormattedMessage
                defaultMessage="Admin Actions"
                id="game.admin.actions.title"
              />
            </h2>
            <div className="md:flex md:justify-center">
              <div className="flex flex-col space-y-3 md:w-1/2">
                <ManageCharacters event={event} gameId={game.id} />
                <AdminGameHistory game={game} />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ActiveAdminGamePage;
