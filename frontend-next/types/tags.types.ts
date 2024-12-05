import { ZonedDateTime } from "@internationalized/date";

export type ITag = {
  id: string;
  value: string;
  isUnique?: boolean;
  expiresAt?: ZonedDateTime;
};
