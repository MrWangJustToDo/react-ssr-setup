import express from "express";
import session from "express-session";
import cors from "cors";
import chalk from "chalk";
import { render } from './middleware/render';

require("dotenv").config();

const app = express();

const port = process.env.PROD_PORT;

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
    name: "blog_id",
  })
);

app.use(async (req, res, next) => {
  await render({ req, res, next });
});

app.listen(port || 3000, () => console.log(chalk.blue(`App is running: http://localhost:${port || 3000}`)));
