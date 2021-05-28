import path from "path";
import { Express } from "express";
import webpack, { Configuration } from "webpack";
import webpackHotMiddleware from "webpack-hot-middleware";
import webpackDevMiddleware from "webpack-dev-middleware";
import { compilerPromise } from "share/utils/compiler";
import { ClientConfig } from "../../../webpack/webpack.client.config";

const develop = (app: Express): Promise<void> => {
  return new Promise((resolve) => {
    if (process.env.NODE_ENV === "development" && process.env.CLIENTENTRY && process.env.MIDDLEWARE && JSON.parse(process.env.MIDDLEWARE)) {
      const config = ClientConfig(path.resolve(process.cwd(), process.env.CLIENTENTRY), true) as Configuration;
      const compiler = webpack(config);
      const clientPromise = compilerPromise("client", compiler);
      app.use(
        webpackDevMiddleware(compiler, {
          publicPath: config.output?.publicPath as string,
          writeToDisk: (filepath: string) => filepath.includes("manifest-loadable.json") || filepath.includes("manifest-dev.json"),
        })
      );
      app.use(webpackHotMiddleware(compiler as any));
      return clientPromise.then(resolve);
    } else {
      resolve();
    }
  });
};

export { develop };
