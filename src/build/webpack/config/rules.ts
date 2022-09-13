import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";

import type { GenerateActionProps } from "./type";
import type { RuleSetRule, RuleSetUseItem } from "webpack";

const cssRules = ({ env, isDEV = true }: GenerateActionProps): RuleSetRule => ({
  test: /\.s?css$/,
  use: [
    env === "client" && (isDEV ? { loader: "style-loader" } : { loader: MiniCssExtractPlugin.loader }),
    { loader: "css-loader" },
    { loader: "postcss-loader" },
    { loader: "sass-loader" },
  ].filter(Boolean) as RuleSetUseItem[],
  exclude: /\.module\.s?css$/,
});

const jsRulesWithSWC = (): RuleSetRule => ({
  test: /\.[jt]sx?$/,
  exclude: /node_modules/,
  use: {
    loader: "swc-loader",
  },
});

const jsRules = ({ env, isDEV }: GenerateActionProps): RuleSetRule => ({
  test: /\.[jt]sx?$/,
  exclude: /node_modules/,
  use: {
    loader: "babel-loader",
    options: {
      cacheDirectory: true,
      plugins: env === "client" ? [isDEV && "react-refresh/babel"].filter(Boolean) : ["@babel/plugin-transform-modules-commonjs"],
    },
  },
});

const jsRulesWithESBuild = (): RuleSetRule => ({
  test: /\.jsx?$/,
  exclude: /node_modules/,
  use: {
    loader: "esbuild-loader",
    options: {
      loader: "jsx",
      target: "esnext",
      jsx: "automatic",
    },
  },
});

const tsRulesWithESBuild = (): RuleSetRule => ({
  test: /\.tsx?$/,
  exclude: /node_modules/,
  use: {
    loader: "esbuild-loader",
    options: {
      loader: "tsx",
      tsconfigRaw: require("../../../../tsconfig.json"),
    },
  },
});

const cssModuleRules = ({ env, isDEV = true }: GenerateActionProps): RuleSetRule => ({
  test: /\.module\.s?css$/,
  use: [
    // 分离打包css文件
    env === "client" &&
      (isDEV
        ? { loader: "style-loader" }
        : {
            loader: MiniCssExtractPlugin.loader,
          }),
    // 启用js中import css为对象，启用css module以及生成的类名
    {
      loader: "css-loader",
      options: {
        importLoaders: 2,
        modules: {
          mode: "local",
          localIdentName: isDEV ? "[name]__[local]--[hash:base64:5]" : "[contenthash:base64:6]",
          // ssr 模式下导出className标识符
          exportOnlyLocals: env === "client" ? false : true,
        },
      },
    },
    // 启用can i use中不同浏览器前缀支持
    { loader: "postcss-loader" },
    // 启用sass支持
    { loader: "sass-loader" },
  ].filter(Boolean) as RuleSetUseItem[],
  exclude: [path.resolve(process.cwd(), "node_modules")],
});

const resourceRules = ({ env, isDEV = true }: GenerateActionProps): RuleSetRule => ({
  test: /\.(woff2?|ttf|eot|svg|jpe?g|png|gif|ico)(\?v=\d+\.\d+\.\d+)?$/,
  loader: "file-loader",
  options: {
    name: isDEV ? "[name]-[hash].[ext]" : "[name]-[contenthash].[ext]",
    esModule: false,
    // 是否生成文件
    emitFile: env === "client" ? true : false,
  },
});

export const rulesConfig = ({ env, isDEV }: GenerateActionProps): RuleSetRule[] => {
  const isUSE_SWC = process.env.SWC && JSON.parse(process.env.SWC) && (!process.env.ESBUILD || !JSON.parse(process.env.ESBUILD));

  const isUSE_ESBUILD = process.env.ESBUILD && JSON.parse(process.env.ESBUILD) && (!process.env.SWC || !JSON.parse(process.env.SWC));

  const isUSE_BABEL = !isUSE_SWC && !isUSE_ESBUILD;

  return [
    cssRules({ env, isDEV }),
    isUSE_BABEL && jsRules({ env, isDEV }),
    isUSE_SWC && jsRulesWithSWC(),
    isUSE_ESBUILD && jsRulesWithESBuild(),
    isUSE_ESBUILD && tsRulesWithESBuild(),
    cssModuleRules({ env, isDEV }),
    resourceRules({ env, isDEV }),
  ].filter(Boolean);
};
