const chalk = require("chalk");
const { dynamicCache, DynamicRouter } = require("./dynamic");

const compilerPromise = (name, compiler, devRouter = false) => {
  var count = 0;
  var dynamicCount = 0;
  const dynamicFactory = new DynamicRouter(dynamicCache, name);
  return new Promise((resolve, reject) => {
    compiler.hooks.compile.tap(name, () => console.log(chalk.blue(`[${name}] Compiling`)));
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
        console.log(chalk.blue(`[${name}] compiler done, compiler count: ${count++}`));
        return resolve();
      }
      return reject(`Failed to compile ${name}`);
    });
  });
};

exports.compilerPromise = compilerPromise;
