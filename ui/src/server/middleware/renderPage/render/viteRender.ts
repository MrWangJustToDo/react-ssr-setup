/* eslint-disable @typescript-eslint/no-var-requires */
import { resolve } from "path";

import type { SafeAction } from "../compose";

type Mode = { mode: "SSR" | "CSR" | "P_CSR" };

export const viteRender =
  ({ mode }: Mode): SafeAction =>
  async (args) => {
    if (__DEVELOPMENT__) {
      const { req } = args;
      const { viteServer } = req;
      const { targetRender } = await viteServer.ssrLoadModule(resolve(process.cwd(), "src/server/middleware/renderPage/native", `render${mode}.tsx`));
      await targetRender(args);
    } else {
      const { env } = args;
      if (env.isSSR) {
        const { targetRender } = await import(/* @vite-ignore */ resolve(process.cwd(), __BUNDLE_SCOPE__, "dist/server", __OUTPUT_SCOPE__, "renderSSR.js"));
        await targetRender(args);
      } else if (env.isPURE_CSR) {
        const { targetRender } = await import(/* @vite-ignore */ resolve(process.cwd(), __BUNDLE_SCOPE__, "dist/server", __OUTPUT_SCOPE__, "renderP_CSR.js"));
        await targetRender(args);
      } else {
        const { targetRender } = await import(/* @vite-ignore */ resolve(process.cwd(), __BUNDLE_SCOPE__, "dist/server", __OUTPUT_SCOPE__, "renderCSR.js"));
        await targetRender(args);
      }
    }
  };
