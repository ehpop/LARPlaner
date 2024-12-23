import {
  IScenario,
  IScenarioGetDTO,
  IScenarioPostDTO,
  IScenarioRole,
} from "@/types/scenario.types";
import { ITag } from "@/types/tags.types";

export function convertGetDtoToScenario(dto: IScenarioGetDTO): IScenario {
  return { ...dto } as IScenario;
}

export function convertScenarioToPostDto(
  scenario: IScenario,
): IScenarioPostDTO {
  return {
    ...scenario,
    tags: scenario.tags.map((tag) => tag.id) as ITag["id"][],
    roles: scenario.roles.map((role) => role.id) as IScenarioRole["id"][],
    items: scenario.items.map((item) => item.id) as IScenarioRole["id"][],
    actions: scenario.actions.map(
      (action) => action.id,
    ) as IScenarioRole["id"][],
  } as IScenarioPostDTO;
}
