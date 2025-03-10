import {
  IGameSession,
  IGameSessionGetDTO,
  IGameSessionPostDTO,
} from "@/types/game.types";

export function convertGetDtoToGame(dto: IGameSessionGetDTO): IGameSession {
  return dto;
}

export function convertGameToPostDto(game: IGameSession): IGameSessionPostDTO {
  return game;
}
