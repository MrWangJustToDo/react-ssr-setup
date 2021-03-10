import React from "react";
import { renderToString } from "react-dom/server";
import { ChunkExtractor } from "@loadable/server";

import Html from "components/Template/html";
import { RenderType } from "@/types/server";

// 客户端渲染
let renderCSR: RenderType;

renderCSR = ({ res }) => {
  const webExtractor = new ChunkExtractor({ statsFile: webStats });
  const scriptElements = webExtractor.getScriptElements();
  const linkElements = webExtractor.getLinkElements();
  const styleElements = webExtractor.getStyleElements();
  res.send("<!doctype html>" + renderToString(<Html link={styleElements.concat(linkElements)} script={scriptElements} />));
};

export { renderCSR };
