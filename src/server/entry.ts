import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import compression from "compression";
import prettyError from "pretty-error";

import { render } from "server/middleware/render";
import { develop } from "server/middleware/develop";
import { renderError } from "server/middleware/renderError";
import { manifestLoadable } from "share/helper/manifest";
import { transformHandler, catchHandler } from "server/middleware/apiHandler";

dotenv.config();

prettyError.start();

global.webStats = manifestLoadable("client");

const app = express();

const port = process.env.NODE_ENV === "development" ? process.env.DEV_PORT || 3000 : process.env.PROD_PORT;

app.use(cors());

app.use(compression());

app.use(express.static(`${process.cwd()}/static`));

app.use(express.static(`${process.cwd()}/dist`));

app.use(express.json({ limit: "5mb" }));

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    rolling: true,
    saveUninitialized: true,
    cookie: { maxAge: 600000 },
    name: "react-ssr",
  })
);

develop(app).then(() => {
  app.use(
    transformHandler(
      catchHandler(
        async ({ req, res, next }) => await render({ req, res, next }),
        ({ req, res, next, e, code }) => renderError({ req, res, next, e, code })
      )
    )
  );
  app.listen(port, () => console.log(chalk.blue(`\nApp is running: http://localhost:${port}`)));
});
