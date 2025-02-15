import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import reactSWC from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import { defineConfig, loadEnv } from "vite";
import dynamicImport from "vite-plugin-dynamic-import";

import { watchRouter } from "./vite-plugin-router-watch";

// https://vitejs.dev/config/
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default defineConfig(async () => {
  const env = loadEnv("", process.cwd(), "");
  const isSSR = env.SSR ? JSON.parse(env.SSR) : true;
  const isCSR = isSSR ? false : JSON.parse(env.CSR) || false;
  const isSWC = env.SWC ? JSON.parse(env.SWC) : false;
  const bundleScope = env.BUNDLE_SCOPE || "";
  const outputScope = env.OUTPUT_SCOPE || "";
  return {
    root: process.cwd(),
    plugins: [
      isSWC
        ? reactSWC({ jsxImportSource: "@emotion/react", tsDecorators: true })
        : react({
            jsxImportSource: "@emotion/react",
            babel: {
              plugins: ["@emotion/babel-plugin", ["@babel/plugin-proposal-decorators", { legacy: true }]],
            },
          }),
      legacy({ targets: "defaults" }),
      // enable webpack like dynamic import
      dynamicImport({ loose: true }),
      watchRouter(),
    ],
    server: {
      middlewareMode: true,
    },
    appType: "custom",
    resolve: {
      alias: {
        "@build": resolve(process.cwd(), "build"),
        "@server": resolve(process.cwd(), "src", "server"),
        "@client": resolve(process.cwd(), "src", "client"),
        "@shared": resolve(process.cwd(), "src", "shared"),
      },
      dedupe: ["@emotion/react"],
    },
    build: {
      manifest: process.env.NODE_ENV === "development" ? "manifest-dev-vite.json" : "manifest-prod-vite.json",
      rollupOptions: {
        input: resolve(process.cwd(), "src/client/entry.tsx"),
        output: {
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              if (id.includes("core-js")) return "vendor-core-js";
              if (id.includes("@chakra-ui")) return "vendor-ui";
              if (id.includes("@babel")) return "vendor-babel";
              if (id.includes("@emotion")) return "vendor-ui";
              if (id.includes("react")) return "vendor-react";
              if (id.includes("lodash")) return "vendor-lodash";
              return "vendor";
            }
            if (id.includes("entry.tsx")) return "entry";
          },
        },
      },
      outDir: resolve(process.cwd(), bundleScope, process.env.NODE_ENV === "development" ? "dev" : "dist", outputScope, "client"),
    },
    css: {
      preprocessorOptions: {
        scss: { api: "modern-compiler" },
      },
    },
    define: {
      __SSR__: isSSR,
      __CSR__: isCSR,
      __VITE__: true,
      __BUNDLE_SCOPE__: JSON.stringify(bundleScope),
      __OUTPUT_SCOPE__: JSON.stringify(outputScope),
      __CLIENT__: true,
      __SERVER__: false,
      // vite dev only work on the middleware mode
      __MIDDLEWARE__: true,
      __DEVELOPMENT__: process.env.NODE_ENV === "development",
      __BUILD_TIME__: JSON.stringify(new Date().toLocaleString()),
    },
    legacy: {
      proxySsrExternalModules: true,
    },
  };
});
