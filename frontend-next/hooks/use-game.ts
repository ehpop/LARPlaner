import { useIntl } from "react-intl";
import { useEffect, useState } from "react";

import { useAuth } from "@/providers/firebase-provider";
import { IGameSession } from "@/types/game.types";
import gameService from "@/services/game.service";
import { showErrorMessage } from "@/hooks/utils";

const useGame = (id: IGameSession["id"]) => {
  const intl = useIntl();
  const auth = useAuth();

  const [game, setGame] = useState<IGameSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadGameData = async () => {
      if (auth.loading) {
        return;
      }

      const gameResponse = await gameService.getById(id);

      if (!gameResponse.success) {
        setError(gameResponse.data);

        return showErrorMessage(gameResponse.data);
      }

      setGame(gameResponse.data);

      const { eventId } = gameResponse.data;

      if (!eventId) {
        setError(
          intl.formatMessage({
            id: "hooks.useGame.error.noEvent",
            defaultMessage: "Game has no event assigned.",
          }),
        );

        return showErrorMessage(
          intl.formatMessage({
            id: "hooks.useGame.error.noEvent",
            defaultMessage: "Game has no event assigned.",
          }),
        );
      }
    };

    if (!id) {
      setGame(null);

      return;
    }

    loadGameData().finally(() => {
      setLoading(false);
    });
  }, [id, auth.user]);

  return { game, loading, error, setGame };
};

export default useGame;
