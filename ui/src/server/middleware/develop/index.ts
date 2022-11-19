import { viteMiddleware } from "./viteMiddleware";
import { webpackMiddleware } from "./webpackMiddleware";

import type { Express } from "express";

export const develop = async (app: Express) => {
  if (__VITE__) {
    await viteMiddleware(app);
  } else {
    await webpackMiddleware(app);
  }
};
