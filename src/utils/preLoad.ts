import { cloneElement, isValidElement } from "react";
import { matchRoutes } from "react-router";

import { apiName } from "config/api";
import { getDataAction_Server } from "store/reducer/server/share/action";

import { log } from "./log";

import type { ComponentClass } from "react";
import type { Params } from "react-router";
import type { GetInitialStateProps, GetInitialStateType, PreLoadComponentType } from "types/components";
import type { PreLoadRouteConfig } from "types/router";
import type { ExpressRequest } from "types/server";
import type { SagaStore } from "types/store";

function preLoad(
  routes: PreLoadRouteConfig[],
  pathName: string,
  store: SagaStore,
  config: { req: ExpressRequest; lang: string }
): Promise<{
  redirect?: string | { code: number; redirect: string };
  error?: string;
  cookies?: { [key: string]: string };
  serverSideProps?: { [key: string]: any };
}>;

function preLoad(
  routes: PreLoadRouteConfig[],
  pathName: string,
  store: SagaStore
): Promise<{
  redirect?: string | { code: number; redirect: string };
  error?: string;
  cookies?: { [key: string]: string };
}>;

function preLoad(
  routes: PreLoadRouteConfig[],
  pathname: string,
  store: SagaStore,
  config?: { req: ExpressRequest; lang: string }
): Promise<void | {
  redirect?: string | { code: number; redirect: string };
  error?: string;
  cookies?: { [props: string]: string };
  serverSideProps?: { [key: string]: any };
}> {
  const branch = matchRoutes(routes, pathname) || [];

  const promises: Promise<{
    redirect?: string | { code: number; redirect: string };
    error?: string;
    cookies?: { [key: string]: string };
    serverSideProps?: { [key: string]: any };
  } | void>[] = [];

  branch.forEach(({ route, params, pathname }) => {
    const match = { params, pathname };
    promises.push(_preLoad({ route: route as PreLoadRouteConfig, store, match, config }));
  });

  return Promise.all(promises).then((val) => {
    if (val.length) {
      return val.filter(Boolean).reduce<{
        redirect?: string | { code: number; redirect: string } | undefined;
        error?: string | undefined;
        cookies?: { [key: string]: string } | undefined;
        serverSideProps?: { [key: string]: any };
      }>((s, c) => {
        if (!c) {
          return s;
        }
        s.serverSideProps = { ...s.serverSideProps, ...c.serverSideProps };
        s.cookies = { ...s.cookies, ...c.cookies };
        s.error = [s.error, c.error].filter(Boolean).join(" || ");
        s.redirect = c.redirect ? c.redirect : s.redirect;
        return s;
      }, {});
    }
    return { redirect: { code: 301, redirect: "/404" } };
  });
}

const hydrateLoad = (routes: PreLoadRouteConfig[], pathname: string) => {
  const branch = matchRoutes(routes, pathname) || [];

  branch.forEach(({ route, params, pathname }) => {
    const match = { params, pathname };
    _hydrateLoad({ route: route as PreLoadRouteConfig, match });
  });
};

const generateServerSidePropsKey = (match: PreLoadProps["match"]) => `__preload-${match.pathname}-${JSON.stringify(match.params)}-props__`;

type PreLoadProps = {
  route: PreLoadRouteConfig;
  store: SagaStore;
  match: { params: Params<string>; pathname: string };
  config?: { req: ExpressRequest; lang: string };
};

type PreLoadType = (props: PreLoadProps) => Promise<{
  redirect?: string | { code: number; redirect: string };
  error?: string;
  cookie?: { [key: string]: string };
  serverSideProps?: { [key: string]: any };
} | void>;

type HydrateLoadType = (props: Pick<PreLoadProps, "route" | "match">) => void;

const _hydrateLoad: HydrateLoadType = ({ route, match }) => {
  if (__CLIENT__ && window.__INITIAL_PROPS_SSR__ && route.element && isValidElement(route.element)) {
    const props = window.__INITIAL_PROPS_SSR__[generateServerSidePropsKey(match)];
    route.element = cloneElement(route.element, props);
  }
};

const resolveGetInitialState = async ({ route }: Pick<PreLoadProps, "route">): Promise<GetInitialStateType | null> => {
  const getInitialStateArray: GetInitialStateType[] = [];
  // for Router
  if (route.getInitialState) {
    getInitialStateArray.push(route.getInitialState);
  }
  // for Component
  if (route.Component) {
    const WrapperComponent = route.Component;
    if (typeof WrapperComponent.load === "function") {
      const loadAbleComponent: PreLoadComponentType & { readonly default?: PreLoadComponentType } = await WrapperComponent.load();
      if (loadAbleComponent.getInitialState && typeof loadAbleComponent.getInitialState === "function") {
        getInitialStateArray.push(loadAbleComponent.getInitialState);
      }
      if (typeof loadAbleComponent.default !== "undefined") {
        const c = loadAbleComponent.default;
        if (c.getInitialState && typeof c.getInitialState === "function") {
          getInitialStateArray.push(c.getInitialState);
        }
      }
    } else {
      const preLoadComponent = WrapperComponent as PreLoadComponentType;
      if (preLoadComponent.getInitialState && typeof preLoadComponent.getInitialState === "function") {
        getInitialStateArray.push(preLoadComponent.getInitialState);
      }
    }
  }

  if (getInitialStateArray.length) {
    return async ({ store, match, config }: GetInitialStateProps) => {
      const res = await Promise.all(
        getInitialStateArray.map((fn) =>
          Promise.resolve()
            .then(() => fn({ store, match, config }))
            .catch((e) => {
              // catch all error by default
              log(`getInitialState error ${e}`, "error");
              return null;
            })
        )
      );
      return res.filter(Boolean).reduce<{
        redirect?: string | { code: number; redirect: string } | undefined;
        error?: string | undefined;
        cookies?: { [key: string]: string } | undefined;
        props?: any;
      }>((s, c) => {
        if (!c) {
          return s;
        }
        s.cookies = { ...s.cookies, ...c.cookies };
        s.error = [s.error, c.error].filter(Boolean).join(" || ");
        s.props = { ...s.props, ...c.props };
        s.redirect = c.redirect ? c.redirect : s.redirect;
        return s;
      }, {});
    };
  } else {
    return null;
  }
};

const _preLoad: PreLoadType = async ({ route, store, match, config }) => {
  const getInitialState = await resolveGetInitialState({ route });
  if (getInitialState) {
    const initialState = await getInitialState({ store, match, config });
    if (initialState) {
      const { props, ...resProps } = initialState;
      if (route.element && isValidElement(route.element)) {
        // support autoInject props for component
        route.element = cloneElement(route.element, props);
        return { ...resProps, serverSideProps: { [generateServerSidePropsKey(match)]: props } };
      }
      return resProps;
    }
  }
};

const preLoadLang = ({ store, lang }: Pick<PreLoadProps, "store"> & { lang: string }): Promise<void> => {
  return new Promise((resolve) => {
    if (store.getState().server.lang.data[lang]) {
      resolve();
    } else {
      store
        .dispatch(getDataAction_Server({ name: apiName.lang, lang }))
        .then(() => resolve())
        .catch(() => resolve());
    }
  });
};

function preLoadWrapper(preLoad: GetInitialStateType): (props: ComponentClass & { getInitialState?: GetInitialStateType }) => void {
  function Wrapper(Component: ComponentClass & { getInitialState?: GetInitialStateType }): void {
    Component.getInitialState = preLoad;
  }
  return Wrapper;
}

export { preLoad, preLoadLang, preLoadWrapper, hydrateLoad };
