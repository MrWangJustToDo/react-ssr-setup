const path = require("path");

const resolveConfig = () => {
  const basePath = path.resolve(process.cwd());
  return {
    alias: {
      server: path.resolve(basePath, "src", "server"),
      client: path.resolve(basePath, "src", "client"),
      hooks: path.resolve(basePath, "src", "hooks"),
      router: path.resolve(basePath, "src", "router"),
      config: path.resolve(basePath, "src", "config"),
      pages: path.resolve(basePath, "src", "pages"),
      utils: path.resolve(basePath, "src", "utils"),
      i18n: path.resolve(basePath, "src", "i18n"),
      template: path.resolve(basePath, "src", "template"),
      components: path.resolve(basePath, "src", "components"),
      types: path.resolve(basePath, "src", "types"),
      store: path.resolve(basePath, "src", "store"),
      webpackConfig: path.resolve(basePath, "webpack"),
      script: path.resolve(basePath, "script"),
      lang: path.resolve(basePath, "lang"),
    },
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".css", ".scss"],
  };
};

exports.resolveConfig = resolveConfig;
