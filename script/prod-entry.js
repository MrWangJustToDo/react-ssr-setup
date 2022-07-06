const webpack = require("webpack");
const { compilerPromise } = require("./compiler");
const { config } = require("../webpack/webpack.config");
const { DynamicRouter, dynamicCache } = require("./dynamic");

const withPromise = async () => {
  await new DynamicRouter(dynamicCache, "universal").getDynamicRouter();
  const multiConfig = config(false);
  const multiCompiler = webpack(multiConfig);
  const clientCompiler = multiCompiler.compilers.find((compiler) => compiler.name === "client");
  const serverCompiler = multiCompiler.compilers.find((compiler) => compiler.name === "server");
  const clientPromise = compilerPromise("client", clientCompiler, { development: false });
  const serverPromise = compilerPromise("server", serverCompiler, { development: false });
  serverCompiler.run();
  clientCompiler.run();
  try {
    return await Promise.all([clientPromise, serverPromise]);
  } catch (e) {
    console.error(e.message);
  }
};

module.exports.withPromise = withPromise;
