module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV);

  const presets = [];
  const plugins = [];

  presets.push("@babel/preset-env");
  presets.push("@babel/preset-react");

  plugins.push("@babel/proposal-object-rest-spread");
  plugins.push("@babel/proposal-class-properties");
  plugins.push("@babel/proposal-optional-chaining");
  plugins.push("@babel/syntax-dynamic-import");

  return {
    presets,
    plugins,
  };
};
