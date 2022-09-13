import dotenv from "dotenv";
import path from "path";

import { start } from "./entry-dev";

dotenv.config();

const startDev = async () => {
  await start();
  await import(path.resolve(process.cwd(), "dev", "server", "app"));
};

startDev();
