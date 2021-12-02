import React from "react";
import { RouteObject } from "react-router";
import { GetInitialStateType } from "types/components";

export interface PreLoadRouteConfig extends RouteObject {
  path: string;
  children?: PreLoadRouteConfig[];
  Component: React.ReactElement | React.ReactComponentElement;
  getInitialState?: GetInitialStateType;
}

export interface TransformType {
  (props: PreLoadRouteConfig[]): PreLoadRouteConfig[];
}

export interface DynamicRouteConfig {
  path: string;
  componentPath?: string;
}
