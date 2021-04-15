import { Store } from "redux";
import { ComponentClass } from "react";
import { matchRoutes } from "react-router-config";
import { PreLoadType } from "types/share";
import { MathProps, PreLoadRouteConfig } from "types/router";
import { GetInitialStateType, PreLoadComponentType } from "types/components";

let preLoad: PreLoadType;

preLoad = (routes, pathname, store) => {
  const branch = matchRoutes<MathProps, PreLoadRouteConfig>(routes, pathname);
  const promises: Promise<void>[] = [];
  branch.forEach(({ route, match }) => {
    promises.push(
      // for component
      preLoadFromComponent(route, store, match),
      // for router
      preLoadFromRoute(route, store, match)
    );
  });
  return Promise.all(promises);
};

function preLoadFromComponent(route: PreLoadRouteConfig, store: Store, match: MathProps) {
  return new Promise<void>((resolve) => {
    (route.component as any).load().then((component: { readonly default: PreLoadComponentType<any> }) => {
      const Target = component.default;
      if (Target.getInitialState && typeof Target.getInitialState === "function") {
        Promise.resolve(Target.getInitialState(store, match))
          .then((res) => {
            if (!(Target as any).WrappedComponent) {
              Target.initialData = res;
            } else {
              // for connect function
              (Target as any).WrappedComponent.initialData = res;
            }
          })
          .then(resolve)
          .catch(resolve);
      } else {
        resolve();
      }
    });
  });
}

function preLoadFromRoute(route: PreLoadRouteConfig, store: Store, match: MathProps) {
  return new Promise<void>((resolve) => {
    if (route.getInitialState && typeof route.getInitialState === "function") {
      Promise.resolve(route.getInitialState(store, match)).then(resolve).catch(resolve);
    } else {
      resolve();
    }
  });
}

function preLoadWraper<T>(preLoad: GetInitialStateType<T>) {
  function Wraper(Component: ComponentClass & { getInitialState?: GetInitialStateType<T> }) {
    Component.getInitialState = preLoad;
  }
  return Wraper;
}

export { preLoad, preLoadWraper };
