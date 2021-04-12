import React from "react";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { renderToNodeStream } from "react-dom/server";
import { StaticRouter as Router } from "react-router-dom";
import { ChunkExtractor } from "@loadable/server";

import { allRoutes } from "router/routes";
import App from "components/App";
import Html from "components/Template/html";
import getStore from "share/store/store";
import { preLoad } from "share/utils/preLoad";
import { RenderType } from "types/server";

const helmetContext = {};
const routerContext: { url?: string } = {};

// 服务端渲染
let renderSSR: RenderType;

renderSSR = async ({ req, res }) => {
  const webExtractor = new ChunkExtractor({ statsFile: webStats });
  const jsx = webExtractor.collectChunks(<App />);
  const store = getStore({ initialState: { server: {}, client: {} } });

  await preLoad(allRoutes, req.path, store);

  const content = (
    <Provider store={store}>
      <Router location={req.path} context={routerContext}>
        <HelmetProvider context={helmetContext}>{jsx}</HelmetProvider>
      </Router>
    </Provider>
  );

  if (routerContext.url) {
    res.writeHead(301, {
      Location: routerContext.url,
    });
    res.end();
  } else {
    const state = JSON.stringify(store.getState());

    const linkElements = webExtractor.getLinkElements();
    const styleElements = webExtractor.getStyleElements();
    const scriptElements = webExtractor.getScriptElements();

    res.write("<!doctype html>");

    const stream = renderToNodeStream(
      <Html link={linkElements.concat(styleElements)} helmetContext={helmetContext} script={scriptElements} state={state}>
        {content}
      </Html>
    );

    stream.pipe(res, { end: true });
  }
};

export { renderSSR };
