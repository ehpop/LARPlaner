export type ITagDTO = {
  id: string;
  value: string;
  isUnique?: boolean;
  expiresAfterMinutes?: number;
};

export type ITag = {
  id: string;
  value: string;
  isUnique?: boolean;
  expiresAfterMinutes?: number;
};
