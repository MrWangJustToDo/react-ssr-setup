import { spawn } from "child_process";
import dotenv from "dotenv";

import { start } from "./entry-prod";

dotenv.config();

const generate = async () => {
  if (process.env.FORMWORK !== "webpack") {
    throw new Error("for now the static generate only work for webpack formwork!");
  }
  await start();
  spawn("cross-env STATIC_GENERATE=true node", ["./dist/server/app.js"], { shell: true, stdio: "inherit" });
};

generate();
