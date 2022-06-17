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
import { globalEnv } from "./middleware/globalEnv";
import { initLang } from "./middleware/initLang";

import type { AnyAction } from "./compose";

const targetRender: AnyAction = async ({ res, env, lang }) => {
  if (!env || !lang) {
    throw new ServerError("server 初始化失败", 500);
  }

  const stateFileContent = await getAllStateFileContent(manifestStateFile("client"));

  const mainStyles = mainStylesPath(stateFileContent);

  const runtimeScripts = runtimeScriptsPath(stateFileContent);

  const mainScripts = mainScriptsPath(stateFileContent);

  env.isSSR = false;

  res.send(
    "<!doctype html>" +
      renderToString(
        <HTML
          env={JSON.stringify(env)}
          lang={JSON.stringify(lang)}
          link={generateStyleElements(mainStyles)}
          preLoad={generatePreloadScriptElements(mainScripts)}
          script={generateScriptElements(runtimeScripts.concat(mainScripts))}
        />
      )
  );
};

export const renderP_CSR = composeRender(globalEnv, initLang)(targetRender);
