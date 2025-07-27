import { IRoleGetDTO, IRolePersisted, IRolePostDTO } from "@/types/roles.types";
import {
  convertGetDtoToRole,
  convertRoleToPostDto,
} from "@/services/converter/roles-converter";
import { createCrudHooks } from "@/services/generic/generic-hook-factory";

const rolesConfig = {
  entityName: "roles",
  baseUrl: "/roles",
  convertGetDtoToEntity: convertGetDtoToRole,
  convertEntityToPostDto: convertRoleToPostDto,
};

const rolesHooks = createCrudHooks<IRolePersisted, IRoleGetDTO, IRolePostDTO>(
  rolesConfig,
);

export const useRoles = rolesHooks.useGetAll;
export const useRole = rolesHooks.useGetById;
export const useCreateRole = rolesHooks.useCreate;
export const useUpdateRole = rolesHooks.useUpdate;
export const useDeleteRole = rolesHooks.useDelete;
export const rolesQueryKeys = rolesHooks.queryKeys;
