import React from "react";
import { renderToString } from "react-dom/server";
import { ChunkExtractor } from "@loadable/server";

import { HTML } from "template/Html";
import { manifestLoadable } from "utils/manifest";

import type { RenderType } from "types/server";

// 客户端渲染
const renderCSR: RenderType = ({ res }) => {
  const webExtractor = new ChunkExtractor({ statsFile: manifestLoadable("client") });
  const linkElements = webExtractor.getLinkElements();
  const styleElements = webExtractor.getStyleElements();
  const scriptElements = webExtractor.getScriptElements();
  res.send("<!doctype html>" + renderToString(<HTML link={linkElements.concat(styleElements)} script={scriptElements} />));
};

export { renderCSR };
