import { matchRoutes, Params } from "react-router";
import { getDataAction_Server } from "store/reducer/server/share/action";
import { apiName } from "config/api";
import type { ComponentClass } from "react";
import type { SagaStore } from "types/store";
import type { ExpressRequest } from "types/server";
import type { PreLoadRouteConfig } from "types/router";
import type { GetInitialStateType, PreLoadComponentType } from "types/components";

function preLoad(
  routes: PreLoadRouteConfig[],
  pathName: string,
  store: SagaStore,
  config: { req: ExpressRequest; lang: string }
): Promise<{
  redirect?: string;
  error?: string;
  headers?: { [key: string]: string };
}>;
function preLoad(
  routes: PreLoadRouteConfig[],
  pathName: string,
  store: SagaStore
): Promise<{
  redirect?: string;
  error?: string;
  cookies?: { [key: string]: string };
}>;

function preLoad(
  routes: PreLoadRouteConfig[],
  pathname: string,
  store: SagaStore,
  config?: { req: ExpressRequest; lang: string }
): Promise<void | { redirect?: string; error?: string; headers?: { [props: string]: string }; cookies?: { [props: string]: string } }> {
  const branch = matchRoutes(routes, pathname) || [];

  const promises: Promise<{
    redirect?: string;
    error?: string;
    header?: { [key: string]: string };
  } | void>[] = [];

  branch.forEach(({ route, params, pathname }) => {
    const match = { params, pathname };
    promises.push(
      // for component
      preLoadFromComponent({ route: route as PreLoadRouteConfig, store, match, config }),
      // for router
      preLoadFromRoute({ route: route as PreLoadRouteConfig, store, match, config })
    );
  });

  return Promise.all(promises).then((val) => {
    if (val.length) {
      return val.filter(Boolean).reduce((res, c) => {
        return { ...res, ...c };
      }, {});
    }
    return { redirect: "/404" };
  });
}

type PreLoadProps = {
  route: PreLoadRouteConfig;
  store: SagaStore;
  match: { params: Params<string>; pathname: string };
  config?: { req: ExpressRequest; lang: string };
};

type PreLoadType = (props: PreLoadProps) => Promise<{
  redirect?: string;
  error?: string;
  header?: { [key: string]: string };
} | void>;

const preLoadFromComponent: PreLoadType = ({ route, store, match, config }) => {
  return new Promise((resolve) => {
    const loadAbleComponent = route.Component;
    if (typeof loadAbleComponent.load === "function") {
      loadAbleComponent.load().then((component: PreLoadComponentType & { readonly default?: PreLoadComponentType }) => {
        // like next.js, will handle a initial function which not bind in the component
        if (component.getInitialState && typeof component.getInitialState === "function") {
          Promise.resolve()
            .then(() => (component.getInitialState ? component.getInitialState({ store, match, config }) : undefined))
            .then(resolve)
            .catch(resolve);
        } else if (typeof component.default !== "undefined") {
          const target = component.default;
          if (target.getInitialState && typeof target.getInitialState === "function") {
            Promise.resolve()
              .then(() => (target.getInitialState ? target.getInitialState({ store, match, config }) : undefined))
              .then(resolve)
              .catch(resolve);
          } else {
            resolve();
          }
        } else {
          resolve();
        }
      });
    } else {
      const preLoadComponent = route.Component as PreLoadComponentType;
      if (preLoadComponent.getInitialState && typeof preLoadComponent.getInitialState === "function") {
        Promise.resolve()
          .then(() => preLoadComponent.getInitialState && preLoadComponent.getInitialState({ store, match, config }))
          .then(resolve)
          .catch(resolve);
      } else {
        resolve();
      }
    }
  });
};

const preLoadFromRoute: PreLoadType = ({ route, store, match, config }) => {
  return new Promise((resolve) => {
    if (route.getInitialState && typeof route.getInitialState === "function") {
      Promise.resolve()
        .then(() => route.getInitialState && route.getInitialState({ store, match, config }))
        .then(resolve)
        .catch(resolve);
    } else {
      resolve();
    }
  });
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

export { preLoad, preLoadLang, preLoadWrapper };
