import type { PreLoadRouteConfig } from "./route";
import type { RedirectType } from "@client/utils";
import type { RootStore } from "@shared";
import type { Params } from "react-router";

export interface PreLoadStateProps {
  store: RootStore;
  pathName: string;
  params: Params<string>;
  query: URLSearchParams;
}

export interface GetInitialStateType<P = Record<string, unknown>> {
  (props: PreLoadStateProps):
    | Promise<{
        redirect?: RedirectType;
        error?: string;
        props?: P; // support auto inject props when data loaded
      } | void>
    | {
        redirect?: RedirectType;
        error?: string;
        props?: P; // support auto inject props when data loaded
      }
    | void;
}

export interface PreLoadStateType<P = Record<string, unknown>> {
  (props: PreLoadStateProps):
    | Promise<{
        redirect?: RedirectType;
        error?: string;
        props?: P; // support auto inject props when data loaded
      } | void>
    | {
        redirect?: RedirectType;
        error?: string;
        props?: P; // support auto inject props when data loaded
      }
    | void;
}

export interface AllPreLoadStateType {
  (props: PreLoadStateProps):
    | Promise<{
        redirect?: RedirectType;
        error?: string;
        props?: Record<string, Record<string, unknown>>; // support auto inject props when data loaded
      } | void>
    | {
        redirect?: RedirectType;
        error?: string;
        props?: Record<string, Record<string, unknown>>; // support auto inject props when data loaded
      }
    | void;
}

export interface PreLoadComponentType<T = Record<string, unknown>> {
  (props: T): JSX.Element;
  getInitialState?: GetInitialStateType<T>;
}

/* WrapperRoute */
interface WrapperRouteProps {
  children: React.ReactElement | React.ReactElement[] | string;
  routes: PreLoadRouteConfig[];
  LoadingBar: LoadingBarWrapperType;
  animationRouter?: boolean;
}
export interface WrapperRouteType {
  (props: WrapperRouteProps): JSX.Element | null;
}

/* LoadingBar */
export interface LoadingBarWrapperType {
  (props: { loading?: boolean }): JSX.Element | null;
}
