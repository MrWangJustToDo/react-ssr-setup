import { match } from "react-router";
import { matchRoutes } from "react-router-config";
import type { ComponentClass } from "react";
import type { SagaStore } from "types/store";
import type { ExpressRequest } from "types/server";
import type { MathProps, PreLoadRouteConfig } from "types/router";
import type { GetInitialStateType, PreLoadComponentType } from "types/components";

function preLoad(
  routes: PreLoadRouteConfig[],
  pathName: string,
  store: SagaStore,
  routerAnimate: { [props: string]: { routerIn?: string; routerOut?: string } },
  config: { req: ExpressRequest }
): Promise<{
  redirect?: string;
  error?: string;
  headers?: { [key: string]: string };
}>;
function preLoad(
  routes: PreLoadRouteConfig[],
  pathName: string,
  store: SagaStore,
  routerAnimate: { [props: string]: { routerIn?: string; routerOut?: string } }
): Promise<{
  redirect?: string;
  error?: string;
  cookies?: { [key: string]: string };
}>;

function preLoad(
  routes: PreLoadRouteConfig[],
  pathname: string,
  store: SagaStore,
  routerAnimate: { [props: string]: { routerIn?: string; routerOut?: string } },
  config?: { req: ExpressRequest }
): Promise<void | { redirect?: string; error?: string; headers?: { [props: string]: string }; cookies?: { [props: string]: string } }> {
  const branch = matchRoutes<MathProps, PreLoadRouteConfig>(routes, pathname);
  const promises: Promise<{
    redirect?: string;
    error?: string;
    header?: { [key: string]: string };
  } | void>[] = [];
  branch.forEach(({ route, match }) => {
    promises.push(
      // for component
      preLoadFromComponent({ route, store, match, animateConfig: routerAnimate, config }),
      // for router
      preLoadFromRoute({ route, store, match, animateConfig: routerAnimate, config })
    );
  });
  return Promise.all(promises).then((val) =>
    val.filter(Boolean).reduce((res, c) => {
      return { ...res, ...c };
    }, {})
  );
}

type PreLoadProps = {
  route: PreLoadRouteConfig;
  store: SagaStore;
  match: match<MathProps>;
  animateConfig: { [pathname: string]: { routerIn?: string; routerOut?: string } };
  config?: { req: ExpressRequest };
};

type PreLoadType = (props: PreLoadProps) => Promise<{
  redirect?: string;
  error?: string;
  header?: { [key: string]: string };
} | void>;

const preLoadFromComponent: PreLoadType = ({ route, store, match, animateConfig, config }) => {
  return new Promise((resolve) => {
    const component = route.component as any;
    if (typeof component.load === "function") {
      component.load().then((component: { readonly default: PreLoadComponentType }) => {
        const Target = component.default;
        if (Target.routerIn || Target.routerOut) {
          animateConfig[match.path] = { routerIn: Target.routerIn, routerOut: Target.routerOut };
        }
        if (Target.getInitialState && typeof Target.getInitialState === "function") {
          Promise.resolve()
            .then(() => Target.getInitialState && Target.getInitialState({ store, match, config }))
            .then(resolve)
            .catch(resolve);
        } else {
          resolve();
        }
      });
    } else {
      const preLoadComponent = route.component as PreLoadComponentType;
      if (preLoadComponent.routerIn || preLoadComponent.routerOut) {
        animateConfig[match.path] = { routerIn: preLoadComponent.routerIn, routerOut: preLoadComponent.routerOut };
      }
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

const preLoadFromRoute: PreLoadType = ({ route, store, match, animateConfig, config }) => {
  return new Promise((resolve) => {
    if (route.animationRouter) {
      animateConfig[match.path] = { routerIn: route.animationRouter.routerIn, routerOut: route.animationRouter.routerOut };
    }
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

function preLoadWrapper(preLoad: GetInitialStateType): (props: ComponentClass & { getInitialState?: GetInitialStateType }) => void {
  function Wrapper(Component: ComponentClass & { getInitialState?: GetInitialStateType }): void {
    Component.getInitialState = preLoad;
  }
  return Wrapper;
}

export { preLoad, preLoadWrapper };
