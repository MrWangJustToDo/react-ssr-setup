import { Store } from "redux";
import { ComponentClass } from "react";
import { matchRoutes } from "react-router-config";
import { PreLoadType } from "types/share";
import { MathProps, PreLoadRouteConfig, RouterProps } from "types/router";
import { GetInitialStateType, PreLoadComponentType } from "types/components";
import { ExpressRequest } from "types/server";
import { Response } from "express";
import { log } from "./log";

const preLoad: PreLoadType = (routes, pathname, store, req, res) => {
  const branch = matchRoutes<MathProps, PreLoadRouteConfig>(routes, pathname);
  const promises: Promise<void>[] = [];
  const animateConfig: { [pathname: string]: { routerIn?: string; routerOut?: string } } = {};
  branch.forEach(({ route, match }) => {
    promises.push(
      // for component
      preLoadFromComponent(route, store, match, animateConfig, req, res),
      // for router
      preLoadFromRoute(route, store, match, animateConfig, req, res)
    );
  });
  return Promise.all(promises).then(() => animateConfig);
};

function preLoadFromComponent(
  route: PreLoadRouteConfig,
  store: Store,
  match: RouterProps,
  animateConfig: { [pathname: string]: { routerIn?: string; routerOut?: string } },
  req?: ExpressRequest,
  res?: Response
): Promise<void> {
  return new Promise<void>((resolve) => {
    (route.component as any).load().then((component: { readonly default: PreLoadComponentType }) => {
      const Target = component.default;
      if (Target.routerIn || Target.routerOut) {
        if (Object.prototype.hasOwnProperty.call(animateConfig, match.path)) {
          log(`重复的路由动画定义: ${match.path}`, "error");
        } else {
          animateConfig[match.path] = { routerIn: Target.routerIn, routerOut: Target.routerOut };
        }
      }
      if (Target.getInitialState && typeof Target.getInitialState === "function") {
        Promise.resolve()
          .then(() => Target.getInitialState && Target.getInitialState(store, match, req, res))
          .then(resolve)
          .catch(resolve);
      } else {
        resolve();
      }
    });
  });
}

function preLoadFromRoute(
  route: PreLoadRouteConfig,
  store: Store,
  match: RouterProps,
  animateConfig: { [pathname: string]: { routerIn?: string; routerOut?: string } },
  req?: ExpressRequest,
  res?: Response
): Promise<void> {
  return new Promise<void>((resolve) => {
    if (route.animationRouter) {
      if (Object.prototype.hasOwnProperty.call(animateConfig, match.path)) {
        log(`重复的路由动画定义: ${match.path}`, "error");
      } else {
        animateConfig[match.path] = { routerIn: route.animationRouter.routerIn, routerOut: route.animationRouter.routerOut };
      }
    }
    if (route.getInitialState && typeof route.getInitialState === "function") {
      Promise.resolve()
        .then(() => route.getInitialState && route.getInitialState(store, match, req, res))
        .then(resolve)
        .catch(resolve);
    } else {
      resolve();
    }
  });
}

function preLoadWraper(preLoad: GetInitialStateType): (props: ComponentClass & { getInitialState?: GetInitialStateType }) => void {
  function Wraper(Component: ComponentClass & { getInitialState?: GetInitialStateType }): void {
    Component.getInitialState = preLoad;
  }
  return Wraper;
}

export { preLoad, preLoadWraper };
