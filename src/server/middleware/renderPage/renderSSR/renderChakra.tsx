import { ChakraProvider, createCookieStorageManager } from "@chakra-ui/react";
import { CacheProvider } from "@emotion/react";
import { renderToPipeableStream } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { StaticRouter as Router } from "react-router-dom/server";

import { App } from "@app/common/App";
import { HTML } from "@app/template";
import { theme } from "@app/theme";
import { createEmotionCache } from "@app/util/emotionCache";
import { getIsStaticGenerate } from "@app/util/env";
import {
  getAllStateFileContent,
  mainScriptsPath,
  mainStylesPath,
  manifestStateFile,
  runtimeScriptsPath,
  generateStyleElements,
  generatePreloadScriptElements,
  manifestDepsFile,
  getDynamicPagePath,
  dynamicPageStylesPath,
  dynamicPageScriptsPath,
} from "@app/util/manifest";
import { serverLog } from "@server/util/serverLog";

import { renderP_CSR } from "../renderP_CSR";

import type { SafeAction } from "../compose";

export const targetRender: SafeAction = async ({ req, res, store, lang, env, page }) => {
  const helmetContext = {};

  const emotionCache = createEmotionCache();

  const cookieStore = createCookieStorageManager("chakra-ui-color-mode", req.headers.cookie);

  const stateFileContent = await getAllStateFileContent(manifestStateFile("client"));

  const depsFileContent = await getAllStateFileContent(manifestDepsFile("client"));

  const dynamicPage = getDynamicPagePath(depsFileContent, page);

  const dynamicStylesPath = dynamicPageStylesPath(stateFileContent, dynamicPage);

  const dynamicScriptsPath = dynamicPageScriptsPath(stateFileContent, dynamicPage);

  const mainStyles = mainStylesPath(stateFileContent);

  const runtimeScripts = runtimeScriptsPath(stateFileContent);

  const mainScripts = mainScriptsPath(stateFileContent);

  const isStaticGenerate = getIsStaticGenerate();

  const shellMethod = isStaticGenerate ? "onAllReady" : "onShellReady";

  let error = false;

  let initial = false;

  const stream = renderToPipeableStream(
    <HTML
      env={JSON.stringify(env)}
      lang={JSON.stringify(lang)}
      helmetContext={helmetContext}
      preloadedState={JSON.stringify(store.getState())}
      link={generateStyleElements(mainStyles.concat(dynamicStylesPath))}
      preLoad={generatePreloadScriptElements(mainScripts.concat(runtimeScripts).concat(dynamicScriptsPath))}
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
      bootstrapScripts: [...runtimeScripts, ...mainScripts, ...dynamicScriptsPath],
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
          if (!isStaticGenerate) {
            // Something errored before we could complete the shell so we fallback to client render
            renderP_CSR({ req, res });
          } else {
            res.status(500).send("server render error!");
          }
        }
        serverLog((err as Error).message, "error");
      },
      onError(err) {
        error = true;
        if (!initial) {
          if (!isStaticGenerate) {
            // not set header, so we can safe to fallback to client render
            renderP_CSR({ req, res });
          } else {
            res.status(500).send("server render error!");
          }
        }
        serverLog((err as Error).message, "error");
      },
    }
  );
};
