import { IRole, IRoleGetDTO, IRolePostDTO } from "@/types/roles.types";
import { ITag } from "@/types/tags.types";

export function convertGetDtoToRole(dto: IRoleGetDTO): IRole {
  return { ...dto } as IRole;
}

export function convertRoleToPostDto(role: IRole): IRolePostDTO {
  return {
    ...role,
    tags: role.tags.map((tag) => tag.id) as ITag["id"][],
  } as IRolePostDTO;
}
