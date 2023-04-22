import path from "path";

import type { SafeGenerateActionProps } from "../type";
import type { Configuration } from "webpack";

const outputPath = (env: "server" | "client", isDEV: boolean, outputScope: string) => path.resolve(process.cwd(), isDEV ? "dev" : "dist", outputScope, env);

export const outputConfig = ({
  env,
  isDEV,
  isMIDDLEWARE,
  DEV_HOST,
  WDS_PORT,
  PROD_HOST,
  PROD_PORT,
  OUTPUT_SCOPE,
}: SafeGenerateActionProps): Configuration["output"] => {
  return env === "client"
    ? {
        clean: true,
        // 输出路径
        path: outputPath(env, Boolean(isDEV), OUTPUT_SCOPE),
        // 输出文件名
        filename: isDEV ? "[name].js" : "[name]-[contenthash].js",
        // 按需加载的chunk名
        chunkFilename: isDEV ? "[name].js" : "[name]-[contenthash].js",
        // 引入资源的url路径
        publicPath: isDEV ? (isMIDDLEWARE ? "/dev/" : `http://${DEV_HOST}:${WDS_PORT}/dev/`) : `http://${PROD_HOST}:${PROD_PORT}/${OUTPUT_SCOPE}client/`,
      }
    : {
        clean: true,
        path: outputPath(env, Boolean(isDEV), OUTPUT_SCOPE),
        // 输出文件名
        filename: "app.js",
        // 按需加载的chunk名
        chunkFilename: isDEV ? "[name].js" : "[name]-[contenthash].js",
        // 引入资源的url路径
        publicPath: isDEV ? (isMIDDLEWARE ? "/dev/" : `http://${DEV_HOST}:${WDS_PORT}/dev/`) : `http://${PROD_HOST}:${PROD_PORT}/${OUTPUT_SCOPE}client/`,
        library: {
          type: "commonjs2",
        },
      };
};
