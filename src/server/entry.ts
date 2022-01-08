import dotenv from "dotenv";
import express from "express";

import { log } from "utils/log";
import { init } from "./init";
import { setUp } from "./setup";
import { apiHandler } from "./api";
import { render } from "server/middleware/render";
import { develop } from "server/middleware/develop";
import { renderError } from "server/middleware/renderError";
import { catchMiddlewareHandler, compose, defaultRunRequestMiddleware, wrapperMiddlewareRequest } from "server/middleware/apiHandler";

dotenv.config();

const app = express();

const port = __DEVELOPMENT__ ? process.env.DEV_PORT || 3000 : process.env.PROD_PORT;

setUp(app);

init(app);

app.use("/api", apiHandler);

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
  app.listen(port, () => log(`App is running: http://localhost:${port}`, "warn"));
});
