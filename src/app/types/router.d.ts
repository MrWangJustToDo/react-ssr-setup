import type { PreLoadComponentType } from "./common";
import type { RouteObject } from "react-router";

export interface PreLoadRouteConfig extends RouteObject {
  children?: PreLoadRouteConfig[];
  preLoad?: () => Promise<PreLoadComponentType & { default: PreLoadComponentType }>;
}

export interface TransformType {
  (props: PreLoadRouteConfig[]): PreLoadRouteConfig[];
}

export interface DynamicRouteConfig {
  path: string;
  componentPath?: string;
}
