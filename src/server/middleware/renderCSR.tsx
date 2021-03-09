import React from "react";
import { renderToString } from "react-dom/server";

import { RenderType } from "@/server";
import Html from "components/Template/html";

// 客户端渲染
let renderCSR: RenderType;

renderCSR = ({ res }) =>
  res.send("<!doctype html>" + renderToString(<Html css={[assets["main.css"]]} script={[assets["runtime.js"], assets["main.js"], assets["vendor.js"]]} />));

export { renderCSR };
