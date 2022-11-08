import { renderToString } from "react-dom/server";

import { generateStyleElements, generateScriptElements, generatePreloadScriptElements } from "@server/util/manifest";
import { RenderError } from "@server/util/renderError";
import { HTML } from "@shared";

import type { AnyAction } from "../compose";

// 纯净的客户端渲染
export const targetRender: AnyAction = async ({ res, env, lang, assets = {} }) => {
  if (!env || !lang) {
    throw new RenderError("server 初始化失败", 500);
  }

  const { stylesPath = [], scriptsPath = [] } = assets;

  res.send(
    "<!doctype html>" +
      renderToString(
        <HTML
          env={JSON.stringify(env)}
          lang={JSON.stringify(lang)}
          link={generateStyleElements(stylesPath)}
          preLoad={generatePreloadScriptElements(scriptsPath)}
          script={generateScriptElements(scriptsPath)}
        />
      )
  );
};
