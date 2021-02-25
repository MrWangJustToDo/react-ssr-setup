import express from "express";
import session from "express-session";
import cors from "cors";
import chalk from "chalk";

require("dotenv").config();

const app = express();

const port = process.env.PROD_PORT;

app.use(cors());

app.use(express.static(`${process.cwd()}/public`));

app.use(express.json({ limit: "5mb" }));

app.use(express.urlencoded({ extended: true }));

app.use(session());

app.listen(port || 3000, () => console.log(`[${new Date().toISOString()}]`, chalk.blue(`App is running: http://localhost:${port || 3000}`)));
