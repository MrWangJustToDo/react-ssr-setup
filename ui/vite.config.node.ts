import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import reactSWC from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import { defineConfig, loadEnv } from "vite";
import dynamicImport from "vite-plugin-dynamic-import";

// https://vitejs.dev/config/
export default defineConfig(() => {
  const env = loadEnv("", process.cwd(), "");
  const isSSR = env.SSR ? JSON.parse(env.SSR) : true;
  const isCSR = isSSR ? false : JSON.parse(env.CSR) || false;
  const isSWC = env.SWC ? JSON.parse(env.SWC) : false;
  const bundleScope = env.BUNDLE_SCOPE || "";
  const outputScope = env.OUTPUT_SCOPE || "";
  return {
    root: process.cwd(),
    plugins: [
      legacy({ targets: "defaults" }),
      dynamicImport({ loose: true }),
      isSWC
        ? reactSWC({ jsxImportSource: "@emotion/react", tsDecorators: true })
        : react({
            jsxImportSource: "@emotion/react",
            babel: {
              plugins: ["@emotion/babel-plugin", ["@babel/plugin-proposal-decorators", { legacy: true }]],
            },
          }),
    ],
    resolve: {
      alias: {
        "@build": resolve(process.cwd(), "build"),
        "@server": resolve(process.cwd(), "src", "server"),
        "@client": resolve(process.cwd(), "src", "client"),
        "@shared": resolve(process.cwd(), "src", "shared"),
      },
    },
    build: {
      ssr: true,
      rollupOptions: {
        input: {
          app: resolve(process.cwd(), "src/server/entry.ts"),
          renderSSR: resolve(process.cwd(), "src/server/middleware/renderPage/native/renderSSR.tsx"),
          renderCSR: resolve(process.cwd(), "src/server/middleware/renderPage/native/renderCSR.tsx"),
          renderP_CSR: resolve(process.cwd(), "src/server/middleware/renderPage/native/renderP_CSR.tsx"),
        },
        output: {
          format: "commonjs",
        },
      },
      outDir: resolve(process.cwd(), bundleScope, process.env.NODE_ENV === "development" ? "dev" : "dist", outputScope, "server"),
    },
    define: {
      __SSR__: isSSR,
      __CSR__: isCSR,
      __VITE__: true,
      __BUNDLE_SCOPE__: JSON.stringify(bundleScope),
      __OUTPUT_SCOPE__: JSON.stringify(outputScope),
      __CLIENT__: 'typeof window !== "undefined"',
      __SERVER__: 'typeof window === "undefined"',
      // vite dev only work on the middleware mode
      __MIDDLEWARE__: true,
      __DEVELOPMENT__: process.env.NODE_ENV === "development",
      __BUILD_TIME__: JSON.stringify(new Date().toLocaleString()),
    },
  };
});
