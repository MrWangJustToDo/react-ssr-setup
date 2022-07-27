import path from "path";

import { start } from "./entry-dev";

const startDev = async () => {
  await start();
  await import(path.resolve(process.cwd(), "dev", "server", "app"));
};

startDev();
