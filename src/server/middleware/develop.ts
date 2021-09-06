/* eslint-disable @typescript-eslint/no-var-requires */
import path from "path";
import { Express } from "express";

const develop = (app: Express): Promise<void> => {
  return new Promise((resolve) => {
    if (__DEVELOPMENT__ && __MIDDLEWARE__ && process.env.CLIENTENTRY) {
      const webpack = require("webpack");
      const webpackHotMiddleware = require("webpack-hot-middleware");
      const webpackDevMiddleware = require("webpack-dev-middleware");
      const { compilerPromise } = require("share/utils/compiler");
      const { ClientConfig } = require("../../../webpack/webpack.client.config");
      const config = ClientConfig(path.resolve(process.cwd(), process.env.CLIENTENTRY), true);
      const compiler = webpack(config);
      const clientPromise = compilerPromise("client", compiler);
      app.use(
        webpackDevMiddleware(compiler, {
          stats: false,
          publicPath: "/dev/",
          writeToDisk: (filepath: string) => filepath.includes("manifest-loadable.json") || filepath.includes("manifest-dev.json"),
        })
      );
      app.use(webpackHotMiddleware(compiler));
      return clientPromise.then(resolve);
    } else {
      resolve();
    }
  });
};

export { develop };
