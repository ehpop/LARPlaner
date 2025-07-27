import { createCrudHooks } from "@/services/generic/generic-hook-factory";
import {
  IScenarioGetDTO,
  IScenarioPersisted,
  IScenarioPostDTO,
} from "@/types/scenario.types";
import {
  convertGetDtoToScenario,
  convertScenarioToPostDto,
} from "@/services/converter/scenarios-converter";

const scenariosConfig = {
  entityName: "scenarios",
  baseUrl: "/scenarios",
  convertGetDtoToEntity: convertGetDtoToScenario,
  convertEntityToPostDto: convertScenarioToPostDto,
};

const scenarioHook = createCrudHooks<
  IScenarioPersisted,
  IScenarioGetDTO,
  IScenarioPostDTO
>(scenariosConfig);

export const useScenarios = scenarioHook.useGetAll;
export const useScenario = scenarioHook.useGetById;
export const useCreateScenario = scenarioHook.useCreate;
export const useUpdateScenario = scenarioHook.useUpdate;
export const useDeleteScenario = scenarioHook.useDelete;
export const scenariosQueryKeys = scenarioHook.queryKeys;
