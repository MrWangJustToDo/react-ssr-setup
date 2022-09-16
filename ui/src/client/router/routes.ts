import { createElement, lazy } from "react";

import { AutoInjectProps } from "@client/common/AutoInjectProps";
import { Layout } from "@client/common/Layout";

import { dynamicRouteConfig } from "./dynamicRoutes";

import type { PreLoadRouteConfig } from "@client/types/route";

const baseRouter: PreLoadRouteConfig = {
  preLoad: () => Layout,
  element: createElement(AutoInjectProps(Layout), ""),
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
    element: createElement(Component),
  }));

baseRouter.children = dynamicRoutes;

export const allRoutes = [baseRouter];
