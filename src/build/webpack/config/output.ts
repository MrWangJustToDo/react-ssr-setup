import path from "path";

import type { GenerateActionProps } from "./type";
import type { Configuration } from "webpack";

const outputPath = (env: "server" | "client", isDEV: boolean) => path.resolve(process.cwd(), isDEV ? "dev" : "dist", env);

export const outputConfig = ({ env, isDEV, isMIDDLEWARE = false }: GenerateActionProps): Configuration["output"] =>
  env === "client"
    ? {
        clean: true,
        // 输出路径
        path: outputPath(env, Boolean(isDEV)),
        // 输出文件名
        filename: isDEV ? "[name].js" : "[name]-[contenthash].js",
        // 按需加载的chunk名
        chunkFilename: isDEV ? "[name].js" : "[name]-[contenthash].js",
        // 引入资源的url路径
        publicPath: isDEV
          ? isMIDDLEWARE
            ? "/dev/"
            : `http://${process.env.DEV_HOST}:${process.env.WDS_PORT}/dev/`
          : `http://${process.env.PROD_HOST}:${process.env.PROD_PORT}/client/`,
      }
    : {
        clean: true,
        path: outputPath(env, Boolean(isDEV)),
        // 输出文件名
        filename: "app.js",
        // 按需加载的chunk名
        chunkFilename: isDEV ? "[name].js" : "[name]-[contenthash].js",
        // 引入资源的url路径
        publicPath: isDEV
          ? isMIDDLEWARE
            ? "/dev/"
            : `http://${process.env.DEV_HOST}:${process.env.WDS_PORT}/dev/`
          : `http://${process.env.PROD_HOST}:${process.env.PROD_PORT}/client/`,
        library: {
          type: "commonjs2",
        },
      };
