import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path, { resolve } from "path";

import { safeParse } from "../utils";

import type { SafeGenerateActionProps } from "../type";
import type { RuleSetRule, RuleSetUseItem } from "webpack";

const cssRules = ({ env, isDEV }: SafeGenerateActionProps): RuleSetRule => ({
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
    options: {
      jsc: {
        parser: {
          syntax: "typescript",
          tsx: true,
          decorators: true,
        },
        transform: {
          react: {
            runtime: "automatic",
            pragma: "React.createElement",
            pragmaFrag: "React.Fragment",
            throwIfNamespace: true,
            useBuiltins: false,
          },
        },
      },
    },
  },
});

const jsRules = ({ env, isDEV }: SafeGenerateActionProps): RuleSetRule => ({
  test: /\.[jt]sx?$/,
  exclude: /node_modules/,
  use: {
    loader: "babel-loader",
    options: {
      cacheDirectory: true,
      configFile: resolve(process.cwd(), "babel.config.js"),
      plugins: env === "client" ? [isDEV && "react-refresh/babel"].filter(Boolean) : [],
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
      target: "esnext",
      // tsconfigRaw: require(resolve(process.cwd(), "tsconfig.json")),
    },
  },
});

const cssModuleRules = ({ env, isDEV }: SafeGenerateActionProps): RuleSetRule => ({
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

const resourceRules = ({ env, isDEV }: SafeGenerateActionProps): RuleSetRule => ({
  test: /\.(woff2?|ttf|eot|svg|jpe?g|png|gif|ico)(\?v=\d+\.\d+\.\d+)?$/,
  loader: "file-loader",
  options: {
    name: isDEV ? "[name]-[hash].[ext]" : "[name]-[contenthash].[ext]",
    esModule: false,
    // 是否生成文件
    emitFile: env === "client" ? true : false,
  },
  type: "javascript/auto",
});

export const rulesConfig = ({ SWC, ESBUILD, ...restProps }: SafeGenerateActionProps): RuleSetRule[] => {
  const isUSE_SWC = Boolean(SWC || (process.env.SWC && safeParse(process.env.SWC)));

  const isUSE_ESBUILD = !isUSE_SWC && Boolean(ESBUILD || (process.env.ESBUILD && safeParse(process.env.ESBUILD)));

  const isUSE_BABEL = !isUSE_SWC && !isUSE_ESBUILD;

  return [
    cssRules(restProps),
    isUSE_BABEL && jsRules(restProps),
    isUSE_SWC && jsRulesWithSWC(),
    isUSE_ESBUILD && jsRulesWithESBuild(),
    isUSE_ESBUILD && tsRulesWithESBuild(),
    cssModuleRules(restProps),
    resourceRules(restProps),
  ].filter(Boolean) as RuleSetRule[];
};
