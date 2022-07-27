import type { PreLoadComponentType, GetInitialStateType } from './common';
import type { RouteObject } from 'react-router';

export interface PreLoadRouteConfig extends RouteObject {
  children?: PreLoadRouteConfig[];
  preLoad?: () => Promise<
    PreLoadComponentType & { default: PreLoadComponentType }
  >;
  getInitialState?: GetInitialStateType;
}

export interface TransformType {
  (props: PreLoadRouteConfig[]): PreLoadRouteConfig[];
}

export interface DynamicRouteConfig {
  path: string;
  componentPath?: string;
}
