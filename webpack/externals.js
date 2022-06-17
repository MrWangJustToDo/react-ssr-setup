// 排除项
const nodeExternals = require("webpack-node-externals");

const externalsConfig = ({ env }) => {
  if (env === "server") {
    return [
      nodeExternals({
        // load non-javascript files with extensions, presumably via loaders
        allowlist: [/\.(?!(?:jsx?|json)$).{1,5}$/i],
      }),
    ];
  }
};

exports.externalsConfig = externalsConfig;
