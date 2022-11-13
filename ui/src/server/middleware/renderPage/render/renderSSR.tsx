import { ChakraProvider, cookieStorageManagerSSR } from "@chakra-ui/react";
import { CacheProvider } from "@emotion/react";
import { renderToPipeableStream } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
// import { StaticRouter as Router } from "react-router-dom/server";

import { App } from "@client/common/App";
import { generateStyleElements, generatePreloadScriptElements } from "@server/util/manifest";
import { serverLog } from "@server/util/serverLog";
import { createEmotionCache, HTML, theme } from "@shared";

import { targetRender as targetCSRRender } from "./renderCSR";

import type { SafeAction } from "../compose";

export const targetRender: SafeAction = async ({ req, res, store, lang, env, assets = {} }) => {
  const { StaticRouter: Router } = await import("react-router-dom/server.js");

  const helmetContext = {};

  const emotionCache = createEmotionCache();

  const cookieStore = cookieStorageManagerSSR(req.headers.cookie || "");

  const { stylesPath = [], scriptsPath = [] } = assets;

  const shellMethod = env.isStaticGenerate ? "onAllReady" : "onShellReady";

  let error = false;

  let initial = false;

  const stream = renderToPipeableStream(
    <HTML
      env={JSON.stringify(env)}
      lang={JSON.stringify(lang)}
      helmetContext={helmetContext}
      preloadedState={JSON.stringify(store.getState())}
      link={generateStyleElements(stylesPath)}
      preLoad={generatePreloadScriptElements(scriptsPath)}
    >
      <CacheProvider value={emotionCache}>
        <ChakraProvider resetCSS theme={theme} colorModeManager={cookieStore}>
          <Provider store={store} serverState={store.getState()}>
            <Router location={req.url}>
              <HelmetProvider context={helmetContext}>
                <App />
              </HelmetProvider>
            </Router>
          </Provider>
        </ChakraProvider>
      </CacheProvider>
    </HTML>,
    {
      bootstrapScripts: scriptsPath,
      // to support static generate, for SSR use
      [shellMethod]() {
        if (!error) {
          initial = true;
          res.statusCode = 200;
          res.setHeader("Content-type", "text/html");
          stream.pipe(res);
        }
      },
      onShellError(err) {
        error = true;
        if (!initial) {
          if (!env.isStaticGenerate) {
            // Something errored before we could complete the shell so we fallback to client render
            targetCSRRender({ req, res, store, lang, env, assets });
          } else {
            res.status(500).send("server render error!");
          }
        }
        serverLog((err as Error).stack, "error");
      },
      onError(err) {
        error = true;
        if (!initial) {
          if (!env.isStaticGenerate) {
            // not set header, so we can safe to fallback to client render
            targetCSRRender({ req, res, store, lang, env, assets });
          } else {
            res.status(500).send("server render error!");
          }
        }
        serverLog((err as Error).stack, "error");
      },
    }
  );
};
