import React from "react";
import { allRoutes } from "router/routes";
import { Layout } from "./Layout";
import { LoadingBar } from "./LoadingBar";
import { WrapperRoute } from "./WrapperRoute";

export const App = () => {
  return (
    <WrapperRoute routes={allRoutes} LoadingBar={LoadingBar} animationRouter={__ANIMATE_ROUTER__}>
      <Layout />
    </WrapperRoute>
  );
};
