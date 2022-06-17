import type { RouteObject } from "react-router";
import type { GetInitialStateType, PreLoadComponentType } from "types/components";

export interface PreLoadRouteConfig extends RouteObject {
  children?: PreLoadRouteConfig[];
  preLoad?: () => Promise<PreLoadComponentType & { default: PreLoadComponentType }>;
  getInitialState?: GetInitialStateType;
}

export interface TransformType {
  (props: PreLoadRouteConfig[]): PreLoadRouteConfig[];
}

export interface DynamicRouteConfig {
  path: string;
  componentPath?: string;
}
