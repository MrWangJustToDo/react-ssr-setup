import { lazy } from "react";
import { Outlet } from "react-router";

import { AutoInjectProps } from "@client/common/AutoInjectProps";

import { dynamicRouteConfig } from "./dynamicRoutes";

import type { PreLoadRouteConfig } from "@client/types/route";

const baseRouter: PreLoadRouteConfig = {
  element: <Outlet />,
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
        default: AutoInjectProps(module.default, it.path),
      }))
    ),
  }))
  .map(({ path, component: Component, preLoad }) => ({
    path: path,
    preLoad,
    element: <Component />,
  }));

baseRouter.children = dynamicRoutes;

export const allRoutes = [baseRouter];
