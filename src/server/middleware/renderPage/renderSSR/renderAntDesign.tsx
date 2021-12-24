import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { renderToString } from "react-dom/server";
import { StaticRouter as Router } from "react-router-dom/server";
import { ChunkExtractor } from "@loadable/server";

import { manifestLoadable } from "utils/manifest";
import { HTML } from "template/Html";
import { App } from "components/App";
import { SafeAction } from "../compose";

export const targetRender: SafeAction = async ({ req, res, store, lang, env }) => {
  const helmetContext = {};

  const content = (
    <Provider store={store}>
      <Router location={req.url}>
        <HelmetProvider context={helmetContext}>
          <CssBaseline />
          <App />
        </HelmetProvider>
      </Router>
    </Provider>
  );

  const webExtractor = new ChunkExtractor({ statsFile: manifestLoadable("client") });

  const jsx = webExtractor.collectChunks(content);

  // 运行程序  https://stackoverflow.com/questions/57725515/did-not-expect-server-html-to-contain-a-div-in-main
  const body = renderToString(jsx);

  const linkElements = webExtractor.getLinkElements();
  const styleElements = webExtractor.getStyleElements();
  const scriptElements = webExtractor.getScriptElements();

  env["LANG"] = lang;

  res.status(200).send(
    "<!doctype html>" +
      renderToString(
        <HTML
          lang={JSON.stringify(lang)}
          env={JSON.stringify(env)}
          script={scriptElements}
          helmetContext={helmetContext}
          link={linkElements.concat(styleElements)}
          reduxInitialState={JSON.stringify(store.getState())}
        >
          {body}
        </HTML>
      )
  );
};
