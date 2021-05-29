const chalk = require("chalk");

const compilerPromise = (name, compiler) => {
  var count = 0;
  return new Promise((resolve, reject) => {
    compiler.hooks.compile.tap(name, () => console.log(chalk.blue(`[${name}] Compiling`)));
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
