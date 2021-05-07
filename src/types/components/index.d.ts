import { Store } from "redux";
import React, { MemoExoticComponent } from "react";
import { HelmetData } from "react-helmet-async";
import { MathProps, PreLoadRouteConfig } from "types/router";

/* Template */
interface HTMLProps {
  children?: string;
  link?: React.ReactElement[];
  script?: React.ReactElement[];
  state?: string;
  helmetContext?: { helmet?: HelmetData };
}
interface HTMLType {
  (props: HTMLProps): JSX.Element;
}

/* WraperRoute */
interface WraperRouteProps {
  children: React.ReactElement | React.ReactElement[] | string;
  routes: PreLoadRouteConfig[];
  LoadingBar: (props: BarProps) => React.ReactElement | null;
}
interface WraperRouteType {
  (props: WraperRouteProps): MemoExoticComponent;
}

/* PreLoadComponent */
interface GetInitialStateType<T> {
  (store: Store, math: MathProps): Promise<T>;
}
interface PreLoadComponentType<O> {
  <T>(props: T): JSX.Element;
  getInitialState?: GetInitialStateType<O>;
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
interface LoadingBarWrapperType {
  (props: { loading?: boolean }): JSX.Element | null;
}
interface BarProps extends LoadingBarProps {
  autoAdd?: () => NodeJS.Timeout;
}

interface BarType {
  (props: BarProps & LoadingBarProps): JSX.Element | null;
}
