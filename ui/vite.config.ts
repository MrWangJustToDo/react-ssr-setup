import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig, loadEnv } from "vite";
import dynamicImport from "vite-plugin-dynamic-import";

// https://vitejs.dev/config/
export default defineConfig(() => {
  const env = loadEnv("", process.cwd(), "");
  const isSSR = env.SSR ? JSON.parse(env.SSR) : true;
  const isCSR = isSSR ? false : JSON.parse(env.CSR) || false;
  return {
    root: process.cwd(),
    plugins: [
      // enable webpack like dynamic import
      dynamicImport({ loose: true }),
      react({
        jsxImportSource: "@emotion/react",
        babel: {
          plugins: ["@emotion/babel-plugin", ["@babel/plugin-proposal-decorators", { legacy: true }]],
        },
      }),
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
              if (id.includes("@emotion")) return "vendor-emotion";
              if (id.includes("react")) return "vendor-react";
              if (id.includes("lodash")) return "vendor-lodash";
              return "vendor";
            }
            if (id.includes("entry.tsx")) return "entry";
          },
        },
      },
      outDir: resolve(process.cwd(), process.env.NODE_ENV === "development" ? "dev" : "dist", "client"),
    },
    define: {
      __SSR__: isSSR,
      __CSR__: isCSR,
      __VITE__: true,
      __CLIENT__: 'typeof window !== "undefined"',
      __SERVER__: 'typeof window === "undefined"',
      // vite dev only work on the middleware mode
      __MIDDLEWARE__: true,
      __DEVELOPMENT__: process.env.NODE_ENV === "development",
      __BUILD_TIME__: JSON.stringify(new Date().toLocaleString()),
    },
  };
});
