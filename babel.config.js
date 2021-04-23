module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV);

  const presets = [];
  const plugins = [];

  presets.push("@babel/preset-react");
  presets.push("@babel/preset-env");
  presets.push("@babel/preset-typescript");

  plugins.push(["@babel/plugin-proposal-decorators", { legacy: true }]);
  plugins.push(["@babel/plugin-proposal-class-properties", { loose: true }]);
  plugins.push("@babel/plugin-proposal-object-rest-spread");
  plugins.push("@babel/plugin-proposal-optional-chaining");
  plugins.push("@babel/plugin-syntax-dynamic-import");
  plugins.push("@babel/plugin-transform-runtime");
  plugins.push("@babel/plugin-proposal-export-default-from");
  plugins.push("@loadable/babel-plugin");

  return {
    presets,
    plugins,
  };
};
