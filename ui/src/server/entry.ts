import dotenv from "dotenv";
import express from "express";
import { resolve } from "path";

import { getIsStaticGenerate } from "@shared";

import { setApi } from "./api";
import { generateHandler } from "./app";
import { generateStaticPage } from "./generator";
import { develop } from "./middleware/develop";
import { page } from "./static";
import { serverLog } from "./util/serverLog";

let handlerRender = generateHandler;

dotenv.config();

const startApp = async () => {
  const app = express();

  app.use(express.static(`${process.cwd()}/public`));

  if (__VITE__) {
    app.use(express.static(resolve(process.cwd(), __BUNDLE_SCOPE__, "dist", "client")));
  } else {
    app.use(express.static(resolve(process.cwd(), __BUNDLE_SCOPE__, "dist")));
  }

  page(app);

  setApi(app);

  await develop(app);

  app.use(async (req, res, next) => {
    const render = await handlerRender();
    await render(req, res, next);
  });

  if (__DEVELOPMENT__ && process.env.FRAMEWORK === "webpack" && module.hot) {
    module.hot.accept("./app.ts", () => {
      serverLog("app update", "info");
      handlerRender = generateHandler;
    });
    module.hot.dispose(() => process.exit(0));
  }

  const port = __DEVELOPMENT__ ? process.env.DEV_PORT : process.env.PROD_PORT;

  app.listen(port, () => {
    if (getIsStaticGenerate()) {
      serverLog(`start static page generate, base on current router`, "info");
      generateStaticPage().then(() => {
        process.exit(0);
      });
    } else {
      serverLog(`app is running, open http://localhost:${port}`, "info");
    }
  });
};

startApp();
