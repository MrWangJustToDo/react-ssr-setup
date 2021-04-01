module.exports = {
  presets: ["@babel/preset-react", "@babel/preset-typescript"],
  plugins: ["@babel/transform-modules-commonjs", "@babel/syntax-dynamic-import", ["import", { libraryName: "antd", style: "css" }], "@loadable/babel-plugin"],
};
