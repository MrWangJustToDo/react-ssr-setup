import { renderToString } from "react-dom/server";

import { ServerError } from "server/utils/error";
import { HTML } from "template/Html";
import { generateScriptElements, generateStyleElements, getAllStateFileContent, manifestStateFile } from "utils/manifest";

import { composeRender } from "./compose";
import { globalEnv } from "./middleware/globalEnv";
import { initLang } from "./middleware/initLang";

import type { AnyAction } from "./compose";

const targetRender: AnyAction = async ({ res, env, lang }) => {
  if (!env || !lang) {
    throw new ServerError("server 初始化失败", 500);
  }

  // get state from state file

  const stateFileContent = await getAllStateFileContent(manifestStateFile("client"));

  const mainStylePaths = Object.keys(stateFileContent)
    .filter((file) => file.endsWith(".css"))
    .filter((file) => file.startsWith("main") || file.startsWith("vendor"))
    .map((key) => stateFileContent[key]);

  const runtimeScript = Object.keys(stateFileContent)
    .filter((file) => file.endsWith(".js"))
    .filter((file) => file.startsWith("runtime"))
    .map((key) => stateFileContent[key]);

  const mainScript = Object.keys(stateFileContent)
    .filter((file) => file.endsWith(".js"))
    .filter((file) => file.startsWith("main") || file.startsWith("vendor") || file.startsWith("react") || file.startsWith("ui"));

  env.isSSR = false;

  res.send(
    "<!doctype html>" +
      renderToString(
        <HTML
          env={JSON.stringify(env)}
          lang={JSON.stringify(lang)}
          script={generateScriptElements(runtimeScript.concat(mainScript))}
          link={generateStyleElements(mainStylePaths)}
        />
      )
  );
};

export const renderP_CSR = composeRender(globalEnv, initLang)(targetRender);
