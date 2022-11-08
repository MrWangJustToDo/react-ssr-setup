// tiny compose function

import type { RootStore } from "@shared";
import type { Request, Response } from "express";
import type { ViteDevServer } from "vite";

type BaseArgs = {
  req: Request & { viteServer?: ViteDevServer };
  res: Response;
  store?: RootStore;
  env?: { [p: string]: unknown };
  lang?: string;
  page?: string[];
  assets?: {
    stylesPath?: string[];
    scriptsPath?: string[];
  };
};

export type OverrideBase<T = unknown> = BaseArgs & T;

export type AnyAction<T = BaseArgs> = (args: T) => Promise<void>;

export type SafeAction<T = Required<BaseArgs>> = (args: T) => Promise<void>;

export type Middleware<T = BaseArgs> = (next: AnyAction<T>) => AnyAction<T>;

export const composeRender =
  <T extends BaseArgs>(...middleware: Middleware<T>[]) =>
  (render: AnyAction<T>) =>
    middleware.reduce((m1, m2) => (targetRender) => m1(m2(targetRender)))(render);
