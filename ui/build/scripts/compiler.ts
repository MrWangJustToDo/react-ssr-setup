import { DynamicRouter } from "./dynamic";
import { logger } from "./log";

import type { Compiler } from "webpack";

export const compilerPromise = (name: "client" | "server", compiler: Compiler, dynamicRouter = false, development = true) => {
  let count = 0;
  let dynamicCount = 0;
  const dynamicFactory = new DynamicRouter(name);
  if (development && dynamicRouter) {
    logger().info(`[${name}] Dynamic Router enabled!, now you can create a new page under the pages folder for fast refresh`);
  }

  return new Promise<void>((resolve, reject) => {
    compiler.hooks.compile.tap(name, () => logger().info(`[${name}] Compiling`));
    if (dynamicRouter) {
      compiler.hooks.beforeCompile.tapPromise(name, () => {
        if (dynamicCount === count) {
          dynamicCount++;
          return dynamicFactory.getDynamicRouter();
        } else {
          return Promise.resolve();
        }
      });
    }
    compiler.hooks.done.tap(name, (stats) => {
      if (!stats.hasErrors()) {
        development
          ? logger().info(`[${name}] compiler done, compiler count: ${count++} -- time: ${stats.endTime - stats.startTime} ms`)
          : logger().info(`[${name}] production code compiler done -- time: ${stats.endTime - stats.startTime} ms`);
        if (name === "server") {
          require.cache = {};
        }
        return resolve();
      } else {
        logger().error(`[${name}] Failed to compile`);
        return reject();
      }
    });
  });
};
