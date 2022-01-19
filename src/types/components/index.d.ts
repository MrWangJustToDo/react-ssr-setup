import type { Params } from "react-router";
import type { PreLoadRouteConfig } from "types/router";
import type { ExpressRequest } from "types/server";
import type { SagaStore } from "types/store";

export interface GetInitialStateProps {
  store: SagaStore;
  match: { params: Params<string>; pathname: string };
  config?: { req: ExpressRequest };
}

export interface GetInitialStateType {
  (props: GetInitialStateProps):
    | Promise<{
        redirect?: string | { code: number; redirect: string };
        error?: string;
        cookies?: { [key: string]: string };
        props?: any; // support auto inject props when data loaded
      } | void>
    | {
        redirect?: string | { code: number; redirect: string };
        error?: string;
        cookies?: { [key: string]: string };
        props?: any; // support auto inject props when data loaded
      }
    | void;
}

export interface PreLoadComponentType<T = any> {
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
  (props: WrapperRouteProps): MemoExoticComponent;
}

/* LoadingBar */
export interface LoadingBarWrapperType {
  (props: { loading?: boolean }): JSX.Element | null;
}
