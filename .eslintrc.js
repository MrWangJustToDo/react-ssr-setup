module.exports = {
  root: true,
  env: {
    node: true,
  },
  ignorePatterns: ["node_modules/*", "coverage/*", "!.prettierrc"],
  extends: [require.resolve("project-tool/baseLint")],
};
