import { lazy } from "react";

import { Layout } from "components/Layout";
import { UI } from "components/UI";
import { AutoInjectInitialProps } from "utils/preLoad";

import { dynamicRouteConfig } from "./dynamicRoutes";
import { filter } from "./tools";

import type { PreLoadRouteConfig } from "types/router";

const baseRouter: PreLoadRouteConfig = {
  element: <Layout />,
};

const routes: PreLoadRouteConfig[] = [{ path: "/", element: <UI /> }];

const dynamicRoutes = dynamicRouteConfig
  .map((it) => ({
    path: it.componentPath === "404" ? "/*" : it.path,
    preLoad: () =>
      import(
        /* webpackMode: "lazy" */
        /* webpackPrefetch: true */
        /* webpackPreload: true */
        /* webpackChunkName: "[request]" */
        `../pages/${it.componentPath}`
      ),
    component: lazy(() =>
      import(
        /* webpackMode: "lazy" */
        /* webpackPrefetch: true */
        /* webpackPreload: true */
        /* webpackChunkName: "[request]" */
        `../pages/${it.componentPath}`
      ).then((module) => ({
        default: AutoInjectInitialProps(module.default),
      }))
    ),
  }))
  .map(({ path, component: Component, preLoad }) => ({ path: path, preLoad, element: <Component /> }));

baseRouter.children = filter(routes.concat(dynamicRoutes) || [])
  .sort((a) => (a.path === "/*" ? 1 : 0))
  .sort((_, b) => (b.path === "/*" ? -1 : 0));

export const allRoutes = [baseRouter];
