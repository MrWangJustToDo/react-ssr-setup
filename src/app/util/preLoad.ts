import { matchRoutes } from "react-router";

import type { RootStore } from "@app/store";
import type { PreLoadStateProps, GetInitialStateType, PreLoadStateType, AllPreLoadStateType, PreLoadComponentType } from "@app/types/common";
import type { PreLoadRouteConfig } from "@app/types/router";
import type { ComponentClass } from "react";
import type { Params } from "react-router";

export type RedirectType = {
  code?: number;
  location: { pathName: string; query: URLSearchParams };
};

function preLoad(
  routes: PreLoadRouteConfig[],
  pathname: string,
  query: URLSearchParams,
  store: RootStore
): Promise<{
  // used to preload script by page initial
  page?: string[];
  error?: string;
  props?: Record<string, Record<string, unknown>>;
  redirect?: RedirectType;
}> {
  const branch = matchRoutes(routes, pathname) || [];

  const promises: Promise<{
    error?: string;
    page?: string[];
    redirect?: RedirectType;
    props?: Record<string, Record<string, unknown>>;
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
        props?: Record<string, Record<string, unknown>>;
        redirect?: RedirectType;
      }>((s, c) => {
        if (!c) {
          return s;
        }
        s.props = { ...s.props, ...c.props };
        s.page = (s.page || []).concat(c.page || []);
        s.error = [s.error, c.error].filter(Boolean).join(" || ");
        s.redirect = c.redirect ? c.redirect : s.redirect;
        return s;
      }, {});
      return allInitialProps;
    }
    return {
      redirect: {
        code: 301,
        location: { pathName: "/404", query: new URLSearchParams() },
      },
    };
  });
}

const preLoadPropsKey = (pathName: string, query: URLSearchParams) => `__preload-${pathName}-${query.toString()}-props__`;

type PreLoadProps = {
  route: PreLoadRouteConfig;
  store: RootStore;
  match: { params: Params<string>; pathname: string };
  query: URLSearchParams;
};

type PreLoadType = (props: PreLoadProps) => Promise<{
  error?: string;
  page?: string[];
  redirect?: RedirectType;
  props?: Record<string, Record<string, unknown>>;
} | void>;

const resolvePreLoadStateFunction = async ({ route }: Pick<PreLoadProps, "route">): Promise<AllPreLoadStateType | null> => {
  const preLoadStateArray: PreLoadStateType[] = [];
  // for preload
  if (route.preLoad) {
    const component = await route.preLoad();
    if (component.getInitialState) {
      preLoadStateArray.push(component.getInitialState);
    }
    if (component.default) {
      if (component.default.getInitialState) {
        preLoadStateArray.push(component.default.getInitialState);
      }
    }
  }
  // for Component
  if (route.element) {
    const typedElement = route.element as unknown as PreLoadComponentType;
    if (typeof typedElement?.getInitialState === "function") {
      preLoadStateArray.push(typedElement.getInitialState);
    }
  }

  if (preLoadStateArray.length) {
    return async ({ store, pathName, params, query }: PreLoadStateProps) => {
      const appState = store.getState();
      const propsKey = preLoadPropsKey(pathName, query);
      // current page props has already loaded
      if (appState.client.clientProps.data[propsKey]) {
        return void 0;
      }
      const res = await Promise.all(
        preLoadStateArray.map((fn) =>
          Promise.resolve()
            .then(() => fn({ store, pathName, params, query }))
            .catch((e) => {
              // catch all error by default
              console.error(`getInitialState error ${e.toString()}`);
              return null;
            })
        )
      );

      const result = res.filter(Boolean).reduce<{
        redirect?: RedirectType;
        error?: string;
        props?: Record<string, unknown>;
      }>((s, c) => {
        if (!c) {
          return s;
        }
        s.error = [s.error, c.error].filter(Boolean).join(" || ");
        s.props = { ...s.props, ...c.props };
        s.redirect = c.redirect ? c.redirect : s.redirect;
        return s;
      }, {});

      return {
        ...result,
        props: { [preLoadPropsKey(pathName, query)]: result.props || {} },
      };
    };
  } else {
    return null;
  }
};

const _preLoad: PreLoadType = async ({ route, store, match, query }) => {
  const getInitialState = await resolvePreLoadStateFunction({ route });
  if (getInitialState) {
    const initialState = await getInitialState({
      store,
      pathName: match.pathname,
      params: match.params,
      query,
    });
    if (route.path) {
      return { ...initialState, page: [route.path] };
    } else {
      return initialState;
    }
  } else if (route.path) {
    return { page: [route.path] };
  }
};

function initialStateWrapper<T extends Record<string, unknown>>(getInitialState: GetInitialStateType<T>) {
  function Wrapper(Component: ComponentClass<T> & { getInitialState?: GetInitialStateType<T> }): void {
    Component.getInitialState = getInitialState;
  }
  return Wrapper;
}

export { preLoad, initialStateWrapper, preLoadPropsKey };
