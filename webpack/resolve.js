const path = require("path");

const resolveConfig = () => {
  const basePath = path.resolve(process.cwd());
  return {
    alias: {
      server: path.resolve(basePath, "src", "server"),
      client: path.resolve(basePath, "src", "client"),
      share: path.resolve(basePath, "src", "share"),
      hooks: path.resolve(basePath, "src", "hooks"),
      router: path.resolve(basePath, "src", "router"),
      config: path.resolve(basePath, "src", "config"),
      pages: path.resolve(basePath, "src", "pages"),
      types: path.resolve(basePath, "src", "types"),
      components: path.resolve(basePath, "src", "components"),
    },
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".css", ".scss"],
  };
};

exports.resolveConfig = resolveConfig;
