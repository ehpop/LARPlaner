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

const ActiveAdminGameDisplay = ({ game }: { game: IGameSession }) => {
  const { event, scenario, loading } = useEventAndScenario(game.eventId);

  const allEventDataLoaded = event && scenario && !loading;

  if (!allEventDataLoaded) {
    return (
      <div className="w-full flex justify-center p-6">
        <p>
          <FormattedMessage
            defaultMessage="Loading event details..."
            id="admin.game.id.page.display.loadingEvent"
          />
        </p>
      </div>
    );
  }

  const ActionMenuElement = (
    <div className="w-full flex justify-center pt-4">
      <div className="sm:w-3/5 w-4/5 flex flex-col justify-between space-y-3">
        <ManageCharacters event={event} gameId={game.id} />
        <AdminGameHistory game={game} />
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center space-y-6 p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="w-full flex flex-row items-center justify-between">
            <p className="text-2xl font-bold text-center">
              <FormattedMessage
                defaultMessage="Game Management"
                id="game.admin.id.active.title"
              />
            </p>
            <div className="flex flex-row space-x-1">
              <p>
                <FormattedMessage
                  defaultMessage="Status: "
                  id="events.id.active.status"
                />
              </p>
              <p className="text-success">{event.status}</p>
            </div>
          </div>
        </CardHeader>
        <CardBody className="space-y-4 text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            <FormattedMessage
              defaultMessage="Event: {eventName}"
              id="events.id.active.eventName"
              values={{ eventName: event.name }}
            />
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            <FormattedMessage
              defaultMessage="Scenario: {scenarioName}"
              id="events.id.active.scenarioName"
              values={{ scenarioName: scenario.name }}
            />
          </p>
          {ActionMenuElement}
        </CardBody>
      </Card>
    </div>
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
        <div className="w-full flex justify-center p-6">
          <p>
            <FormattedMessage
              defaultMessage="Connecting to game server..."
              id="game.id.page.display.isConnecting"
            />
          </p>
        </div>
      </LoadingOverlay>
    );
  }

  return <ActiveAdminGameDisplay game={game} />;
};

const ActiveAdminGamePage = ({ params }: any) => {
  const resolvedParams = React.use(params) as { id: string };
  const gameId = resolvedParams.id;

  const intl = useIntl();
  const { data: game, isLoading, isError, error } = useGameSession(gameId);

  const isGameDataReady = game && !isLoading;

  if (isError) {
    return (
      <div className="w-full flex justify-center p-6">
        <p className="text-danger">{error?.message}</p>
      </div>
    );
  }

  return (
    <StompClientProvider>
      <div className="w-full min-h-screen flex justify-center">
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
            <div className="w-full flex justify-center p-6">
              <FormattedMessage
                defaultMessage="Cannot load game data or user is not an admin for this game."
                id="game.admin.id.page.display.cannotLoad"
              />
            </div>
          )}
        </LoadingOverlay>
      </div>
    </StompClientProvider>
  );
};

export default ActiveAdminGamePage;
