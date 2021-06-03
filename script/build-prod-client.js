const chalk = require("chalk");
const webpack = require("webpack");
const { ClientConfig } = require("../webpack/webpack.client.config");

const buildClient = (clientEntryPoint) => {
  const clientOptions = ClientConfig(clientEntryPoint, false);
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
