import dotenv from "dotenv";
import express from "express";

import { getIsStaticGenerate } from "@app/util/env";

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

  app.use(express.static(`${process.cwd()}/static`));

  app.use(express.static(`${process.cwd()}/dist`));

  page(app);

  setApi(app);

  await develop(app);

  app.use((req, res, next) => {
    handlerRender()(req, res, next);
  });

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept("./app.ts", () => {
      serverLog("app update", "info");
      handlerRender = generateHandler;
    });
    module.hot.dispose(() => process.exit(0));
  }

  const port = __DEVELOPMENT__ ? process.env.DEV_PORT : process.env.PROD_PORT;

  app.listen(port as string, () => {
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
