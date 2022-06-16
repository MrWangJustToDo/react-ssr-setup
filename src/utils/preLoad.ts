import { createElement, isValidElement, memo } from "react";
import { matchRoutes } from "react-router";

import { actionName } from "config/action";
import { apiName } from "config/api";
import { useGetInitialProps } from "hooks/useGetInitialProps";
import { setDataSuccess_client } from "store/reducer/client/share/action";
import { getDataAction_Server } from "store/reducer/server/share/action";

import { log } from "./log";

import type { ComponentClass, LazyExoticComponent, ComponentType } from "react";
import type { Params } from "react-router";
import type { GetInitialStateProps, GetInitialStateType, PreLoadComponentType } from "types/components";
import type { PreLoadRouteConfig } from "types/router";
import type { SagaStore } from "types/store";

export type RedirectType = { code?: number; location: { pathName: string; query: URLSearchParams } };

function preLoad(
  routes: PreLoadRouteConfig[],
  pathname: string,
  query: URLSearchParams,
  store: SagaStore
): Promise<{
  // used to preload script by page initial
  page?: string[];
  error?: string;
  redirect?: RedirectType;
  cookies?: { [props: string]: string };
}> {
  const branch = matchRoutes(routes, pathname) || [];

  const promises: Promise<{
    error?: string;
    page?: string[];
    redirect?: RedirectType;
    cookies?: { [key: string]: string };
  } | void>[] = [];

  branch.forEach(({ route, params, pathname }) => {
    const match = { params, pathname };
    promises.push(_preLoad({ route: route as PreLoadRouteConfig, store, match, query }));
  });

  return Promise.all(promises).then((val) => {
    if (val.length) {
      const allInitialProps = val.filter(Boolean).reduce<{
        error?: string;
        page?: string[];
        redirect?: RedirectType;
        cookies?: { [key: string]: string };
      }>((s, c) => {
        if (!c) {
          return s;
        }
        if (c.page) {
          s.page = (s.page || []).concat(c.page);
        }
        s.cookies = { ...s.cookies, ...c.cookies };
        s.error = [s.error, c.error].filter(Boolean).join(" || ");
        s.redirect = c.redirect ? c.redirect : s.redirect;
        return s;
      }, {});
      return allInitialProps;
    }
    return { redirect: { code: 301, location: { pathName: "/404", query: new URLSearchParams() } } };
  });
}

const generateInitialPropsKey = (pathName: string, query: URLSearchParams) => `__preload-${pathName}-${query.toString()}-props__`;

type PreLoadProps = {
  route: PreLoadRouteConfig;
  store: SagaStore;
  match: { params: Params<string>; pathname: string };
  query: URLSearchParams;
};

type PreLoadType = (props: PreLoadProps) => Promise<{
  error?: string;
  page?: string[];
  redirect?: RedirectType;
  cookie?: { [key: string]: string };
} | void>;

const resolveGetInitialStateFunction = async ({ route }: Pick<PreLoadProps, "route">): Promise<GetInitialStateType | null> => {
  const getInitialStateArray: GetInitialStateType[] = [];
  // for Router
  if (route.getInitialState) {
    getInitialStateArray.push(route.getInitialState);
  }
  // for preload
  if (route.preLoad) {
    const component = await route.preLoad();
    if (component.getInitialState) getInitialStateArray.push(component.getInitialState);
    if (component.default && component.default.getInitialState) getInitialStateArray.push(component.default.getInitialState);
  }
  // for Component
  if (route.element) {
    if (typeof (route.element as unknown as PreLoadComponentType)?.getInitialState === "function") {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      getInitialStateArray.push((route.element as unknown as PreLoadComponentType).getInitialState!);
    }
  }

  if (getInitialStateArray.length) {
    return async ({ store, pathName, params, query }: GetInitialStateProps) => {
      const res = await Promise.all(
        getInitialStateArray.map((fn) =>
          Promise.resolve()
            .then(() => fn({ store, pathName, params, query }))
            .catch((e) => {
              // catch all error by default
              log(`getInitialState error ${e}`, "error");
              return null;
            })
        )
      );
      return res.filter(Boolean).reduce<{
        redirect?: RedirectType;
        error?: string;
        cookies?: { [key: string]: string };
        props?: Record<string, unknown>;
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

const _preLoad: PreLoadType = async ({ route, store, match, query }) => {
  const getInitialState = await resolveGetInitialStateFunction({ route });
  if (getInitialState) {
    const initialState = await getInitialState({ store, pathName: match.pathname, params: match.params, query });
    const { props, ...resProps } = initialState || {};
    if (route.element && props && isValidElement(route.element) && !resProps.error && !resProps.redirect) {
      // normally this is only happen on the router page
      // support fast refresh
      const serverSideProps = {
        [generateInitialPropsKey(match.pathname, query)]: props,
      };
      store.dispatch(setDataSuccess_client({ name: actionName.globalInitialProps, data: serverSideProps }));
    }
    if (route.path) {
      return { ...resProps, page: [route.path] };
    } else {
      return resProps;
    }
  } else if (route.path) {
    return { page: [route.path] };
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

function AutoInjectInitialProps(Component: LazyExoticComponent<ComponentType<Record<string, unknown>>>) {
  const memoComponent = memo(Component);
  const RouterComponentWithProps = () => {
    const props = useGetInitialProps();

    return createElement(memoComponent, props);
  };
  return RouterComponentWithProps;
}

export { preLoad, preLoadLang, preLoadWrapper, generateInitialPropsKey, AutoInjectInitialProps };
