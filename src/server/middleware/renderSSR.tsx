import React from "react";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { renderToString } from "react-dom/server";
import { StaticRouter as Router } from "react-router-dom";
import { ChunkExtractor } from "@loadable/server";

import WraperRoute from "components/WraperRoute";
import LoadingBar from "components/LoadingBar";
import App from "components/App";
import Html from "template/html";
import { allRoutes } from "router/routes";
import { ServerError } from "server/utils/error";
import { preLoad } from "share/utils/preLoad";
import { sagaStore as getStore } from "share/store/store";

import type { RenderType } from "types/server";

// 服务端渲染

const placeHolder = {};

const renderSSR: RenderType = async ({ req, res }) => {
  const store = getStore({ initialState: { server: {}, client: {} } });
  const helmetContext = {};
  const routerContext: { url?: string } = {};

  const content = (
    <Provider store={store}>
      <Router location={req.url} context={routerContext}>
        <HelmetProvider context={helmetContext}>
          <WraperRoute routes={allRoutes} LoadingBar={LoadingBar} animationRouter={__ANIMATEROUTER__}>
            <App />
          </WraperRoute>
        </HelmetProvider>
      </Router>
    </Provider>
  );

  const webExtractor = new ChunkExtractor({ statsFile: global.webStats });

  const jsx = webExtractor.collectChunks(content);

  // 在内部通过 typeOf window === 'undefined'  判断是否是server端来操作

  const { redirect, error, headers } = await preLoad(allRoutes, req.url, store, placeHolder, { header: req.headers });

  // must run first!!  https://stackoverflow.com/questions/57725515/did-not-expect-server-html-to-contain-a-div-in-main
  const body = renderToString(jsx);

  if (headers) {
    Object.keys(headers).forEach((key) => res.setHeader(key, headers[key]));
  }

  if (error) {
    throw new ServerError(error, 404);
  } else if (routerContext.url) {
    res.writeHead(301, {
      Location: routerContext.url,
    });
    res.end();
  } else if (redirect) {
    res.writeHead(302, {
      Location: redirect,
    });
    res.end();
  } else {
    const state = JSON.stringify(store.getState());

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
