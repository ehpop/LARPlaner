import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";

import {
  IGameActionLogDetailed,
  IGameActionLogSummary,
  IGameActionRequest,
  IGameRoleStateSummary,
  IGameSession,
} from "@/types/game.types";
import { api } from "@/services/axios";
import { ITag } from "@/types/tags.types";
import { IScenarioActionGetDTO, IScenarioItem } from "@/types/scenario.types";

const entityName = "game";
const DEFAULT_STALE_TIME = 0;

export const gameQueryKeys = {
  all: [entityName] as const,
  list: (filters?: object) =>
    filters ? [entityName, "list", filters] : [entityName, "list"],
  details: () => [entityName, "detail"] as const,
  detail: (id: IGameSession["id"]) => [entityName, "detail", id] as const,
};

export const useGameSession = (
  id: IGameSession["id"] | undefined,
): UseQueryResult<IGameSession, Error> => {
  return useQuery({
    queryKey: gameQueryKeys.detail(id!),
    queryFn: async () => {
      const { data } = await api.get(`/game/${id}`);

      return data;
    },
    enabled: !!id,
    staleTime: DEFAULT_STALE_TIME,
  });
};

export const useGameHistory = (
  gameId: IGameSession["id"] | undefined,
): UseQueryResult<IGameActionLogDetailed[], Error> => {
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
): UseQueryResult<IGameActionLogSummary[], Error> => {
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
  IGameActionLogSummary,
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
    onSuccess: (_data, variables) => {
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
    roleStateId: IGameRoleStateSummary["id"];
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

      return data;
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
  gameSessionRole: IGameRoleStateSummary | undefined,
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
  gameRoleState: IGameRoleStateSummary | undefined,
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

export const useDetailedGameRoleForUser = (
  gameId: IGameSession["id"] | undefined,
  userId: IGameRoleStateSummary["assignedUserID"] | undefined,
): UseQueryResult<IGameRoleStateSummary, Error> => {
  return useQuery({
    queryKey: ["game", gameId, "role", userId],
    queryFn: async () => {
      const { data } = await api.get(`/game/${gameId}/role/user/${userId}`);

      return data;
    },
    enabled: !!gameId && !!userId,
  });
};
