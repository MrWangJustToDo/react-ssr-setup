/* eslint-disable @typescript-eslint/no-var-requires */
import dotenv from "dotenv";
import express from "express";

import { catchMiddlewareHandler, compose, defaultRunRequestMiddleware, wrapperMiddlewareRequest } from "server/middleware/apiHandler";
import { develop } from "server/middleware/develop";
import { renderError } from "server/middleware/renderError";
import { getIsStaticGenerate } from "utils/env";
import { log } from "utils/log";

import { apiHandler } from "./api";
import { generateStaticPage } from "./generator";
import { init } from "./init";
import { setUp } from "./setup";
import { page } from "./static";

// eslint-disable-next-line import/no-named-as-default-member
dotenv.config();

const app = express();

const port = __DEVELOPMENT__ ? process.env.DEV_PORT || 3000 : process.env.PROD_PORT;

setUp(app);

page(app);

init(app);

app.use("/api", apiHandler);

if (__CSR__) {
  const { renderP_CSR } = require("server/middleware/renderPage/renderP_CSR");
  develop(app).then(() => {
    app.use(
      wrapperMiddlewareRequest(
        {
          requestHandler: renderP_CSR,
          errorHandler: ({ req, res, code, e }) => renderError({ req, res, e, code }),
        },
        compose(catchMiddlewareHandler, defaultRunRequestMiddleware)
      )
    );
    app.listen(port, () => log(`App is running: http://localhost:${port}`, "warn"));
  });
} else {
  const { render } = require("server/middleware/render");
  develop(app).then(() => {
    app.use(
      wrapperMiddlewareRequest(
        {
          requestHandler: render,
          errorHandler: ({ req, res, code, e }) => renderError({ req, res, e, code }),
        },
        compose(catchMiddlewareHandler, defaultRunRequestMiddleware)
      )
    );
    app.listen(port, () => {
      log(`App is running: http://localhost:${port}`, "warn");
      if (getIsStaticGenerate()) {
        generateStaticPage().then(() => {
          process.exit(0);
        });
      }
    });
  });
}
