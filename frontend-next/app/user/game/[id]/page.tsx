"use client";

import { FormattedMessage, useIntl } from "react-intl";
import { Card } from "@heroui/react";
import { CardBody, CardHeader } from "@heroui/card";
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

  const allDataLoaded = game && !isLoading;

  if (isError) {
    return (
      <div className="w-full flex justify-center">
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
            defaultMessage: "Loading game data...",
            id: "game.id.page.display.isLoading",
          })}
        >
          {allDataLoaded ? (
            <ActiveGameDisplay game={game} />
          ) : (
            <div className="w-full flex justify-center">
              <FormattedMessage
                defaultMessage="Cannot load game data or user is not assigned to this game."
                id="game.id.page.cannotLoad"
              />
            </div>
          )}
        </LoadingOverlay>
      </div>
    </StompClientProvider>
  );
};

export default ActiveGamePage;

const ActiveGameDisplay = ({ game }: { game: IGameSession }) => {
  const { event, scenario, loading } = useEventAndScenario(game.eventId);

  const allDataLoaded = event && scenario && !loading;

  const { client: stompClient, isConnected } = useStomp();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!stompClient || !stompClient.active || !isConnected) {
      return;
    }

    const subscription = stompClient.subscribe(
      `/user/topic/game/role`,
      (_message) => {
        console.log("Received message for game role state");

        queryClient.refetchQueries({
          queryKey: ["game", "detail", game.id],
        });
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [stompClient, isConnected, queryClient, game.id, game.eventId]);

  if (!allDataLoaded) {
    return (
      <div className="w-full flex justify-center">
        <p>
          <FormattedMessage
            defaultMessage="Cannot load event data or user is not assigned to this event."
            id="game.id.page.display.cannotLoad"
          />
        </p>
      </div>
    );
  }

  const ActionMenuElement = (
    <div className="w-full flex justify-center">
      <div className="sm:w-3/5 w-4/5 flex flex-col justify-between space-y-3">
        <MyCharacterModal game={game} />
        <ActionsModal game={game} />
        <QrItemScanner game={game} scenario={scenario} />
        <UserGameHistory game={game} />
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
                defaultMessage="Game"
                id="game.id.active.title"
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
              values={{ eventName: event?.name }}
            />
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            <FormattedMessage
              defaultMessage="Scenario: {scenarioName}"
              id="events.id.active.scenarioName"
              values={{ scenarioName: scenario?.name }}
            />
          </p>
          {ActionMenuElement}
        </CardBody>
      </Card>
    </div>
  );
};
