import { SVGProps } from "react";
import { ZonedDateTime } from "@internationalized/date";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type IRole = {
  id: number | null;
  name: string;
  description: string;
  imageUrl: string;
  tags: string[];
};
export type IRoleList = IRole[];

export type IScenario = {
  id: number | null;
  name: string;
  description: string;
  roles: IScenarioRoleList;
  items: IScenarioItemList;
};
export type IScenarioList = IScenario[];

export type IEvent = {
  id: number | null;
  title: string;
  img: string;
  date: ZonedDateTime;
  location: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  description: string;
  scenarioId: number | null;
  assignedRoles: {
    scenarioRoleId: IScenarioRole["id"];
    assignedEmail: string;
  }[];
};
export type IEventList = IEvent[];

export type IScenarioRole = {
  id: number | null;
  roleId: number | null;
  scenarioId: number | null;
  name: string;
  description: string;
  gmNotes: string;
};
export type IScenarioRoleList = IScenarioRole[];

export type IScenarioItem = {
  id: number | null;
  scenarioId: number | null;
  name: string;
  description: string;
  imageUrl: string;
  requiredTags: ITag[];
};
export type IScenarioItemList = IScenarioItem[];

export type ISkill = {
  key: string;
  name: string;
};

export type ITag = {
  key: string;
  name: string;
};
