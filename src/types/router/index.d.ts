import React from "react";
import { Store } from "redux";
import { RouteConfig } from "react-router-config";
import { GetInitialStateType } from "types/components";

interface PreLoadRouteConfig extends RouteConfig {
  getInitialState?: GetInitialStateType<any>;
}

interface MathProps {
  path: string;
  url: string;
  params: any;
}

interface TransformType {
  (props: PreLoadRouteConfig[]): PreLoadRouteConfig[];
}
