const webpack = require("webpack");
const chalk = require("chalk");
const { ClientConfig } = require("../webpack/webpack.client.prod.config");

const buildClient = (clientEntryPoint) => {
  const clientOptions = ClientConfig(clientEntryPoint);
  const compiler = webpack(clientOptions);

  compiler.hooks.done.tap("done", function () {
    console.log(chalk.green("production client code compiler done"));
  });

  compiler.run();
};

if (process.env.CLIENTENTRY) {
  buildClient(process.env.CLIENTENTRY);
} else {
  console.log(chalk.red("CLIENTENTRY env not exist！"));
}