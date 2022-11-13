import { viteMiddleware } from "./viteMiddleware";
import { webpackMiddleware } from "./webpackMiddleware";

import type { Express } from "express";

export const develop = async (app: Express) => {
  if (process.env.FORMWORK === "vite") {
    await viteMiddleware(app);
  } else {
    await webpackMiddleware(app);
  }
};
