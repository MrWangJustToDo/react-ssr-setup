const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

const getRouterServer = (prePath, dirName) => {
  return new Promise((resolve) => {
    const routes = [];
    let dynamicPath = 0;
    fs.promises
      .readdir(dirName, { withFileTypes: true })
      .then((files) => {
        return Promise.all(
          files.map((file) => {
            if (file.isFile() && /.[tj]sx?$/.test(file.name)) {
              const [, fileName] = Array.from(/(.*).[tj]sx?$/.exec(file.name));
              const config = {};
              // 初步估计时babel-loadable的bug导致的,由于文件名字冲突
              // 使用新的动态命名方式 _参数名.tsx 作为动态路由的约定
              if (/^_(.*)$/.test(fileName)) {
                if (dynamicPath === 0) {
                  dynamicPath++;
                  const [, params] = Array.from(/^_(.*)$/.exec(fileName));
                  config.path = `${prePath}:${params}`;
                } else {
                  throw new Error(`file router dynamicpath duplicate`);
                }
              } else {
                config.path = `${prePath}${fileName}`;
              }
              config.exact = true;
              config.componentPath = `${prePath.slice(1)}${fileName}`;
              if (routes.some((route) => route.path === config.path)) {
                throw new Error(`file router duplicate, ${config.path}`);
              }
              routes.push(config);
            } else if (file.isDirectory()) {
              return getRouterServer(`${prePath}${file.name}/`, `${dirName}/${file.name}`).then((res) => {
                routes.push(...res);
              });
            }
          })
        );
      })
      .then(() => {
        if (dynamicPath === 1) {
          routes.sort((_, t) => (/^\[(.*)\]$/.test(t.path) ? -1 : 0));
        }
      })
      .then(() => resolve(routes))
      .catch((e) => console.log(chalk.red(`file router error, ${e.toString()}`), []));
  });
};

const routerTemplate = (config) => {
  const template = `
  import { DynamicRouteConfig } from "types/share";

  const routerConfig: DynamicRouteConfig[] = ${JSON.stringify(config)};

  export default routerConfig;
  `;
  return template;
};

const writeFile = async (fileName, content) => {
  await fs.promises.writeFile(fileName, content);
};

const getDynamicRouter = async () => {
  const pages = path.resolve(process.cwd(), "src", "pages");
  const dynamicConfig = await getRouterServer("/", pages);
  const template = routerTemplate(dynamicConfig);
  const dynamicRouteFilename = path.resolve(process.cwd(), "src", "router", "dynamicRoutes.ts");
  await writeFile(dynamicRouteFilename, template);
  console.log(chalk.green("file router done"));
};

exports.getDynamicRouter = getDynamicRouter;
