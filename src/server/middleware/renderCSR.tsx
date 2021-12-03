import React from "react";
import { renderToString } from "react-dom/server";
import { ChunkExtractor } from "@loadable/server";

import { HTML } from "template/Html";
import { determineUserLang } from "i18n";
import { manifestLoadable } from "utils/manifest";

import type { RenderType } from "types/server";

// 客户端渲染
const renderCSR: RenderType = ({ req, res }) => {
  const { PUBLIC_API_HOST, ANIMATE_ROUTER } = process.env;
  const env = JSON.stringify({ PUBLIC_API_HOST, ANIMATE_ROUTER });
  const lang = determineUserLang(req.acceptsLanguages(), req.path);
  const webExtractor = new ChunkExtractor({ statsFile: manifestLoadable("client") });
  const linkElements = webExtractor.getLinkElements();
  const styleElements = webExtractor.getStyleElements();
  const scriptElements = webExtractor.getScriptElements();
  res.send("<!doctype html>" + renderToString(<HTML link={linkElements.concat(styleElements)} script={scriptElements} lang={lang} env={env} />));
};

export { renderCSR };
