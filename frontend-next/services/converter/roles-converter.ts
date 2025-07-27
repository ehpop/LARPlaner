import {
  IRole,
  IRoleGetDTO,
  IRolePersisted,
  IRolePostDTO,
} from "@/types/roles.types";

export function convertGetDtoToRole(dto: IRoleGetDTO): IRolePersisted {
  return { ...dto } as IRolePersisted;
}

export function convertRoleToPostDto(role: IRole): IRolePostDTO {
  return { ...role, tags: role.tags.map((t) => t.id) } as IRolePostDTO;
}
