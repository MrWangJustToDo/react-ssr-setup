import { viteMiddleware } from "./viteMiddleware";
import { webpackMiddleware } from "./webpackMiddleware";

import type { Express } from "express";

// support multiple develop framework
const useVITE = true;

export const develop = async (app: Express) => {
  if (useVITE) {
    await viteMiddleware(app);
  } else {
    await webpackMiddleware(app);
  }
};
