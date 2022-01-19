/* eslint-disable @typescript-eslint/no-var-requires */
import path from "path";

import type { Express } from "express";

const develop = (app: Express): Promise<void> => {
  return new Promise((resolve) => {
    if (__DEVELOPMENT__ && __MIDDLEWARE__ && process.env.CLIENT_ENTRY) {
      const webpack = require("webpack");
      const webpackHotMiddleware = require("webpack-hot-middleware");
      const webpackDevMiddleware = require("webpack-dev-middleware");
      const { compilerPromise } = require("script/compiler");
      const { ClientConfig } = require("webpackConfig/webpack.client.config");
      const config = ClientConfig(path.resolve(process.cwd(), process.env.CLIENT_ENTRY), true);
      const compiler = webpack(config);
      const clientPromise = compilerPromise("client", compiler, { dynamicRouter: true, development: true });
      
      app.use(webpackDevMiddleware(compiler, config.devServer.devMiddleware));
      app.use(webpackHotMiddleware(compiler));
      return clientPromise.then(resolve).catch(resolve);
    } else {
      resolve();
    }
  });
};

export { develop };
