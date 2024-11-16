export type IRole = {
  id: number | null;
  name: string;
  description: string;
  tags: ITag[];
};
export type IRoleList = IRole[];

export type ITag = {
  key: string;
  name: string;
};
