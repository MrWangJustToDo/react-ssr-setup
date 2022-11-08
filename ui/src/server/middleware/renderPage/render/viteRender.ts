import { resolve } from "path";

import type { SafeAction } from "../compose";

type Mode = { mode: "SSR" | "CSR" | "P_CSR" };

export const viteRender =
  ({ mode }: Mode): SafeAction =>
  async (args) => {
    const { req } = args;
    const { viteServer } = req;
    const { targetRender } = await viteServer.ssrLoadModule(resolve(process.cwd(), "src/server/middleware/renderPage/render", `render${mode}.tsx`));
    await targetRender(args);
  };
