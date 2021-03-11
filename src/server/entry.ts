import cors from "cors";
import chalk from "chalk";
import express from "express";
import session from "express-session";

import { render } from "server/middleware/render";
import { renderError } from "server/middleware/renderError";
import { transformHandler, catchHandler } from "server/middleware/apiHandler";

require("dotenv").config();

const app = express();

const port = process.env.DEV_PORT || 3000;

app.use(cors());

app.use(express.static(`${process.cwd()}/public`));

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

app.use(
  transformHandler(
    catchHandler(
      async ({ req, res, next }) => await render({ req, res, next }),
      ({ req, res, next, e, code }) => renderError({ req, res, next, e, code })
    )
  )
);

app.listen(port, () => console.log(chalk.blue(`\nApp is running: http://localhost:${port}`)));