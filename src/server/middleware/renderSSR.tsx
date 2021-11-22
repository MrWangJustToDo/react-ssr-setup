import React from "react";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { renderToString } from "react-dom/server";
import { StaticRouter as Router } from "react-router-dom";
import { ChunkExtractor } from "@loadable/server";

import { sagaStore } from "store";
import { preLoad } from "utils/preLoad";
import { manifestLoadable } from "utils/manifest";
import { HTML } from "template/Html";
import { allRoutes } from "router/routes";
import { App } from "components/App";
import { ServerError } from "server/utils/error";

import type { RenderType } from "types/server";

// 服务端渲染

const empty = {};

const renderSSR: RenderType = async ({ req, res }) => {
  const store = sagaStore();
  const helmetContext = {};
  const routerContext: { url?: string } = {};

  const content = (
    <Provider store={store}>
      <Router location={req.url} context={routerContext}>
        <HelmetProvider context={helmetContext}>
          <App />
        </HelmetProvider>
      </Router>
    </Provider>
  );

  const webExtractor = new ChunkExtractor({ statsFile: manifestLoadable("client") });

  const jsx = webExtractor.collectChunks(content);

  const { redirect, error, headers } = await preLoad(allRoutes, req.url, store, empty, { req });

  if (headers) {
    Object.keys(headers).forEach((key) => res.setHeader(key, headers[key]));
  }

  if (error) {
    throw new ServerError(error, 404);
  } else if (redirect) {
    res.writeHead(302, {
      Location: redirect,
    });
    res.end();
  } else {
    // must run first!!  https://stackoverflow.com/questions/57725515/did-not-expect-server-html-to-contain-a-div-in-main
    const body = renderToString(jsx);

    if (routerContext.url) {
      res.writeHead(301, {
        Location: routerContext.url,
      });
      res.end();
      return;
    }

    const linkElements = webExtractor.getLinkElements();
    const styleElements = webExtractor.getStyleElements();
    const scriptElements = webExtractor.getScriptElements();

    res.send(
      "<!doctype html>" +
        renderToString(
          <HTML
            link={linkElements.concat(styleElements)}
            helmetContext={helmetContext}
            script={scriptElements}
            reduxInitialState={JSON.stringify(store.getState())}
          >
            {body}
          </HTML>
        )
    );
  }
};

export { renderSSR };
