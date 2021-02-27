import chalk from "chalk";
import PrettyError from "pretty-error";

const pre = new PrettyError();

enum level {
  "normal",
  "warn",
  "error",
}

const log = (message: string | Error, lev: level) => {
  if (lev === level.error) {
    if (__SERVER__) {
      console.log(pre.render(message));
    } else {
      console.log(chalk.red(message.toString()));
    }
  } else if (lev === level.warn) {
    console.log(chalk.green(message.toString()));
  } else {
    if (__DEVELOPMENT__) {
      console.log(message);
    }
  }
};

export { level, log };
