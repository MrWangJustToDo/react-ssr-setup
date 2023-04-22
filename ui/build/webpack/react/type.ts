import type { DefineUniversalWebpackConfigProps, SafeDefineUniversalWebpackConfigProps, SafeGenerateActionProps } from "../base";

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

export type DefineUniversalWebpackConfigPropsWithReact = DefineUniversalWebpackConfigProps & {
  isSSR?: boolean;
  isCSR?: boolean;
  SWC?: boolean;
  ESBUILD?: boolean;
};
