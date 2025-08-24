"use client";

import { FormattedMessage, useIntl } from "react-intl";
import { Card, CardBody, CardHeader } from "@heroui/react";
import React, { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { IGameSession } from "@/types/game.types";
import useEventAndScenario from "@/hooks/event/use-event";
import QrItemScanner from "@/components/game/user/qr-item-scanner";
import MyCharacterModal from "@/components/game/user/my-character-modal";
import ActionsModal from "@/components/game/user/actions-modal";
import UserGameHistory from "@/components/game/user/user-game-history";
import LoadingOverlay from "@/components/common/loading-overlay";
import { useGameSession } from "@/services/game/useGames";
import {
  StompClientProvider,
  useStomp,
} from "@/providers/stomp-client-provider";

const ActiveGamePage = ({ params }: any) => {
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
          defaultMessage: "Loading game data...",
          id: "game.id.page.display.isLoading",
        })}
      >
        {isGameDataReady ? (
          <StompConnectionGate game={game} />
        ) : (
          <p className="text-center text-zinc-500 dark:text-zinc-400">
            <FormattedMessage
              defaultMessage="Cannot load game data or user is not assigned to this game."
              id="game.id.page.cannotLoad"
            />
          </p>
        )}
      </LoadingOverlay>
    </StompClientProvider>
  );
};

const StompConnectionGate = ({ game }: { game: IGameSession }) => {
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
        <ActiveGameDisplay isConnecting game={game} />
      </LoadingOverlay>
    );
  }

  return <ActiveGameDisplay game={game} />;
};

const ActiveGameDisplay = ({
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
  const { client: stompClient } = useStomp();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!stompClient?.active || isConnecting) {
      return;
    }

    const subscription = stompClient.subscribe(
      `/user/topic/game/role`,
      (_message) => {
        queryClient.refetchQueries({
          queryKey: ["game", "detail", game.id],
        });
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [stompClient, queryClient, game.id, isConnecting]);

  if (!event || !scenario || isEventLoading) {
    return (
      <div className="w-full max-w-3xl text-center p-6 text-zinc-500 dark:text-zinc-400">
        <FormattedMessage
          defaultMessage="Loading event details..."
          id="game.id.page.display.loadingEvent"
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
                defaultMessage="Game In Progress"
                id="game.id.active.title"
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
            <p key={event.id} className="text-zinc-600 dark:text-zinc-400">
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
            <p key={scenario.id} className="text-zinc-600 dark:text-zinc-400">
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

          {/* Game Actions Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              <FormattedMessage
                defaultMessage="Game Actions"
                id="game.id.actions.title"
              />
            </h2>
            <div className="md:flex md:justify-center">
              <div className="flex flex-col space-y-3 md:w-1/2">
                <MyCharacterModal game={game} />
                <ActionsModal game={game} />
                <QrItemScanner game={game} scenario={scenario} />
                <UserGameHistory game={game} />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ActiveGamePage;
