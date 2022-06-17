import { lazy } from "react";

import { Layout } from "components/Layout";
import { AutoInjectInitialProps } from "utils/preLoad";

import { dynamicRouteConfig } from "./dynamicRoutes";
import { filter } from "./tools";

import type { PreLoadRouteConfig } from "types/router";

const baseRouter: PreLoadRouteConfig = {
  element: <Layout />,
};

const dynamicRoutes = dynamicRouteConfig
  .map((it) => ({
    path: it.path,
    preLoad: () =>
      import(
        /* webpackMode: "lazy" */
        /* webpackPrefetch: true */
        /* webpackPreload: true */
        /* webpackChunkName: "page-[request]" */
        `../pages/${it.componentPath}`
      ),
    component: lazy(() =>
      import(
        /* webpackMode: "lazy" */
        /* webpackPrefetch: true */
        /* webpackPreload: true */
        /* webpackChunkName: "page-[request]" */
        `../pages/${it.componentPath}`
      ).then((module) => ({
        default: AutoInjectInitialProps(module.default),
      }))
    ),
  }))
  .map(({ path, component: Component, preLoad }) => ({ path: path, preLoad, element: <Component /> }));

baseRouter.children = filter(dynamicRoutes || []);

export const allRoutes = [baseRouter];
