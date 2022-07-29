import type { PreLoadRouteConfig } from "./router";
import type { RootStore } from "@app/store";
import type { RedirectType } from "@app/util/preLoad";
import type { Params } from "react-router";

export interface GetInitialStateProps {
  store: RootStore;
  pathName: string;
  params: Params<string>;
  query: URLSearchParams;
}

export interface GetInitialStateType {
  (props: GetInitialStateProps):
    | Promise<{
        redirect?: RedirectType;
        error?: string;
        props?: Record<string, unknown>; // support auto inject props when data loaded
      } | void>
    | {
        redirect?: RedirectType;
        error?: string;
        props?: Record<string, unknown>; // support auto inject props when data loaded
      }
    | void;
}

export interface GetInitialStateWithFullPropsType {
  (props: GetInitialStateProps):
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
  getInitialState?: GetInitialStateType;
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

/* initial state */
export interface GetServerSideProps {
  (props: { pathName: string; params: Params<string>; query: URLSearchParams }): Promise<{
    redirect?: RedirectType;
    error?: string;
    props?: Record<string, unknown>;
  }>;
}
