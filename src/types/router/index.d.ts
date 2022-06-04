import type { LoadableComponent } from "@loadable/component";
import type { RouteObject } from "react-router";
import type { GetInitialStateType, PreLoadComponentType } from "types/components";

export interface PreLoadRouteConfig extends RouteObject {
  children?: PreLoadRouteConfig[];
  Component: LoadableComponent | PreLoadComponentType;
  getInitialState?: GetInitialStateType;
}

export interface TransformType {
  (props: PreLoadRouteConfig[]): PreLoadRouteConfig[];
}

export interface DynamicRouteConfig {
  path: string;
  componentPath?: string;
}
