import { ComponentClass } from "react";
import { Store } from "redux";
import { matchRoutes } from "react-router-config";
import { level, log } from "./log";
import { PreLoadType } from "types/share";
import { MathProps, PreLoadRouteConfig } from "types/router";
import { GetInitialStateType, PreLoadComponentType } from "types/components";

let preLoad: PreLoadType;

preLoad = (routes, pathname, store) => {
  const branch = matchRoutes<MathProps, PreLoadRouteConfig>(routes, pathname);
  const promises: Promise<[void, void]>[] = [];
  branch.forEach(({ route, match }, index) => {
    promises.push(
      Promise.all([
        // for component
        preLoadFromComponent(route, store, match),
        // for router
        preLoadFromRoute(route, index, store, match),
      ])
    );
  });
  return Promise.all(promises);
};

function preLoadFromComponent(route: PreLoadRouteConfig, store: Store, match: MathProps) {
  return new Promise<void>((resolve) => {
    (route.component as any).load().then((component: { default: PreLoadComponentType }) => {
      const target = component.default;
      if (target.getInitialState) {
        Promise.resolve(target.getInitialState(store, match)).then(resolve).catch(resolve);
      } else {
        resolve();
      }
    });
  });
}

function preLoadFromRoute(route: PreLoadRouteConfig, index: number, store: Store, match: MathProps) {
  new Promise<void>((resolve) => {
    if (route.preLoadPromises && route.endDispatchActions) {
      const preLoadPromises = route.preLoadPromises;
      const startDispatchActions = route.startDispatchActions;
      const endDispatchActions = route.endDispatchActions;
      if (preLoadPromises.length !== endDispatchActions.length) {
        log(`preload length not equals dispatch length`, level.error);
        resolve();
      } else {
        if (startDispatchActions && startDispatchActions[index]) {
          startDispatchActions[index](store);
        }
        Promise.all(
          preLoadPromises.map((loadPromise) =>
            loadPromise(match).then((data) => {
              endDispatchActions[index](store, data);
            })
          )
        )
          .then(() => resolve())
          .catch(resolve);
      }
    } else {
      resolve();
    }
  });
}

function preLoadWraper(preLoad: GetInitialStateType) {
  function Wraper(Component: ComponentClass & { getInitialState?: GetInitialStateType }) {
    Component.getInitialState = preLoad;
  }
  return Wraper;
}

export { preLoad, preLoadWraper };
