import React from "react";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { renderToString } from "react-dom/server";
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
  const store = getStore({ initialState: { server: {}, client: {} } });

  const content = (
    <Provider store={store}>
      <Router location={req.path} context={routerContext}>
        <HelmetProvider context={helmetContext}>
          <App />
        </HelmetProvider>
      </Router>
    </Provider>
  );

  const webExtractor = new ChunkExtractor({ statsFile: webStats });

  const jsx = webExtractor.collectChunks(content);

  if (routerContext.url) {
    res.writeHead(301, {
      Location: routerContext.url,
    });
    res.end();
  } else {
    await preLoad(allRoutes, req.path, store);

    const state = JSON.stringify(store.getState());

    // must run first!!  https://stackoverflow.com/questions/57725515/did-not-expect-server-html-to-contain-a-div-in-main
    const body = renderToString(jsx);

    const linkElements = webExtractor.getLinkElements();
    const styleElements = webExtractor.getStyleElements();
    const scriptElements = webExtractor.getScriptElements();

    res.send(
      "<!doctype html>" +
        renderToString(
          <Html link={linkElements.concat(styleElements)} helmetContext={helmetContext} script={scriptElements} state={state}>
            {body}
          </Html>
        )
    );
  }
};

export { renderSSR };
