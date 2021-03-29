import { Store } from "redux";
import React, { MemoExoticComponent } from "react";
import { HelmetData } from "react-helmet-async";
import { RouteConfig } from "react-router-config";
import { LoadableComponent } from "@loadable/component";
import { MathProps, PreLoadRouteConfig } from "types/router";

/* Template */
interface HTMLProps {
  children?: string;
  link: React.ReactElement[];
  script: React.ReactElement[];
  state?: string;
  helmetContext?: { helmet?: HelmetData };
}
interface HTMLType {
  (props: HTMLProps): JSX.Element;
}

/* WraperRoute */
interface WraperRouteProps {
  children: JSX.Element;
  routes: PreLoadRouteConfig[];
}
interface WraperRouteType {
  (props: WraperRouteProps): MemoExoticComponent;
}

/* PreLoadComponent */
interface PreLoadComponentType {
  <T>(props: T): JSX.Element;
  getInitialState?: (store: Store, math: MathProps) => any;
}

/* LoadingBar */
interface LoadingBarProps {
  height?: number;
  present?: number;
  loading?: boolean;
}

interface LoadingBarType {
  (props: LoadingBarProps): JSX.Element;
}

/* loadingBar */
interface BarProps extends LoadingBarProps {
  autoAdd: () => NodeJS.Timeout;
}

interface BarType {
  (props: BarProps): JSX.Element;
}
