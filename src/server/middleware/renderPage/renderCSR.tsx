import { renderToString } from "react-dom/server";

import { HTML } from "@app/template";
import {
  generatePreloadScriptElements,
  generateScriptElements,
  generateStyleElements,
  getAllStateFileContent,
  mainScriptsPath,
  mainStylesPath,
  manifestStateFile,
  runtimeScriptsPath,
} from "@app/util/manifest";
import { RenderError } from "@server/util/renderError";

import { composeRender } from "./compose";
import { globalEnv, initLang, initStore, loadLang, loadStore } from "./middleware";

import type { AnyAction } from "./compose";

// 客户端渲染
const targetRender: AnyAction = async ({ res, store, lang, env }) => {
  if (!store || !lang || !env) {
    throw new RenderError("server 初始化失败", 500);
  }

  const stateFileContent = await getAllStateFileContent(manifestStateFile("client"));

  const mainStyles = mainStylesPath(stateFileContent);

  const runtimeScripts = runtimeScriptsPath(stateFileContent);

  const mainScripts = mainScriptsPath(stateFileContent);

  res.send(
    "<!doctype html>" +
      renderToString(
        <HTML
          env={JSON.stringify(env)}
          lang={JSON.stringify(lang)}
          link={generateStyleElements(mainStyles)}
          preloadedState={JSON.stringify(store.getState())}
          preLoad={generatePreloadScriptElements(mainScripts)}
          script={generateScriptElements(runtimeScripts.concat(mainScripts))}
        />
      )
  );
};

export const renderCSR = composeRender(globalEnv, initLang, initStore, loadStore, loadLang)(targetRender);
