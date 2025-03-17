"use client";

import { FormattedMessage, useIntl } from "react-intl";
import { Card } from "@heroui/react";
import { CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";

import LoadingOverlay from "@/components/general/loading-overlay";
import { IGameSession } from "@/types/game.types";
import useGame from "@/hooks/use-game";
import useEvent from "@/hooks/use-event";
import QrItemScanner from "@/components/game/qr-item-scanner";
import MyCharacterModal from "@/components/game/my-character-modal";

const ActiveGamePage = ({ params }: any) => {
  const intl = useIntl();
  const { game, loading } = useGame({
    id: params.id,
  });

  const allDataLoaded = game && !loading;

  return (
    <div className="w-full min-h-screen flex justify-center">
      <LoadingOverlay
        isLoading={loading}
        label={intl.formatMessage({
          defaultMessage: "Loading game data...",
          id: "events.page.display.loading",
        })}
      >
        {allDataLoaded ? (
          <ActiveGameDisplay game={game} />
        ) : (
          <div className="w-full flex justify-center">
            <FormattedMessage
              defaultMessage="Cannot load game data or user is not assigned to this game."
              id="events.page.display.cannotLoad"
            />
          </div>
        )}
      </LoadingOverlay>
    </div>
  );
};

export default ActiveGamePage;

const ActiveGameDisplay = ({ game }: { game: IGameSession }) => {
  const { event, scenario, loading } = useEvent(game.eventId || "");

  const allDataLoaded = event && scenario && !loading;

  if (!allDataLoaded) {
    return (
      <div className="w-full flex justify-center">
        <p>
          <FormattedMessage
            defaultMessage="Cannot load event data or user is not assigned to this event."
            id="events.page.display.cannotLoad"
          />
        </p>
      </div>
    );
  }

  const ActionMenuElement = (
    <div className="w-full flex justify-center">
      <div className="w-3/5 flex flex-col justify-between space-y-3">
        <MyCharacterModal game={game} />
        <Button variant="bordered">
          <FormattedMessage
            defaultMessage="Actions"
            id="events.id.active.writeToAdmins"
          />
        </Button>
        <QrItemScanner game={game} scenario={scenario} />
        <Button variant="bordered">
          <FormattedMessage
            defaultMessage="See action history"
            id="events.id.active.writeToAdmins"
          />
        </Button>
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
              <p className="text-success">{game.status}</p>
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
