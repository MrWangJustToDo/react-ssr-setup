import { matchRoutes } from "react-router-config";
import { level, log } from "./log";
import { LoadBranchDataType } from "types/share";
import { MathProps, PreLoadRouteConfig } from "types/router";
import { GetInitialStateType, PreLoadComponentType } from "types/components";
import { ComponentClass } from "react";

let loadBranchData: LoadBranchDataType;

loadBranchData = (routes, pathname, store) => {
  const branch = matchRoutes<MathProps, PreLoadRouteConfig>(routes, pathname);
  const promises: Promise<[void, void]>[] = [];
  branch.forEach(({ route, match }, index) => {
    promises.push(
      Promise.all([
        new Promise<void>((resolve) => {
          // component的配置
          (route.component as any).load().then((component: { default: PreLoadComponentType }) => {
            const target = component.default;
            if (target.getInitialState) {
              Promise.resolve(target.getInitialState(store, match)).then(resolve).catch(resolve);
            } else {
              resolve();
            }
          });
        }),
        new Promise<void>((resolve) => {
          // router文件的配置
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
        }),
      ])
    );
  });
  return Promise.all(promises);
};

function preLoadWraper(preLoad: GetInitialStateType) {
  function Wraper(Component: ComponentClass & { getInitialState?: GetInitialStateType }) {
    Component.getInitialState = preLoad;
  }
  return Wraper;
}

export { loadBranchData, preLoadWraper };
