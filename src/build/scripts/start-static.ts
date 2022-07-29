import { spawn } from "child_process";

import { start } from "./entry-prod";

const generate = async () => {
  await start();
  spawn("cross-env STATIC_GENERATE=true node", ["./dist/server/app.js"], { shell: true, stdio: "inherit" });
};

generate();
