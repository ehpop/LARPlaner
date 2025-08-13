import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";

import { createCrudHooks } from "@/services/generic/generic-hook-factory";
import {
  convertGetDtoToTag,
  convertTagToPostDto,
} from "@/services/converter/tag-converter";
import {
  ITag,
  ITagGetDTO,
  ITagPersisted,
  ITagPostDTO,
} from "@/types/tags.types";
import { api } from "@/services/axios";

const tagsConfig = {
  entityName: "tags",
  baseUrl: "/tags",
  convertGetDtoToEntity: convertGetDtoToTag,
  convertEntityToPostDto: convertTagToPostDto,
};

const TagsHooks = createCrudHooks<ITagPersisted, ITagGetDTO, ITagPostDTO>(
  tagsConfig,
);

export const useTags = TagsHooks.useGetAll;
export const useTag = TagsHooks.useGetById;
export const useCreateTag = TagsHooks.useCreate;
export const useUpdateTag = TagsHooks.useUpdate;
export const useDeleteTag = TagsHooks.useDelete;
export const tagsQueryKeys = TagsHooks.queryKeys;

export const useCreateAllTags = (): UseMutationResult<
  ITagPersisted[],
  Error,
  Omit<ITag, "id">[]
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newEntities: Omit<ITag, "id">[]) => {
      const tagDTOs = newEntities.map((tag) => convertTagToPostDto(tag));
      const { data } = await api.post<ITagGetDTO[]>(
        tagsConfig.baseUrl,
        tagDTOs,
      );

      return data.map((dto) => convertGetDtoToTag(dto));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagsQueryKeys.all });
    },
  });
};
