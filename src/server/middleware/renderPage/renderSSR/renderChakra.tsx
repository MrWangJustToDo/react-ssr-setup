import { ChakraProvider, createCookieStorageManager } from "@chakra-ui/react";
import { renderToPipeableStream } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { StaticRouter as Router } from "react-router-dom/server";

import { App } from "components/App";
import { HTML } from "template/Html";
import { theme } from "theme";
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
} from "utils/manifest";

import type { SafeAction } from "../compose";

export const targetRender: SafeAction = async ({ req, res, store, lang, env, page }) => {
  const helmetContext = {};

  const cookieStore = createCookieStorageManager("chakra-ui-color-mode", store.getState().server.cookie.data);

  const stateFileContent = await getAllStateFileContent(manifestStateFile("client"));

  const depsFileContent = await getAllStateFileContent(manifestDepsFile("client"));

  const dynamicPage = getDynamicPagePath(depsFileContent, page);

  const dynamicStylesPath = dynamicPageStylesPath(stateFileContent, dynamicPage);

  const dynamicScriptsPath = dynamicPageScriptsPath(stateFileContent, dynamicPage);

  const mainStyles = mainStylesPath(stateFileContent);

  const runtimeScripts = runtimeScriptsPath(stateFileContent);

  const mainScripts = mainScriptsPath(stateFileContent);

  let didError = false;

  const stream = renderToPipeableStream(
    <HTML
      env={JSON.stringify(env)}
      lang={JSON.stringify(lang)}
      helmetContext={helmetContext}
      link={generateStyleElements(mainStyles.concat(dynamicStylesPath))}
      preLoad={generatePreloadScriptElements(mainScripts.concat(runtimeScripts).concat(dynamicScriptsPath))}
      reduxInitialState={JSON.stringify(store.getState())}
    >
      <ChakraProvider resetCSS theme={theme} colorModeManager={cookieStore}>
        <Provider store={store}>
          <Router location={req.url}>
            <HelmetProvider context={helmetContext}>
              <App />
            </HelmetProvider>
          </Router>
        </Provider>
      </ChakraProvider>
    </HTML>,
    {
      bootstrapScripts: [...runtimeScripts, ...mainScripts, ...dynamicScriptsPath],
      onShellReady() {
        // The content above all Suspense boundaries is ready.
        // If something errored before we started streaming, we set the error code appropriately.
        res.statusCode = didError ? 500 : 200;
        res.setHeader("Content-type", "text/html");
        stream.pipe(res);
      },
      onShellError(err) {
        // Something errored before we could complete the shell so we emit an alternative shell.
        didError = true;
        res.statusCode = 500;
        res.send(`<!doctype html><p>${(err as Error).stack}</p>`);
      },
      onError(err) {
        throw new Error((err as Error).message);
      },
    }
  );
};
