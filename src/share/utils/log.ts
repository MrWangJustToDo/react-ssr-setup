/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
import chalk from "chalk";

if (__SERVER__) {
  var Pretty = require("pretty-error");
  var render = new Pretty();
}

const log = (message: string | Error, lev: "normal" | "warn" | "error"): void => {
  if (lev === "error") {
    if (__SERVER__) {
      render.render(message);
    } else {
      console.log(chalk.red(message.toString()));
    }
  } else if (lev === "warn") {
    console.log(chalk.yellow(message.toString()));
  } else {
    if (__DEVELOPMENT__) {
      console.log(chalk.blue(message.toString()));
    }
  }
};

export { log };
