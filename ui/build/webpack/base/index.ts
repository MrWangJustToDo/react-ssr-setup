import { config, singleConfig } from "./webpack.config";

export * from "./type";

export * from "webpack-merge";

export const definedUniversalWebpackConfig = config;

export const definedWebpackConfig = singleConfig;

export { MANIFEST } from "./utils";
