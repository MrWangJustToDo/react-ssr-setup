import CssMinimizerPlugin from "mini-css-extract-plugin";

import type { GenerateActionProps } from "./type";
import type { Configuration } from "webpack";

export const optimizationConfig = ({ env, isDEV = true }: GenerateActionProps): Configuration["optimization"] => {
  if (env === "client") {
    if (!isDEV) {
      return {
        minimizer: ["...", new CssMinimizerPlugin()],
        moduleIds: "deterministic",
        splitChunks: {
          minChunks: 2,
          minSize: 30000,

          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              enforce: true,
              chunks: "all",
              name(module: { context: string }) {
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)?.[1];

                switch (packageName) {
                  case "react":
                  case "react-dom":
                  case "react-router":
                  case "react-router-dom":
                  case "scheduler":
                  case "object-assign":
                    return "vendor-react";
                  case "@chakra-ui":
                    return "vendor-ui";
                  case "core-js":
                  case "core-js-pure":
                    return "vendor-core-js";
                  case "lodash":
                  case "lodash-es":
                    return "vendor-lodash";
                  default:
                    return "vendor";
                }
              },
            },
          },
        },
        runtimeChunk: {
          name: "runtime",
        },
      };
    }
    return {
      splitChunks: {
        minChunks: 2,
        minSize: 30000,

        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            enforce: true,
            chunks: "all",
            name(module: { context: string }) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)?.[1];

              switch (packageName) {
                case "react":
                case "react-dom":
                case "react-router":
                case "react-router-dom":
                case "scheduler":
                case "object-assign":
                  return "vendor-react";
                case "@chakra-ui":
                  return "vendor-ui";
                case "core-js":
                case "core-js-pure":
                  return "vendor-core-js";
                case "lodash":
                case "lodash-es":
                  return "vendor-lodash";
                default:
                  return "vendor";
              }
            },
          },
        },
      },
      runtimeChunk: {
        name: "runtime",
      },
    };
  }
};
