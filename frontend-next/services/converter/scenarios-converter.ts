import {
  IScenario,
  IScenarioGetDTO,
  IScenarioPostDTO,
} from "@/types/scenario.types";

export function convertGetDtoToScenario(dto: IScenarioGetDTO): IScenario {
  return { ...dto } as IScenario;
}

export function convertScenarioToPostDto(
  scenario: IScenario,
): IScenarioPostDTO {
  return { ...scenario } as IScenarioPostDTO;
}
