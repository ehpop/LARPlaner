import { IGetDTO, IPostDTO } from "@/types/dto.types";

export type ITag = {
  id?: string;
  value: string;
  isUnique?: boolean;
  expiresAfterMinutes?: number;
};

export type ITagGetDTO = IGetDTO & {
  value: string;
  isUnique?: boolean;
  expiresAfterMinutes?: number;
};

export type ITagPostDTO = IPostDTO & {
  value: string;
  isUnique?: boolean;
  expiresAfterMinutes?: number;
};
