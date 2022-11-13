/* eslint-disable @typescript-eslint/no-var-requires */
import { resolve as pathResolve } from "path";

import type { Express, NextFunction, Request as ExpressRequest } from "express";
import type { ViteDevServer } from "vite";

type Request = ExpressRequest & {
  viteServer?: ViteDevServer;
};

export const viteMiddleware = async (app: Express) => {
  if (__DEVELOPMENT__ && process.env.CLIENT_ENTRY) {
    const vite = require("vite");
    const viteServer = (await vite.createServer({
      configFile: pathResolve(process.cwd(), "vite.config.ts"),
    })) as ViteDevServer;
    app.use(viteServer.middlewares);
    app.use((req: Request, _, next: NextFunction) => {
      req.viteServer = viteServer;
      next();
    });
  }
};
