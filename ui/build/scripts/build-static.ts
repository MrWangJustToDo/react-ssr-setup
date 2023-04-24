import { spawn } from "child_process";
import dotenv from "dotenv";
import { resolve } from "path";

import { start } from "./entry-prod";

dotenv.config();

const generate = async () => {
  if (process.env.FRAMEWORK !== "webpack") {
    throw new Error("for now the static generate only work for webpack framework!");
  }
  await start();
  const bundleScope = process.env.BUNDLE_SCOPE || "";
  spawn("cross-env STATIC_GENERATE=true node", [resolve(process.cwd(), bundleScope, "dist", "server/app.js")], { shell: true, stdio: "inherit" });
};

generate();
