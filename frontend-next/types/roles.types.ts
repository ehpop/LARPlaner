import { ITag } from "@/types/tags.types";

export type IRole = {
  id: number | null;
  name: string;
  description: string;
  tags: ITag[];
};
export type IRoleList = IRole[];
