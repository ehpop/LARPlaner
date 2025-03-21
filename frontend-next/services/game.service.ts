import CrudService from "@/services/crud.service";
import {
  IGameActionLog,
  IGameSession,
  IGameSessionGetDTO,
  IGameSessionPostDTO,
} from "@/types/game.types";
import {
  convertGameToPostDto,
  convertGetDtoToGame,
} from "@/services/converter/game-converter";
import { api } from "@/services/axios";
import { Response } from "@/types/axios.types";

class GameSessionService extends CrudService<
  IGameSession,
  IGameSessionGetDTO,
  IGameSessionPostDTO
> {
  constructor() {
    super("/game", convertGetDtoToGame, convertGameToPostDto);
  }

  async getGameHistoryByGameId(
    gameId: IGameSession["id"],
  ): Promise<Response<IGameActionLog[]>> {
    return api
      .get(`/game/history/gameId/${gameId}`)
      .then((result) => {
        return {
          success: true,
          data: result.data,
        };
      })
      .catch((error) => {
        return {
          success: false,
          data: error.message,
        };
      });
  }

  async postGameHistory(
    gameHistory: IGameActionLog,
  ): Promise<Response<IGameActionLog>> {
    return api
      .post(`/game/history`, gameHistory)
      .then((result) => {
        return {
          success: true,
          data: result.data,
        };
      })
      .catch((error) => {
        return {
          success: false,
          data: error.message,
        };
      });
  }
}

export default new GameSessionService();
