import dotenv from "dotenv";
import path from "path";

import { start } from "./entry-dev";

dotenv.config();

const startDev = async () => {
  await start();
  const bundleScope = process.env.BUNDLE_SCOPE || "";
  await import(path.resolve(process.cwd(), bundleScope, "dev", "server", "app"));
};

startDev();
