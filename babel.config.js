function isWebTarget(caller) {
  return Boolean(caller && caller.target === "web");
}

function isWebpack(caller) {
  return Boolean(caller && caller.name === "babel-loader");
}

module.exports = (api) => {
  const web = api.caller(isWebTarget);
  const webpack = api.caller(isWebpack);

  api.cache.using(() => process.env.NODE_ENV === "production");

  const presets = [];
  const plugins = [];

  presets.push([
    "@babel/preset-env",
    {
      useBuiltIns: web ? "entry" : undefined,
      corejs: web ? "core-js@3" : false,
      targets: !web ? { node: "current" } : undefined,
      modules: webpack ? false : "commonjs",
    },
  ]);
  presets.push("@babel/preset-react");
  presets.push("@babel/preset-typescript");

  plugins.push(["@babel/plugin-proposal-decorators", { legacy: true }]);
  plugins.push(["@babel/plugin-proposal-class-properties", { loose: true }]);
  plugins.push(["@babel/plugin-proposal-private-methods", { loose: true }]);
  // 自带了
  // plugins.push("@babel/plugin-proposal-object-rest-spread");
  // plugins.push("@babel/plugin-proposal-optional-chaining");
  // plugins.push("@babel/plugin-syntax-dynamic-import");
  plugins.push("@babel/plugin-transform-runtime");
  plugins.push("@babel/plugin-proposal-export-default-from");
  plugins.push("@loadable/babel-plugin");

  return {
    presets,
    plugins,
  };
};
