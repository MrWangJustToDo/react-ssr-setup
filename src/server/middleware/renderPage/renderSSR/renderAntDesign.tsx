import React from "react";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { renderToString } from "react-dom/server";
import { StaticRouter as Router } from "react-router-dom/server";
import { ChunkExtractor } from "@loadable/server";

import { manifestLoadable } from "utils/manifest";
import { HTML } from "template/Html";
import { App } from "components/App";
import { SafeAction } from "../compose";

export const targetRender: SafeAction = async ({ req, res, store, lang, env, serverSideProps }) => {
  const helmetContext = {};

  const content = (
    <Provider store={store}>
      <Router location={req.url}>
        <HelmetProvider context={helmetContext}>
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

  res.status(200).send(
    "<!doctype html>" +
      renderToString(
        <HTML
          env={JSON.stringify(env)}
          lang={JSON.stringify(lang)}
          script={scriptElements}
          helmetContext={helmetContext}
          link={linkElements.concat(styleElements)}
          serverSideProps={JSON.stringify(serverSideProps)}
          reduxInitialState={JSON.stringify(store.getState())}
        >
          {body}
        </HTML>
      )
  );
};
