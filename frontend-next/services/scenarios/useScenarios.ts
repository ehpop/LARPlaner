import { useQuery } from "@tanstack/react-query";

import {
  createCrudHooks,
  DEFAULT_STALE_TIME,
} from "@/services/generic/generic-hook-factory";
import {
  IScenarioDetailedPersisted,
  IScenarioGetDTO,
  IScenarioPersisted,
  IScenarioPostDTO,
} from "@/types/scenario.types";
import {
  convertGetDtoToScenario,
  convertScenarioToPostDto,
} from "@/services/converter/scenarios-converter";
import { api } from "@/services/axios";

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

export const useDetailedScenario = (
  scenarioId: IScenarioPersisted["id"] | undefined,
) => {
  return useQuery({
    queryKey: scenariosQueryKeys.detail(scenarioId!),
    queryFn: async () => {
      const { data } = await api.get<IScenarioDetailedPersisted>(
        `${scenariosConfig.baseUrl}/${scenarioId}/detailed`,
      );

      return data;
    },
    enabled: !!scenarioId,
    staleTime: DEFAULT_STALE_TIME,
  });
};
