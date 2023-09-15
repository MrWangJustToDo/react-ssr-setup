import type { DefineUniversalWebpackConfigProps, SafeDefineUniversalWebpackConfigProps, SafeGenerateActionProps } from "../base";
import type { Configuration } from "webpack";

export type SafeDefineUniversalWebpackConfigPropsWithReact = SafeDefineUniversalWebpackConfigProps & {
  isSSR: boolean;
  isCSR: boolean;
  SWC?: boolean;
  ESBUILD?: boolean;
};

export type SafeGenerateActionPropsWithReact = SafeGenerateActionProps & {
  isSSR: boolean;
  isCSR: boolean;
  SWC?: boolean;
  ESBUILD?: boolean;
};

export type DefineUniversalWebpackConfigPropsWithReact = Omit<DefineUniversalWebpackConfigProps, "webpackServer" | "webpackClient"> & {
  isSSR?: boolean;
  isCSR?: boolean;
  SWC?: boolean;
  ESBUILD?: boolean;
  webpackServer?: (props: SafeGenerateActionPropsWithReact) => Partial<Configuration>;
  webpackClient?: (props: SafeGenerateActionPropsWithReact) => Partial<Configuration>;
};
