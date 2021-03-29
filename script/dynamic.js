const fs = require("fs");
const path = require("path");

const getRouterServer = (prePath, dirName) => {
  return new Promise((resolve) => {
    const routes = [];
    fs.promises
      .readdir(dirName, { withFileTypes: true })
      .then((files) => {
        return Promise.all(
          files.map((file) => {
            if (file.isFile() && /.[tj]sx?$/.test(file.name)) {
              const [, fileName] = Array.from(/(.*).[tj]sx?$/.exec(file.name));
              const config = {
                path: `${prePath}${fileName}`,
                exact: false,
                componentPath: `${prePath.slice(1)}${fileName}`,
              };
              routes.push(config);
            } else if (file.isDirectory()) {
              return getRouterServer(`${prePath}${file.name}/`, file.name).then((res) => {
                routes.push(...res);
              });
            }
          })
        );
      })
      .then(() => resolve(routes));
  });
};

/*
const getRouterConfig = (config) => {
  return config.map((it) => ({
    path: it.path,
    exact: it.exact,
    component: `\`${loadable(() => import("${it.componentPath}"))}\``,
  }));
};
*/

const routerTemplate = (config) => {
  const template = `
  import { DynamicRouteConfig } from "types/share";

  const routerConfig: DynamicRouteConfig[] = ${JSON.stringify(config)};

  export default routerConfig;
  `;
  return template;
};

const writeFile = (fileName, content) => {
  const writeStream = fs.createWriteStream(fileName);
  writeStream.write(content);
};

const getDynamicRouter = async () => {
  const pages = path.resolve(process.cwd(), "src", "pages");
  const dynamicConfig = await getRouterServer("/", pages);
  const template = routerTemplate(dynamicConfig);
  const dynamicRouteFilename = path.resolve(process.cwd(), "src", "router", "dynamicRoutes.ts");
  writeFile(dynamicRouteFilename, template);
};

exports.getDynamicRouter = getDynamicRouter;
