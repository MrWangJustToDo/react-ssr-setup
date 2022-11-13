import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default defineConfig(() => {
  const env = loadEnv("", process.cwd(), "");
  const isSSR = env.SSR ? JSON.parse(env.SSR) : true;
  const isCSR = isSSR ? false : JSON.parse(env.CSR) || false;
  return {
    root: process.cwd(),
    plugins: [
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
      ssr: true,
      rollupOptions: {
        input: {
          app: resolve(process.cwd(), "src/server/entry.ts"),
          renderSSR: resolve(process.cwd(), "src/server/middleware/renderPage/render/renderSSR.tsx"),
          renderCSR: resolve(process.cwd(), "src/server/middleware/renderPage/render/renderCSR.tsx"),
          renderP_CSR: resolve(process.cwd(), "src/server/middleware/renderPage/render/renderP_CSR.tsx"),
        },
        output: {
          format: "commonjs",
        },
      },
      outDir: resolve(process.cwd(), process.env.NODE_ENV === "development" ? "dev" : "dist", "server"),
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
