import CrudService from "@/services/crud.service";
import {
  IGameActionLog,
  IGameActionRequest,
  IGameRoleState,
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
import { ITag } from "@/types/tags.types";

class GameSessionService extends CrudService<
  IGameSession,
  IGameSessionGetDTO,
  IGameSessionPostDTO
> {
  async getGameHistoryByGameIdAndUserId(
    gameId: IGameSession["id"],
    userId: string,
  ): Promise<Response<IGameActionLog[]>> {
    return api
      .get(`/game/history/userId/${userId}/gameId/${gameId}`)
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

  async performAction(
    id: IGameSession["id"],
    actionRequest: IGameActionRequest,
  ): Promise<Response<IGameActionLog>> {
    return api
      .post(`/game/${id}/perform-action`, actionRequest)
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

  async updateGameSessionRoleState(
    roleStateId: IGameRoleState["id"],
    roleStateRequest: {
      activeTags: ITag["id"][];
    },
  ): Promise<Response<IGameSession>> {
    return api
      .put(`/game/roles/${roleStateId}/state`, roleStateRequest)
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
