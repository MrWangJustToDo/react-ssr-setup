import React from "react";
import { allRoutes } from "router/routes";
import { LoadingBar } from "./LoadingBar";
import { WrapperRoute } from "./WrapperRoute";
import { WrapperLang } from "./WrapperLang";
import { RenderMatch } from "./RenderMatch";

export const App = () => {
  return (
    <WrapperLang>
      <WrapperRoute routes={allRoutes} LoadingBar={LoadingBar}>
        <RenderMatch />
      </WrapperRoute>
    </WrapperLang>
  );
};
