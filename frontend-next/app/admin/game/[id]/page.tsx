"use client";

import { FormattedMessage, useIntl } from "react-intl";
import { Card } from "@heroui/react";
import { CardBody, CardHeader } from "@heroui/card";
import React from "react";

import useGame from "@/hooks/use-game";
import LoadingOverlay from "@/components/common/loading-overlay";
import { IGameSession } from "@/types/game.types";
import useEvent from "@/hooks/event/use-event";
import AdminGameHistory from "@/components/game/admin/admin-game-history";
import ManageCharacters from "@/components/game/admin/manage-characters/manage-characters";

const ActiveAdminGamePage = ({ params }: any) => {
  const resolvedParams = React.use(params) as { id: string };
  const gameId = resolvedParams.id;

  const intl = useIntl();
  const { game, loading } = useGame(gameId);

  const allDataLoaded = game && !loading;

  return (
    <div className="w-full min-h-screen flex justify-center">
      <LoadingOverlay
        isLoading={loading}
        label={intl.formatMessage({
          defaultMessage: "Loading event...",
          id: "game.admin.id.page.display.loading",
        })}
      >
        {allDataLoaded ? (
          <ActiveAdminGameDisplay game={game} />
        ) : (
          <div className="w-full flex justify-center">
            <FormattedMessage
              defaultMessage="Cannot load game data or user is not assigned to this game."
              id="game.admin.id.page.display.cannotLoad"
            />
          </div>
        )}
      </LoadingOverlay>
    </div>
  );
};

export default ActiveAdminGamePage;

const ActiveAdminGameDisplay = ({ game }: { game: IGameSession }) => {
  const { event, scenario, loading } = useEvent(game.eventId || "");

  const allDataLoaded = event && scenario && !loading;

  if (!allDataLoaded) {
    return (
      <div className="w-full flex justify-center">
        <p>
          <FormattedMessage
            defaultMessage="Cannot load event data or user is not assigned to this event."
            id="admin.game.id.page.display.cannotLoad"
          />
        </p>
      </div>
    );
  }

  const ActionMenuElement = (
    <div className="w-full flex justify-center">
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
