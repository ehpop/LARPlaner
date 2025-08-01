import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";

import {
  convertGameToPostDto,
  convertGetDtoToGame,
} from "@/services/converter/game-converter";
import { createCrudHooks } from "@/services/generic/generic-hook-factory";
import {
  IGameActionLog,
  IGameActionRequest,
  IGameRoleState,
  IGameSession,
  IGameSessionGetDTO,
  IGameSessionPostDTO,
} from "@/types/game.types";
import { api } from "@/services/axios";
import { ITag } from "@/types/tags.types";
import { IScenarioActionGetDTO, IScenarioItem } from "@/types/scenario.types";

const gameConfig = {
  entityName: "game",
  baseUrl: "/game",
  convertGetDtoToEntity: convertGetDtoToGame,
  convertEntityToPostDto: convertGameToPostDto,
  staleTime: 0, // We want game data to be always fresh
};

const gameHooks = createCrudHooks<
  IGameSession,
  IGameSessionGetDTO,
  IGameSessionPostDTO
>(gameConfig);

export const useGameSessions = gameHooks.useGetAll;
export const useGameSession = gameHooks.useGetById;
export const useCreateGameSession = gameHooks.useCreate;
export const useUpdateGameSession = gameHooks.useUpdate;
export const useDeleteGameSession = gameHooks.useDelete;
export const gameQueryKeys = gameHooks.queryKeys;

export const useGameHistory = (
  gameId: IGameSession["id"] | undefined,
): UseQueryResult<IGameActionLog[], Error> => {
  return useQuery({
    queryKey: [gameQueryKeys.all, gameId, "history"],
    queryFn: async () => {
      const { data } = await api.get(`/game/history/gameId/${gameId}`);

      return data;
    },
    enabled: !!gameId,
  });
};

export const useUserGameHistory = (
  gameId: IGameSession["id"] | undefined,
): UseQueryResult<IGameActionLog[], Error> => {
  return useQuery({
    queryKey: [gameQueryKeys.all, gameId, "user-history"],
    queryFn: async () => {
      const { data } = await api.get(`/game/history/user/gameId/${gameId}`);

      return data;
    },
    enabled: !!gameId,
  });
};

export const usePerformAction = (): UseMutationResult<
  IGameActionLog,
  Error,
  { id: IGameSession["id"]; actionRequest: IGameActionRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, actionRequest }) => {
      const { data } = await api.post(
        `/game/${id}/perform-action`,
        actionRequest,
      );

      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: gameQueryKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: [gameQueryKeys.all, variables.id, "history"],
      });
      queryClient.invalidateQueries({
        queryKey: [gameQueryKeys.all, variables.id, "user-history"],
      });
      queryClient.invalidateQueries({
        queryKey: ["game", "roles", variables.actionRequest.performerRoleId],
      });
    },
  });
};

export const useUpdateGameSessionRoleState = (): UseMutationResult<
  IGameSession,
  Error,
  {
    roleStateId: IGameRoleState["id"];
    roleStateRequest: { activeTags: ITag["id"][] };
  }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ roleStateId, roleStateRequest }) => {
      const { data } = await api.put(
        `/game/roles/${roleStateId}/state`,
        roleStateRequest,
      );

      return convertGetDtoToGame(data);
    },
    onSuccess: (updatedGameSession, variables) => {
      queryClient.invalidateQueries({
        queryKey: gameQueryKeys.detail(updatedGameSession.id),
      });
      queryClient.invalidateQueries({
        queryKey: ["game", "roles", variables.roleStateId],
      });
    },
  });
};

export const useAvailableActionsForUser = (
  gameSessionRole: IGameRoleState | undefined,
): UseQueryResult<IScenarioActionGetDTO[], Error> => {
  return useQuery({
    queryKey: [
      "game",
      "roles",
      gameSessionRole?.appliedTags
        .map((t) => t.tag.value)
        .sort()
        .join(","),
      "available-actions",
    ],
    queryFn: async () => {
      const { data } = await api.get(
        `/game/roles/${gameSessionRole?.id}/availableActions`,
      );

      return data;
    },
    enabled: !!gameSessionRole,
  });
};

export const useAvailableItemActionsForUser = (
  gameRoleState: IGameRoleState | undefined,
  itemId: IScenarioItem["id"] | undefined,
): UseQueryResult<IScenarioActionGetDTO[], Error> => {
  return useQuery({
    queryKey: [
      "game",
      "roles",
      gameRoleState?.appliedTags
        .map((t) => t.tag.value)
        .sort()
        .join(","),
      "items",
      itemId,
      "available-actions",
    ],
    queryFn: async () => {
      const { data } = await api.get(
        `/game/roles/${gameRoleState?.id}/items/${itemId}/availableActions`,
      );

      return data;
    },
    enabled: !!gameRoleState && !!itemId,
  });
};
