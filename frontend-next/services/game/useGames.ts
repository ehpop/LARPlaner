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
  IGameRoleStateSummaryApiResponseDTO,
  IGameSession,
  IGameSessionApiResponseDTO,
  IUpdateGameRoleStateRequest,
} from "@/types/game.types";
import { api } from "@/services/axios";
import { IScenarioActionGetDTO, IScenarioItem } from "@/types/scenario.types";
import {
  GameRoleStateSummaryApiResponseSchema,
  GameSessionSchema,
} from "@/types/zod/game";

const entityName = "game";
const DEFAULT_STALE_TIME = 0;

/**
 * Parses a raw GameRoleStateSummary DTO using Zod,
 * converting date strings into ZonedDateTime objects.
 */
const parseGameRoleStateSummaryResponse = (
  dto: IGameRoleStateSummaryApiResponseDTO,
): IGameRoleStateSummary => {
  return GameRoleStateSummaryApiResponseSchema.parse(dto);
};

/**
 * Parses a raw GameSession DTO using Zod.
 */
const parseGameSessionResponse = (
  dto: IGameSessionApiResponseDTO,
): IGameSession => {
  return GameSessionSchema.parse(dto);
};

/**
 * Parses detailed Game History logs, including nested performerRole.
 */
const parseGameHistoryResponse = (dtos: any[]): IGameActionLogDetailed[] => {
  return dtos.map((dto) => ({
    ...dto,
    performerRole: parseGameRoleStateSummaryResponse(dto.performerRole),
  }));
};

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
    queryFn: async (): Promise<IGameSession> => {
      const { data } = await api.get<IGameSessionApiResponseDTO>(`/game/${id}`);

      return parseGameSessionResponse(data);
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

      return parseGameHistoryResponse(data);
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

      // TODO: If IGameActionLogSummary needs date parsing, add a Zod schema here too
      return data;
    },
    enabled: !!gameId,
  });
};

export const useDetailedGameRoleForUser = (
  gameId: IGameSession["id"] | undefined,
  userId: IGameRoleStateSummary["assignedUserID"] | undefined,
): UseQueryResult<IGameRoleStateSummary, Error> => {
  return useQuery({
    queryKey: ["game", gameId, "role", userId],
    queryFn: async () => {
      const { data } = await api.get<IGameRoleStateSummaryApiResponseDTO>(
        `/game/${gameId}/role/user/${userId}`,
      );

      return parseGameRoleStateSummaryResponse(data);
    },
    enabled: !!gameId && !!userId,
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
      const { id: gameId } = variables;

      queryClient.invalidateQueries({ queryKey: gameQueryKeys.detail(gameId) });
      queryClient.invalidateQueries({
        queryKey: [gameQueryKeys.all, gameId, "history"],
      });
      queryClient.invalidateQueries({
        queryKey: [gameQueryKeys.all, gameId, "user-history"],
      });
      queryClient.invalidateQueries({
        queryKey: ["game", "roles"],
      });
    },
  });
};

export const useUpdateGameSessionRoleState = (): UseMutationResult<
  IGameSession,
  Error,
  {
    roleStateId: IGameRoleStateSummary["id"];
    roleStateRequest: IUpdateGameRoleStateRequest;
  }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ roleStateId, roleStateRequest }) => {
      const { data } = await api.put(
        `/game/roles/${roleStateId}/state`,
        roleStateRequest,
      );

      return parseGameSessionResponse(data);
    },
    onSuccess: (updatedGameSession) => {
      queryClient.invalidateQueries({
        queryKey: gameQueryKeys.detail(updatedGameSession.id),
      });
      queryClient.invalidateQueries({
        queryKey: ["game", "roles"],
      });
    },
  });
};
