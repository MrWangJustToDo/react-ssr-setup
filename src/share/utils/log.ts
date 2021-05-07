import chalk from "chalk";

if (__SERVER__) {
  const PrettyError = require("pretty-error");
  var pre = new PrettyError();
}

const log = (message: string | Error, lev: "normal" | "warn" | "error"): void => {
  if (lev === "error") {
    if (__SERVER__) {
      console.log(pre.render(message));
    } else {
      console.log(chalk.red(message.toString()));
    }
  } else if (lev === "warn") {
    console.log(chalk.green(message.toString()));
  } else {
    if (__DEVELOPMENT__) {
      console.log(message);
    }
  }
};

export { log };
