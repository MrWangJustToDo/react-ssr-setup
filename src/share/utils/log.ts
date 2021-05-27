import chalk from "chalk";

const log = (message: string | Error, lev: "normal" | "warn" | "error"): void => {
  if (lev === "error") {
    if (__SERVER__) {
      if (message instanceof Error) {
        throw Error;
      } else {
        throw new Error(message);
      }
    } else {
      console.log(`[${new Date().toISOString()}]`, chalk.red(message.toString()));
    }
  } else if (lev === "warn") {
    console.log(`[${new Date().toISOString()}]`, chalk.yellow(message.toString()));
  } else {
    if (__DEVELOPMENT__) {
      console.log(`[${new Date().toISOString()}]`, chalk.blue(message.toString()));
    }
  }
};

export { log };
