import { renderToString } from "react-dom/server";

import { ServerError } from "server/utils/error";
import { HTML } from "template/Html";
import {
  generatePreloadScriptElements,
  generateScriptElements,
  generateStyleElements,
  getAllStateFileContent,
  mainScriptsPath,
  mainStylesPath,
  manifestStateFile,
  runtimeScriptsPath,
} from "utils/manifest";

import { composeRender } from "./compose";
import { globalEnv, initLang, initStore, loadCookie, loadLang, loadStore } from "./middleware";

import type { AnyAction } from "./compose";

// 客户端渲染
const targetRender: AnyAction = async ({ res, store, lang, env }) => {
  if (!store || !lang || !env) {
    throw new ServerError("server 初始化失败", 500);
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
          reduxInitialState={JSON.stringify(store.getState())}
          preLoad={generatePreloadScriptElements(mainScripts)}
          script={generateScriptElements(runtimeScripts.concat(mainScripts))}
        />
      )
  );
};

export const renderCSR = composeRender(globalEnv, initLang, initStore, loadStore, loadLang, loadCookie)(targetRender);
