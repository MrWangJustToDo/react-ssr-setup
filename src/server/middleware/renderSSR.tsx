import React from "react";
import { renderToString } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { StaticRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { ChunkExtractor } from "@loadable/server";
import { RenderType } from "@/server";

import App from "components/App";
import Html from "components/Template/html";
import getStore from "share/store/store";

const helmetContext = {};
const routerContext = {};

// 服务端渲染
let renderSSR: RenderType;

renderSSR = ({ req, res }) => {
  // const nodeExtractor = new ChunkExtractor({ statsFile: nodeStats });
  // const test = nodeExtractor.requireEntrypoint();

  // console.log(nodeExtractor);

  const webExtractor = new ChunkExtractor({ statsFile: webStats });
  const jsx = webExtractor.collectChunks(<App />);

  // console.log(jsx);

  const content = renderToString(
    <Provider store={getStore({ initialState: {} })}>
      <Router location={req.url} context={routerContext}>
        <HelmetProvider context={helmetContext}>{jsx}</HelmetProvider>
      </Router>
    </Provider>
  );

  const state = JSON.stringify("");

  const scriptElements = webExtractor.getScriptElements();
  const linkElements = webExtractor.getLinkElements();
  const styleElements = webExtractor.getStyleElements();

  return res.send(
    "<!doctype html>" +
      renderToString(
        <Html css={styleElements.concat(linkElements)} helmetContext={helmetContext} script={scriptElements} state={state}>
          {content}
        </Html>
      )
  );
};

export { renderSSR };
