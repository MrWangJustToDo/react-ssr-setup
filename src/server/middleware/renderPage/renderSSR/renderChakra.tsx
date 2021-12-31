import React from "react";
import { Provider } from "react-redux";
import { renderToString } from "react-dom/server";
import { CacheProvider } from "@emotion/react";
import { ChunkExtractor } from "@loadable/server";
import { ColorModeScript, ChakraProvider } from "@chakra-ui/react";
import { HelmetProvider } from "react-helmet-async";
import { StaticRouter as Router } from "react-router-dom/server";
import createEmotionServer from "@emotion/server/create-instance";

import { createEmotionCache } from "config/createEmotionCache";
import { App } from "components/App";
import { HTML } from "template/Html";
import { manifestLoadable } from "utils/manifest";
import { SafeAction } from "../compose";

export const targetRender: SafeAction = async ({ req, res, store, lang, env, serverSideProps }) => {
  const helmetContext = {};
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  const content = (
    <CacheProvider value={cache}>
      <ChakraProvider resetCSS>
        <Provider store={store}>
          <Router location={req.url}>
            <HelmetProvider context={helmetContext}>
              <ColorModeScript />
              <App />
            </HelmetProvider>
          </Router>
        </Provider>
      </ChakraProvider>
    </CacheProvider>
  );

  const webExtractor = new ChunkExtractor({ statsFile: manifestLoadable("client") });

  const jsx = webExtractor.collectChunks(content);

  // 运行程序  https://stackoverflow.com/questions/57725515/did-not-expect-server-html-to-contain-a-div-in-main
  const body = renderToString(jsx);

  // Grab the CSS from emotion
  const emotionChunks = extractCriticalToChunks(body);

  const linkElements = webExtractor.getLinkElements();
  const styleElements = webExtractor.getStyleElements();
  const scriptElements = webExtractor.getScriptElements();

  res.status(200).send(
    "<!doctype html>" +
      renderToString(
        <HTML
          lang={JSON.stringify(lang)}
          env={JSON.stringify(env)}
          script={scriptElements}
          helmetContext={helmetContext}
          emotionChunks={emotionChunks}
          link={linkElements.concat(styleElements)}
          serverSideProps={JSON.stringify(serverSideProps)}
          reduxInitialState={JSON.stringify(store.getState())}
        >
          {body}
        </HTML>
      )
  );
};
