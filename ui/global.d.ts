declare global {
  const __CLIENT__: boolean;
  const __SERVER__: boolean;
  const __VITE__: boolean;
  const __CSR__: boolean;
  const __SSR__: boolean;
  const __BUNDLE_SCOPE__: string;
  const __OUTPUT_SCOPE__: string;
  const __DEVELOPMENT__: boolean;
  const __MIDDLEWARE__: boolean;
  const __ANIMATE_ROUTER__: boolean;
  const __BUILD_TIME__: string;

  interface Window {
    __INITIAL_PROPS_SSR__: { [key: string]: any };
    __PRELOAD_STORE_STATE__: { [key: string]: any };
    __ENV__: {
      LANG: string;
      isSSR: boolean;
      isSTATIC: boolean;
      isPURE_CSR: boolean;
      isMIDDLEWARE: boolean;
      isDEVELOPMENT: boolean;
      isANIMATE_ROUTER: boolean;
      PUBLIC_API_HOST: string;
    };
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      DEV_HOST: string;
      DEV_PORT: string;
      WDS_PORT: string;
      PROD_PORT: string;
      FRAMEWORK: "webpack" | "vite";
      DEV_CHECK: string;
      SWC: string;
      ESBUILD: string;
      SSR: string;
      CSR: string;
      BUNDLE_SCOPE: string;
      OUTPUT_SCOPE: string;
      STATIC_GENERATE: "true" | "false";
      PUBLIC_DEV_API_HOST: string;
      PUBLIC_PROD_API_HOST: string;
      SERVER_ENTRY: string;
      CLIENT_ENTRY: string;
      MIDDLEWARE: string;
      MIDDLEWARE_VITE: string;
      ANIMATE_ROUTER: string;
    }
  }

  module "*.bmp" {
    const src: string;
    export default src;
  }

  module "*.gif" {
    const src: string;
    export default src;
  }

  module "*.jpg" {
    const src: string;
    export default src;
  }

  module "*.jpeg" {
    const src: string;
    export default src;
  }

  module "*.png" {
    const src: string;
    export default src;
  }

  module "*.webp" {
    const src: string;
    export default src;
  }

  module "*.module.css" {
    const css: { readonly [key: string]: string };
    export default css;
  }

  module "*.css" {
    const css: { readonly [key: string]: string };
    export default css;
  }

  module "*.module.scss" {
    const classes: { readonly [key: string]: string };
    export default classes;
  }

  module "*.scss" {
    const classes: { readonly [key: string]: string };
    export default classes;
  }
}

export {};
