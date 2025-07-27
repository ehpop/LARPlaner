import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";

import {
  CrudApiConfig,
  genericCreate,
  genericDelete,
  genericGetAll,
  genericGetById,
  genericUpdate,
} from "@/services/generic/generic.service";

type EntityWithId = { id: string };

interface CrudHookConfig<E extends EntityWithId, G, P>
  extends CrudApiConfig<E, G, P> {
  entityName: string;
}

export function createCrudHooks<E extends EntityWithId, G, P>(
  config: CrudHookConfig<E, G, P>,
) {
  const { entityName } = config;

  const queryKeys = {
    all: [entityName] as const,
    list: (filters?: object) =>
      filters ? [entityName, "list", filters] : [entityName, "list"],
    details: () => [entityName, "detail"] as const,
    detail: (id: E["id"]) => [entityName, "detail", id] as const,
  };

  const useGetAll = (): UseQueryResult<E[], Error> => {
    return useQuery({
      queryKey: queryKeys.all,
      queryFn: () => genericGetAll(config),
    });
  };

  const useGetById = (id: E["id"] | undefined): UseQueryResult<E, Error> => {
    return useQuery({
      queryKey: queryKeys.detail(id!),
      queryFn: () => genericGetById(id as string, config),
      enabled: !!id,
    });
  };

  const useCreate = (): UseMutationResult<E, Error, Omit<E, "id">> => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (newEntity: Omit<E, "id">) =>
        genericCreate(newEntity, config),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.all });
      },
    });
  };

  const useUpdate = (): UseMutationResult<E, Error, E> => {
    const queryClient = useQueryClient();

    return useMutation<E, Error, E>({
      mutationFn: (entityToUpdate) => genericUpdate(entityToUpdate, config),
      onSuccess: (updatedEntity) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.all });
        queryClient.invalidateQueries({
          queryKey: queryKeys.detail(updatedEntity.id),
        });
      },
    });
  };

  const useDelete = (): UseMutationResult<void, Error, E["id"]> => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (id: E["id"]) => genericDelete(id as string, config),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.all });
      },
    });
  };

  return {
    queryKeys,
    useGetAll,
    useGetById,
    useCreate,
    useUpdate,
    useDelete,
  };
}
