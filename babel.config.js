module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV);

  const presets = [];
  const plugins = [];

  presets.push("@babel/preset-react");
  presets.push("@babel/preset-env");
  presets.push("@babel/preset-typescript");

  plugins.push("@babel/proposal-object-rest-spread");
  plugins.push("@babel/proposal-class-properties");
  plugins.push("@babel/proposal-optional-chaining");
  plugins.push("@babel/syntax-dynamic-import");
  plugins.push("@babel/plugin-transform-runtime");
  // plugins.push("@babel/plugin-transform-modules-commonjs");
  plugins.push("@babel/plugin-proposal-export-default-from");
  plugins.push("@babel/plugin-proposal-export-namespace-from");

  return {
    presets,
    plugins,
  };
};
