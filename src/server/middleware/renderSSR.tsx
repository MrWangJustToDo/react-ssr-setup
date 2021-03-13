import React from "react";
import { Provider } from "react-redux";
import { renderToString } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { StaticRouter as Router } from "react-router-dom";
import { ChunkExtractor } from "@loadable/server";

import { routes } from "router/routes";
import App from "components/App";
import getStore from "share/store/store";
import Html from "components/Template/html";
import preLoad from "share/utils/preLoad";
import { RenderType } from "@/types/server";

const helmetContext = {};
const routerContext = {};

// 服务端渲染
let renderSSR: RenderType;

renderSSR = async ({ req, res }) => {
  const webExtractor = new ChunkExtractor({ statsFile: webStats });
  const jsx = webExtractor.collectChunks(<App />);
  const store = getStore({ initialState: { server: {}, client: {} } });

  const temp = await preLoad(routes, req.url, store);

  console.log(temp);

  const content = renderToString(
    <Provider store={store}>
      <Router location={req.url} context={routerContext}>
        <HelmetProvider context={helmetContext}>{jsx}</HelmetProvider>
      </Router>
    </Provider>
  );

  const state = JSON.stringify(temp);

  const scriptElements = webExtractor.getScriptElements();
  const linkElements = webExtractor.getLinkElements();
  const styleElements = webExtractor.getStyleElements();

  return res.send(
    "<!doctype html>" +
      renderToString(
        <Html link={styleElements.concat(linkElements)} helmetContext={helmetContext} script={scriptElements} state={state}>
          {content}
        </Html>
      )
  );
};

export { renderSSR };
