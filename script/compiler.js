const chalk = require("chalk");
const { Compiler } = require("webpack");
const { dynamicCache, DynamicRouter } = require("./dynamic");

/**
 *
 * @param {'client' | 'server'} name
 * @param {Compiler} compiler
 * @param {boolean} devRouter
 * @returns {Promise<void>}
 */
const compilerPromise = (name, compiler, devRouter = false) => {
  var count = 0;
  var dynamicCount = 0;
  const dynamicFactory = new DynamicRouter(dynamicCache, name);
  return new Promise((resolve, reject) => {
    compiler.hooks.compile.tap(name, () => console.log(`[${name}]`, chalk.blue(`Compiling`)));
    if (devRouter) {
      compiler.hooks.beforeCompile.tapPromise("beforeCompile", () => {
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
        console.log(`[${name}]`, chalk.blue(`compiler done, compiler count: ${count++}`));
        return resolve();
      }
      return reject(`Failed to compile ${name}`);
    });
  });
};

exports.compilerPromise = compilerPromise;
