import { Store } from "redux";
import { HelmetData } from "react-helmet-async";
import React, { MemoExoticComponent, RefObject } from "react";
import { PreLoadRouteConfig, RouterProps } from "types/router";
import { ExpressRequest } from "types/server";
import { Response } from "express";

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
  animationRouter?: boolean;
}
interface WraperRouteType {
  (props: WraperRouteProps): MemoExoticComponent;
}

/* PreLoadComponent */
interface GetInitialStateType {
  (store: Store, math: RouterProps, req?: ExpressRequest, res?: Response): Promise<void>;
}
interface PreLoadComponentType {
  <T>(props: T): JSX.Element;
  getInitialState?: GetInitialStateType;
  routerIn?: string;
  routerOut?: string;
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

interface BarType {
  (props: { forwardRef: RefObject<HTMLDivElement> }): JSX.Element | null;
}
