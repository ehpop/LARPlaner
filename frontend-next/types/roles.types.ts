import { ITag } from "@/types/tags.types";
import { IGetDTO, IPostDTO } from "@/types/dto.types";

/**
 * Role DTO for POST and UPDATE requests
 */
export type IRolePostDTO = IPostDTO & {
  name: string;
  description: string;
  tags: ITag["id"][];
};

/**
 * Role DTO for GET requests
 */
export type IRoleGetDTO = IGetDTO & {
  name: string;
  description: string;
  tags: ITag[];
};

export type IRole = {
  id: number | null;
  name: string;
  description: string;
  tags: ITag[];
};
