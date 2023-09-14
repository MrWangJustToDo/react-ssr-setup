import { RenderError } from "@server/util/renderError";
import {
  manifestStateFile as viteManifestStateFile,
  getAllStateFileContent as getAllViteStateFileContent,
  mainScriptsPath as viteMainScriptsPath,
  mainStylesPath as viteMainStylesPath,
} from "@server/util/viteManifest";
import {
  dynamicPageScriptsPath,
  dynamicPageStylesPath,
  getAllStateFileContent,
  getDynamicPagePath,
  mainScriptsPath,
  mainStylesPath,
  manifestDepsFile,
  manifestStateFile,
  runtimeScriptsPath,
} from "@server/util/webpackManifest";
import { getIsSSR } from "@shared";

import type { Middleware } from "../compose";

export const loadAsset: Middleware = (next) => async (args) => {
  if (__VITE__) {
    if (__DEVELOPMENT__) {
      const assets = {
        scriptsPath: [
          {
            type: "module",
            path: "/@vite/client",
          },
          {
            type: "module",
            dangerouslySetInnerHTML: {
              __html: `
              // react refresh injected
              import RefreshRuntime from "/@react-refresh"
              RefreshRuntime.injectIntoGlobalHook(window)
              window.$RefreshReg$ = () => {}
              window.$RefreshSig$ = () => (type) => type
              window.__vite_plugin_react_preamble_installed__ = true
                `,
            },
          },
          {
            type: "module",
            path: process.env.CLIENT_ENTRY,
          },
        ],
      };
      args.assets = assets;
    } else {
      const assets = {
        stylesPath: [],
        scriptsPath: [],
        preloadScriptsPath: [],
      };

      const stateFileContent = await getAllViteStateFileContent(viteManifestStateFile("client"));

      const mainStyles = viteMainStylesPath(stateFileContent);

      const mainScripts = viteMainScriptsPath(stateFileContent);

      assets.stylesPath = mainStyles;

      assets.scriptsPath = mainScripts;

      args.assets = assets;
    }
  } else {
    const { req } = args;

    const isSSR = getIsSSR() || req.query.isSSR;

    const assets = {
      stylesPath: [],
      scriptsPath: [],
      preloadScriptsPath: [],
    };

    const stateFileContent = await getAllStateFileContent(manifestStateFile("client"));

    const mainStyles = mainStylesPath(stateFileContent);

    const runtimeScripts = runtimeScriptsPath(stateFileContent);

    const mainScripts = mainScriptsPath(stateFileContent);

    assets.stylesPath = mainStyles;

    const allScriptsPath = mainScripts.concat(runtimeScripts);

    assets.preloadScriptsPath = allScriptsPath;

    assets.scriptsPath = allScriptsPath;

    if (isSSR) {
      const { page } = args;

      if (!page) throw new RenderError("render page 没有初始化", 500);

      const depsFileContent = await getAllStateFileContent<
        Record<
          string,
          {
            path: string[];
            static: boolean;
          }
        >,
        Record<string, string[]>
      >(manifestDepsFile("client"), (content) =>
        Object.keys(content)
          .map((key) => ({ [key]: content[key].path }))
          .reduce((p, c) => ({ ...p, ...c }), {})
      );

      const dynamicPage = getDynamicPagePath(depsFileContent, page);

      const dynamicStylesPath = dynamicPageStylesPath(stateFileContent, dynamicPage);

      const dynamicScriptsPath = dynamicPageScriptsPath(stateFileContent, dynamicPage);

      assets.stylesPath = assets.stylesPath.concat(dynamicStylesPath);

      assets.scriptsPath = assets.scriptsPath.concat(dynamicScriptsPath).reverse();

      assets.preloadScriptsPath = assets.preloadScriptsPath.concat(dynamicScriptsPath);
    }

    args.assets = assets;
  }

  await next(args);
};
