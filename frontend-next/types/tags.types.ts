import { ZonedDateTime } from "@internationalized/date";

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

export type IAppliedTag = {
  id?: string;
  tag: ITag;
  userEmail: string;
  userID: string;
  appliedToUserAt: ZonedDateTime;
};

export type IAppliedTagGetDTO = IGetDTO & {
  tag: ITagGetDTO;
  userEmail: string;
  userID: string;
  appliedToUserAt: ZonedDateTime;
};
