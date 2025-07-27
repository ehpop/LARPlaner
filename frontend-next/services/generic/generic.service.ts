import { api } from "@/services/axios";

export interface CrudApiConfig<E, G, P> {
  baseUrl: string;
  convertGetDtoToEntity: (dto: G) => E;
  convertEntityToPostDto: (entity: E) => P;
}

export const genericGetAll = async <E, G>({
  baseUrl,
  convertGetDtoToEntity,
}: CrudApiConfig<E, G, any>): Promise<E[]> => {
  const { data } = await api.get<G[]>(baseUrl);

  return data.map(convertGetDtoToEntity);
};

export const genericGetById = async <E, G>(
  id: string,
  { baseUrl, convertGetDtoToEntity }: CrudApiConfig<E, G, any>,
): Promise<E> => {
  const { data } = await api.get<G>(`${baseUrl}/${id}`);

  return convertGetDtoToEntity(data);
};

export const genericCreate = async <E, G, P>(
  newEntity: Omit<E, "id">,
  {
    baseUrl,
    convertGetDtoToEntity,
    convertEntityToPostDto,
  }: CrudApiConfig<E, G, P>,
): Promise<E> => {
  const postDto = convertEntityToPostDto(newEntity as E);
  const { data } = await api.post<G>(baseUrl, postDto);

  return convertGetDtoToEntity(data);
};

export const genericUpdate = async <E extends { id: string }, G, P>(
  entityToUpdate: E,
  {
    baseUrl,
    convertGetDtoToEntity,
    convertEntityToPostDto,
  }: CrudApiConfig<E, G, P>,
): Promise<E> => {
  const postDto = convertEntityToPostDto(entityToUpdate);
  const { data } = await api.put<G>(`${baseUrl}/${entityToUpdate.id}`, postDto);

  return convertGetDtoToEntity(data);
};

export const genericDelete = async <E>(
  id: string,
  { baseUrl }: CrudApiConfig<E, any, any>,
): Promise<void> => {
  await api.delete(`${baseUrl}/${id}`);
};
