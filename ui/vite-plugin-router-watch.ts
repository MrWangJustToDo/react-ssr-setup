import { DynamicRouter } from "./build/scripts/dynamic";

import type { PluginOption } from "vite";

const dynamicInstance = new DynamicRouter("client");

export const watchRouter = (config?: { silent?: boolean; timeout?: number; onInit?: boolean }): PluginOption => {
  const options = {
    silent: false,
    timeout: 500,
    onInit: true,
    ...config,
  };

  let throttled = false;

  const execute = () => dynamicInstance.getDynamicRouter();

  return {
    name: "vite-plugin-router-watch",

    buildStart() {
      if (options.onInit) {
        return execute();
      }
    },

    handleHotUpdate({ file }) {
      if (throttled) return;

      throttled = true;

      setTimeout(() => (throttled = false), options.timeout);

      if (file.includes("src/client/pages")) {
        return execute();
      }
    },
  };
};
