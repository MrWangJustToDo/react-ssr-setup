import { Compiler, Stats } from "webpack";
import { log } from "./log";
import Dynamic from "./dynamic";

const compilerPromise = (name: string, compiler: Compiler): Promise<void> => {
  let count = 0;
  let dynamic = 0;
  const dynamicFactory = new Dynamic();
  return new Promise<void>((resolve, reject) => {
    compiler.hooks.compile.tap(name, () => log(`[${name}] Compiling`, "normal"));
    compiler.hooks.beforeCompile.tapPromise(name, () => {
      if (dynamic === count) {
        dynamic++;
        return dynamicFactory.getDynamicRouter();
      } else {
        return Promise.resolve();
      }
    });
    compiler.hooks.done.tap(name, (stats: Stats) => {
      if (!stats.hasErrors()) {
        log(`[${name}] compiler done, compiler count: ${count++}`, "normal");
        return resolve();
      }
      return reject(`Failed to compile ${name}`);
    });
  });
};

export { compilerPromise };
