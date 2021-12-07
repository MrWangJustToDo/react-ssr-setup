import React from "react";
import { renderToString } from "react-dom/server";
import { ChunkExtractor } from "@loadable/server";

import { HTML } from "template/Html";
import { manifestLoadable } from "utils/manifest";

import { AnyAction, composeRender } from "./compose";
import { globalEnv, initLang, initStore, loadLang } from "./middleware";
import { ServerError } from "server/utils/error";

// 客户端渲染
const targetRender: AnyAction = async ({ res, store, lang, env }) => {
  if (!store || !lang || !env) {
    throw new ServerError("server 初始化失败", 500);
  }
  const webExtractor = new ChunkExtractor({ statsFile: manifestLoadable("client") });
  const linkElements = webExtractor.getLinkElements();
  const styleElements = webExtractor.getStyleElements();
  const scriptElements = webExtractor.getScriptElements();
  res.send(
    "<!doctype html>" +
      renderToString(
        <HTML link={linkElements.concat(styleElements)} script={scriptElements} lang={lang} env={env} reduxInitialState={JSON.stringify(store.getState())} />
      )
  );
};

export const renderCSR = composeRender(globalEnv, initLang, initStore, loadLang)(targetRender);
