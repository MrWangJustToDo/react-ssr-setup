import React from "react";
import { renderToString } from "react-dom/server";
import { RenderType } from "@/server";
import { HelmetProvider } from "react-helmet-async";
import { StaticRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";

import App from "components/App";
import Html from "components/Template/html";
import getStore from "share/store/store";

const helmetContext = {};
const routerContext = {};

// 服务端渲染
let renderSSR: RenderType;

renderSSR = ({ req, res }) => {
  const content = renderToString(
    <Provider store={getStore({initialState: {}})}>
      <Router location={req.url} context={routerContext}>
        <HelmetProvider context={helmetContext}>
          <App />
        </HelmetProvider>
      </Router>
    </Provider>
  );

  const state = JSON.stringify("");

  return res.send(
    "<!doctype html>" +
      renderToString(
        <Html css={[assets["main.css"]]} helmetContext={helmetContext} script={[assets["runtime.js"], assets["main.js"]]} state={state}>
          {content}
        </Html>
      )
  );
};

export { renderSSR };
