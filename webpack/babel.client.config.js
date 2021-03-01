module.exports = {
  presets: ["@babel/preset-react", "@babel/preset-env", "@babel/preset-typescript"],
  plugins: [
    "@babel/proposal-object-rest-spread",
    "@babel/proposal-class-properties",
    "@babel/proposal-optional-chaining",
    "@babel/syntax-dynamic-import",
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-export-default-from",
    "@babel/plugin-proposal-export-namespace-from",
  ],
};
