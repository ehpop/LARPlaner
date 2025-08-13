import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";

import { convertEventToPostDto } from "@/services/converter/events-converter";
import { createCrudHooks } from "@/services/generic/generic-hook-factory";
import {
  IEvent,
  IEventGetDTO,
  IEventPersisted,
  IEventPostDTO,
  IEventStatus,
} from "@/types/event.types";
import { api } from "@/services/axios";
import { mapEvent } from "@/types/zod/event";

const eventsConfig = {
  entityName: "events",
  baseUrl: "/events",
  convertGetDtoToEntity: mapEvent,
  convertEntityToPostDto: convertEventToPostDto,
};

const eventsHook = createCrudHooks<
  IEventPersisted,
  IEventGetDTO,
  IEventPostDTO
>(eventsConfig);

export const useEvents = eventsHook.useGetAll;
export const useEvent = eventsHook.useGetById;
export const useCreateEvent = eventsHook.useCreate;
export const useUpdateEvent = eventsHook.useUpdate;
export const useDeleteEvent = eventsHook.useDelete;
export const eventsQueryKeys = eventsHook.queryKeys;

export const useEventForGameId = (
  gameId: IEvent["gameSessionId"],
): UseQueryResult<IEventPersisted, Error> => {
  return useQuery({
    queryKey: eventsQueryKeys.detail(gameId!),
    queryFn: async () => {
      const { data } = await api.get<IEventGetDTO>(`/events/game/${gameId}`);

      return mapEvent(data);
    },
    enabled: !!gameId,
  });
};

export const useUpdateEventStatus = (): UseMutationResult<
  IEventPersisted,
  Error,
  { id: IEventPersisted["id"]; status: IEventStatus }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: IEventPersisted["id"];
      status: IEventStatus;
    }) => {
      const { data } = await api.put<IEventGetDTO>(
        `${eventsConfig.baseUrl}/${id}/status`,
        { status },
      );

      return mapEvent(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventsQueryKeys.all });
    },
  });
};
