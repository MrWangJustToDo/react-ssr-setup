import { Store } from "redux";
import { ComponentClass } from "react";
import { IncomingHttpHeaders } from "http";
import { matchRoutes } from "react-router-config";
// import { PreLoadType } from "types/share";
import { MathProps, PreLoadRouteConfig, RouterProps } from "types/router";
import { GetInitialStateType, PreLoadComponentType } from "types/components";

function preLoad(
  routes: PreLoadRouteConfig[],
  pathName: string,
  store: Store,
  routerAnimate: { [props: string]: { routerIn?: string; routerOut?: string } },
  config: { header: IncomingHttpHeaders }
): Promise<{
  redirect?: string;
  error?: string;
  headers?: { [key: string]: string };
}>;
function preLoad(
  routes: PreLoadRouteConfig[],
  pathName: string,
  store: Store,
  routerAnimate: { [props: string]: { routerIn?: string; routerOut?: string } }
): Promise<{
  redirect?: string;
  error?: string;
  cookies?: { [key: string]: string };
}>;

function preLoad(
  routes: PreLoadRouteConfig[],
  pathname: string,
  store: Store,
  routerAnimate: { [props: string]: { routerIn?: string; routerOut?: string } },
  config?: { header: IncomingHttpHeaders }
) {
  const branch = matchRoutes<MathProps, PreLoadRouteConfig>(routes, pathname);
  const promises: Promise<{
    redirect?: string;
    error?: string;
    header?: { [key: string]: string };
  } | void>[] = [];
  branch.forEach(({ route, match }) => {
    promises.push(
      // for component
      preLoadFromComponent(route, store, match, routerAnimate, config),
      // for router
      preLoadFromRoute(route, store, match, routerAnimate, config)
    );
  });
  return Promise.all(promises).then((val) =>
    val.filter(Boolean).reduce((res, c) => {
      return { ...res, ...c };
    }, {})
  );
}

// const preLoad = (routes, pathname, store, config) => {
//   const branch = matchRoutes<MathProps, PreLoadRouteConfig>(routes, pathname);
//   const promises: Promise<{
//     redirect?: string;
//     error?: string;
//     header?: { [key: string]: string };
//   } | void>[] = [];
//   const animateConfig: { [pathname: string]: { routerIn?: string; routerOut?: string } } = {};
//   branch.forEach(({ route, match }) => {
//     promises.push(
//       // for component
//       preLoadFromComponent(route, store, match, animateConfig, config),
//       // for router
//       preLoadFromRoute(route, store, match, animateConfig, config)
//     );
//   });
//   if (config) {
//     return Promise.all(promises).then(
//       (val) =>
//         val.filter(Boolean).reduce((res, c) => {
//           return { ...res, ...c };
//         }, {}) as {
//           redirect?: string;
//           error?: string;
//           header?: { [key: string]: string };
//         }
//     );
//   } else {
//     return Promise.all(promises).then(() => animateConfig);
//   }
// };

function preLoadFromComponent(
  route: PreLoadRouteConfig,
  store: Store,
  match: RouterProps,
  animateConfig: { [pathname: string]: { routerIn?: string; routerOut?: string } },
  config?: { header: IncomingHttpHeaders }
): Promise<{
  redirect?: string;
  error?: string;
  header?: { [key: string]: string };
} | void> {
  return new Promise<{
    redirect?: string;
    error?: string;
    header?: { [key: string]: string };
  } | void>((resolve) => {
    (route.component as any).load().then((component: { readonly default: PreLoadComponentType }) => {
      const Target = component.default;
      if (Target.routerIn || Target.routerOut) {
        // if (Object.prototype.hasOwnProperty.call(animateConfig, match.path)) {
        //   log(`重复的路由动画定义: ${match.path}`, "error");
        // } else {
        animateConfig[match.path] = { routerIn: Target.routerIn, routerOut: Target.routerOut };
        // }
      }
      if (Target.getInitialState && typeof Target.getInitialState === "function") {
        Promise.resolve()
          .then(() => Target.getInitialState && Target.getInitialState(store, match, config))
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
  config?: { header: IncomingHttpHeaders }
): Promise<{
  redirect?: string;
  error?: string;
  header?: { [key: string]: string };
} | void> {
  return new Promise<{
    redirect?: string;
    error?: string;
    header?: { [key: string]: string };
  } | void>((resolve) => {
    if (route.animationRouter) {
      // if (Object.prototype.hasOwnProperty.call(animateConfig, match.path)) {
      //   log(`重复的路由动画定义: ${match.path}`, "error");
      // } else {
      animateConfig[match.path] = { routerIn: route.animationRouter.routerIn, routerOut: route.animationRouter.routerOut };
      // }
    }
    if (route.getInitialState && typeof route.getInitialState === "function") {
      Promise.resolve()
        .then(() => route.getInitialState && route.getInitialState(store, match, config))
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
