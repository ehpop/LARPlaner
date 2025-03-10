import CrudService from "@/services/crud.service";
import {
  IGameSession,
  IGameSessionGetDTO,
  IGameSessionPostDTO,
} from "@/types/game.types";
import {
  convertGameToPostDto,
  convertGetDtoToGame,
} from "@/services/converter/game-converter";

class GameSessionService extends CrudService<
  IGameSession,
  IGameSessionGetDTO,
  IGameSessionPostDTO
> {
  constructor() {
    super("/game", convertGetDtoToGame, convertGameToPostDto);
  }
}

export default new GameSessionService();
