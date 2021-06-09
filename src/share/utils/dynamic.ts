import fs from "fs";
import path from "path";
import { log } from "./log";
import { DynamicRouteConfig } from "types/share";

class DynamicRouter {
  value = "";

  getRouterConfig = (prePath: string, dirName: string): Promise<DynamicRouteConfig[]> => {
    return new Promise((resolve) => {
      const routes: DynamicRouteConfig[] = [];
      let dynamicPath = 0;
      fs.promises
        .readdir(dirName, { withFileTypes: true })
        .then((files) =>
          Promise.all(
            files.map((file) => {
              if (file.isFile() && /.[tj]sx?$/.test(file.name)) {
                const [, fileName] = Array.from(/(.*).[tj]sx?$/.exec(file.name) || []);
                const config: DynamicRouteConfig = {};
                if (/^_(.*)$/.test(fileName)) {
                  if (dynamicPath === 0) {
                    dynamicPath++;
                    const [, params] = Array.from(/^_(.*)$/.exec(fileName) || []);
                    config.path = `${prePath}:${params}`;
                  } else {
                    throw new Error(`file router dynamicpath duplicate`);
                  }
                } else {
                  config.path = `${prePath}${fileName}`;
                }
                config.exact = true;
                config.componentPath = `${prePath.slice(1)}${fileName}`;
                // 文件名字重复
                if (routes.some((route) => route.path === config.path)) {
                  throw new Error(`file router duplicate, ${config.path}`);
                }
                routes.push(config);
              } else if (file.isDirectory()) {
                return this.getRouterConfig(`${prePath}${file.name}/`, `${dirName}/${file.name}`).then((res) => {
                  routes.push(...res);
                });
              }
            })
          )
        )
        .then(() => {
          if (dynamicPath === 1) {
            routes.sort((_, t) => (t.path && /^\[(.*)\]$/.test(t.path) ? -1 : 0));
          }
        })
        .then(() => resolve(routes))
        .catch((e) => log(`file router error, ${e.toString()}`, "error"));
    });
  };

  getRouterTemplate = (routerResult: string): string => {
    const template = `/* eslint-disable prettier/prettier */
/* do not editor this template */
import { DynamicRouteConfig } from "types/share";

const routerConfig: DynamicRouteConfig[] = ${routerResult};

export default routerConfig;`;
    return template;
  };

  isNoChange = (routerResult: string): boolean => {
    if (this.value === routerResult) {
      log(`[client] file router do not need update from cache`, "normal");
      return true;
    } else {
      log(`[client] file router need update from cache`, "warn");
      this.value = routerResult;
      return false;
    }
  };

  getRouterFile = (filePath: string): Promise<string> => {
    return fs.promises.readFile(filePath, { encoding: "utf-8" });
  };

  writeRouterFile = (filePath: string, content: string): Promise<void> => {
    return fs.promises.writeFile(filePath, content);
  };

  getDynamicRouter = async (): Promise<void> => {
    const pages = path.resolve(process.cwd(), "src", "pages");
    const dynamicRouteFilename = path.resolve(process.cwd(), "src", "router", "dynamicRoutes.ts");
    const routerConfig = await this.getRouterConfig("/", pages);
    const routerResult = JSON.stringify(routerConfig);
    const cacheCheck = this.isNoChange(routerResult);
    if (!cacheCheck) {
      const currentTemplate = await this.getRouterFile(dynamicRouteFilename);
      const newTemplate = this.getRouterTemplate(routerResult);
      if (currentTemplate === newTemplate) {
        log(`[client] file router do not need update from template`, "normal");
        this.value = routerResult;
      } else {
        await this.writeRouterFile(dynamicRouteFilename, newTemplate);
        log(`[client] file router updated`, "warn");
        this.value = routerResult;
      }
    }
  };
}

export default DynamicRouter;
