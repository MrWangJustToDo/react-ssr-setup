module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  globals: { __DEVELOPMENT__: true },
  modulePathIgnorePatterns: ["dist", "dev"],
  testMatch: ["<rootDir>/packages/**/*.spec.[jt]s?(x)", "<rootDir>/ui/**/*.spec.[jt]s?(x)"],
  moduleNameMapper: {
    "^@react-ssr-setup/(.*)$": ["<rootDir>/ui/src", "<rootDir>/packages/$1/src"],
    "^lodash-es$": "lodash",
  },
};
