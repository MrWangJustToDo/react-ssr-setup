const chalk = require("chalk");
const { exec } = require("child_process");
const { resolve } = require("path");

const freePort = (port) => {
  return new Promise((resolve) => {
    if (process.platform && process.platform !== "win32") {
      const args = process.argv.slice(2);

      const portArg = args && args[0];
      if (portArg && portArg.indexOf("--") > 0) {
        port = portArg.split("--")[1];
      }
      const order = `lsof -i :${port}`;
      try {
        exec(order, (err, stdout, stderr) => {
          if (err) {
            resolve();
            return console.log(chalk.green(`port has already free: ${port} \n`));
          }
          stdout.split("\n").filter((line) => {
            const p = line.trim().split(/\s+/);
            const address = p[1];
            if (address != undefined && address != "PID") {
              exec("kill -9 " + address, (err, stdout, stderr) => {
                if (err) {
                  return console.log(chalk.red(`free port error: ${err.toString()}`));
                }
                console.log(chalk.green(`port kill: ${port} \n`));
                resolve();
              });
            }
          });
        });
      } catch (e) {
        console.log(chalk.red(`free port error: ${err.toString()}`));
        resolve();
      }
    } else {
      resolve();
    }
  });
};

exports.freePort = freePort;
