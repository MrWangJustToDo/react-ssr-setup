import { RouteConfig } from "react-router-config";
import { GetInitialStateType } from "types/components";

export interface PreLoadRouteConfig extends RouteConfig {
  path: string;
  getInitialState?: GetInitialStateType;
  animationRouter?: {
    routerIn?: string;
    routerOut?: string;
  };
}

export interface MathProps {
  [props: string]: string;
}

export interface TransformType {
  (props: PreLoadRouteConfig[]): PreLoadRouteConfig[];
}

export interface DynamicRouteConfig {
  path: string;
  exact?: boolean;
  componentPath?: string;
}
