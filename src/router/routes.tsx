import React from "react";
import loadable from "@loadable/component";
import { Layout } from "components/Layout";
import { UI } from "components/UI";
import { filter } from "./tools";
import { dynamicRouteConfig } from "./dynamicRoutes";
import { PreLoadRouteConfig } from "types/router";

const LoadAble_I18n = loadable<unknown>(() => import("../components/i18n"));

const baseRouter: PreLoadRouteConfig = {
  element: <Layout />,
  Component: Layout,
};

let LoadAble_UI: ReturnType<typeof loadable> | (() => JSX.Element) = () => <></>;
if (__UI__ === "antd") {
  LoadAble_UI = loadable<unknown>(() => import("../components/antDesignComponent"));
}
if (__UI__ === "material") {
  LoadAble_UI = loadable<unknown>(() => import("../components/materialComponent"));
}
if (__UI__ === "chakra") {
  LoadAble_UI = loadable<unknown>(() => import("../components/chakraComponent"));
}

const routes: PreLoadRouteConfig[] = [
  { path: "/", element: <UI />, Component: UI },
  { path: "/i18n", element: <LoadAble_I18n />, Component: LoadAble_I18n },
  { path: __UI__ === "antd" ? "/antd" : __UI__ === "material" ? "/material" : "chakra", element: <LoadAble_UI />, Component: LoadAble_UI },
];

const dynamicRoutes = dynamicRouteConfig
  .map((it) => ({
    path: it.componentPath === "404" ? "/*" : it.path,
    component: loadable(() => import(`../pages/${it.componentPath}`)),
  }))
  .map(({ path, component: Component }) => ({ path: path, Component, element: <Component /> }));

baseRouter.children = filter(routes.concat(dynamicRoutes) || [])
  .sort((a) => (a.path === "/*" ? 1 : 0))
  .sort((_, b) => (b.path === "/*" ? -1 : 0));

export const allRoutes = [baseRouter];
