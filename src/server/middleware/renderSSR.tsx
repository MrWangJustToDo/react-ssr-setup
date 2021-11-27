import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import createEmotionServer from "@emotion/server/create-instance";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import { HelmetProvider } from "react-helmet-async";
import { renderToString } from "react-dom/server";
import { StaticRouter as Router } from "react-router-dom";
import { ChunkExtractor } from "@loadable/server";

import { sagaStore } from "store";
import { preLoad, preLoadLang } from "utils/preLoad";
import { manifestLoadable } from "utils/manifest";
import { HTML } from "template/Html";
import { allRoutes } from "router/routes";
import { App } from "components/App";
import { ServerError } from "server/utils/error";
import { theme } from "config/theme";
import { determineUserLang } from "i18n";
import { createEmotionCache } from "config/createEmotionCache";

import type { RenderType } from "types/server";

// 服务端渲染

const empty = {};

const renderSSR: RenderType = async ({ req, res }) => {
  const store = sagaStore();
  const cache = createEmotionCache();
  const lang = determineUserLang(req.acceptsLanguages(), req.path);
  const { extractCriticalToChunks } = createEmotionServer(cache);
  const helmetContext = {};
  const routerContext: { url?: string } = {};

  const content = (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Router location={req.url} context={routerContext}>
            <HelmetProvider context={helmetContext}>
              <CssBaseline />
              <App />
            </HelmetProvider>
          </Router>
        </Provider>
      </ThemeProvider>
    </CacheProvider>
  );

  const webExtractor = new ChunkExtractor({ statsFile: manifestLoadable("client") });

  const jsx = webExtractor.collectChunks(content);

  const { redirect, error, headers } = await preLoad(allRoutes, req.url, store, empty, { req, lang });

  if (headers) {
    Object.keys(headers).forEach((key) => res.setHeader(key, headers[key]));
  }

  if (error) {
    throw new ServerError(error, 403);
  }

  if (redirect) {
    res.writeHead(302, {
      Location: redirect,
    });
    res.end();
    return;
  }

  // 加载语言文件
  await preLoadLang({ store, lang });
  // 运行程序  https://stackoverflow.com/questions/57725515/did-not-expect-server-html-to-contain-a-div-in-main
  const body = renderToString(jsx);

  if (routerContext.url) {
    res.writeHead(301, {
      Location: routerContext.url,
    });
    res.end();
    return;
  }

  // Grab the CSS from emotion
  const emotionChunks = extractCriticalToChunks(body);

  const linkElements = webExtractor.getLinkElements();
  const styleElements = webExtractor.getStyleElements();
  const scriptElements = webExtractor.getScriptElements();

  res.status(200).send(
    "<!doctype html>" +
      renderToString(
        <HTML
          lang={lang}
          script={scriptElements}
          helmetContext={helmetContext}
          emotionChunks={emotionChunks}
          link={linkElements.concat(styleElements)}
          reduxInitialState={JSON.stringify(store.getState())}
        >
          {body}
        </HTML>
      )
  );
};

export { renderSSR };
