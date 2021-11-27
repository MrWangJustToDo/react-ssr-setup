/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-var */
import chalk from "chalk";
// import PrettyError from "pretty-error";

if (__SERVER__) {
  var PrettyError = require("pretty-error");
  var pre = new PrettyError();
}

const side = __CLIENT__ ? "client" : "server";

const log = (message: string | Error, lev: "normal" | "warn" | "error") => {
  if (lev === "error") {
    if (side === "server") {
      if (message instanceof Error) {
        console.log(`[${side}]`, pre.render(message));
      } else {
        console.log(`[${side}]`, pre.render(new Error(message)));
      }
    } else {
      console.log(`[client]`, chalk.red(message.toString()));
    }
  } else if (lev === "warn") {
    console.log(`[${side}]`, chalk.green(message.toString()));
  } else {
    if (__DEVELOPMENT__) {
      console.log(`[${side}]`, message.toString());
    }
  }
};

export { log };
