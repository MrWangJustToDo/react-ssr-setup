import { match } from "react-router";
import { SagaStore } from "types/store";
import { ExpressRequest } from "types/server";
import { PreLoadRouteConfig, MathProps } from "types/router";

interface GetInitialStateProps {
  store: SagaStore;
  match: match<MathProps>;
  config?: { req: ExpressRequest };
}

export interface GetInitialStateType {
  (props: GetInitialStateProps): Promise<{
    redirect?: string;
    error?: string;
    headers?: { [key: string]: string };
    cookies?: { [key: string]: string };
  } | void>;
}

export interface PreLoadComponentType<T = any> {
  (props: T): JSX.Element;
  getInitialState?: GetInitialStateType;
  routerIn?: string;
  routerOut?: string;
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
