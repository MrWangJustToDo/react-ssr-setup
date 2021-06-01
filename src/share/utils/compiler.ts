import { Compiler, Stats } from "webpack";
import { log } from "./log";

const compilerPromise = (name: string, compiler: Compiler): Promise<void> => {
  let count = 0;
  return new Promise<void>((resolve, reject) => {
    compiler.hooks.compile.tap(name, () => log(`[${name}] Compiling`, "normal"));
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
