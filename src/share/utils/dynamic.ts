// 动态获取pages文件夹下的文件，并映射为router

// 暂时没法实现  webpack打包问题
import fs from "fs";
import { DynamicRouteConfig } from "types/share";

const getRouterServer = (prePath: string, dirName: string): Promise<DynamicRouteConfig[]> => {
  return new Promise((resolve) => {
    const routes: DynamicRouteConfig[] = [];
    fs.promises
      .readdir(dirName, { withFileTypes: true })
      .then((files) => {
        console.log(files);
        return Promise.all(
          files.map((file) => {
            if (file.isFile() && /.[tj]sx?$/.test(file.name)) {
              const [, fileName] = Array.from(/(.*).[tj]sx?$/.exec(file.name)!);
              const config = {
                path: `${prePath}${fileName}`,
                exact: false,
                componentPath: `pages${prePath}${fileName}`,
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

export { getRouterServer };
