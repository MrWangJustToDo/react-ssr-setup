import { renderToString } from "react-dom/server";

import { generatePreloadScriptElements, generateScriptElements, generateStyleElements } from "@server/util/element";
import { RenderError } from "@server/util/renderError";
import { HTML } from "@shared";

import type { AnyAction } from "../compose";

// 客户端渲染
export const targetRender: AnyAction = async ({ res, store, lang, env, assets = {} }) => {
  if (!store || !lang || !env) {
    throw new RenderError("server 初始化失败", 500);
  }

  const { stylesPath = [], scriptsPath = [], preloadScriptsPath = [] } = assets;

  res.send(
    "<!doctype html>" +
      renderToString(
        <HTML
          env={JSON.stringify(env)}
          lang={JSON.stringify(lang)}
          link={generateStyleElements(stylesPath)}
          preloadedState={JSON.stringify(store.getState())}
          preLoad={generatePreloadScriptElements(preloadScriptsPath)}
          script={generateScriptElements(scriptsPath)}
        />
      )
  );
};
