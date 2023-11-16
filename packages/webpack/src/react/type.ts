import type { DefineUniversalWebpackConfigProps, SafeDefineUniversalWebpackConfigProps, SafeGenerateActionProps } from "../base";
import type { Configuration } from "webpack";

type TOOL = {
  SWC?: boolean;
  ESBUILD?: boolean;
};

export type SafeDefineUniversalWebpackConfigPropsWithReact = SafeDefineUniversalWebpackConfigProps &
  TOOL & {
    isSSR: boolean;
    isCSR: boolean;
  };

export type SafeGenerateActionPropsWithReact = SafeGenerateActionProps &
  TOOL & {
    isSSR: boolean;
    isCSR: boolean;
  };

export type DefineUniversalWebpackConfigPropsWithReact = Omit<DefineUniversalWebpackConfigProps, "webpackServer" | "webpackClient"> &
  TOOL & {
    isSSR?: boolean;
    isCSR?: boolean;
    webpackServer?: (props: SafeGenerateActionPropsWithReact) => Partial<Configuration>;
    webpackClient?: (props: SafeGenerateActionPropsWithReact) => Partial<Configuration>;
  };
