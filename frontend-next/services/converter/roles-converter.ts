import { IRole, IRoleGetDTO, IRolePostDTO } from "@/types/roles.types";

export function convertGetDtoToRole(dto: IRoleGetDTO): IRole {
  return { ...dto } as IRole;
}

export function convertRoleToPostDto(role: IRole): IRolePostDTO {
  return { ...role } as IRolePostDTO;
}
